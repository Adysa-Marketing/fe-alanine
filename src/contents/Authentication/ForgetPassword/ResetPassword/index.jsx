import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

// react-router-dom components
import { Link, useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "contents/Authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-in-cover.jpeg";

import { Navigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import Notif from "contents/Components/Notif";
import Config from "config";
import secureStorage from "libs/secureStorage";
import axios from "axios";
import DialogForm from "contents/Components/DialogForm";
import { Grid } from "@mui/material";
import ModalNotif from "contents/Components/ModalNotif";

function ResetPassword() {
  const [resetPass, resetPassSet] = useState(null);
  const [password, passwordSet] = useState("");
  const [repassword, repasswordSet] = useState("");
  const [confirmCode, confirmCodeSet] = useState("");
  const [isValid, isValidSet] = useState(true);
  const [error, errorSet] = useState([]);
  const [success, successSet] = useState([]);
  const [redirect, redirectSet] = useState(null);
  const [submitDisabled, submitDisabledSet] = useState(false);

  const notifRef = useRef();
  const modalNotifRef = useRef();
  const params = useParams();

  useEffect(() => {
    const code = params?.confirmCode;
    const userReset = secureStorage.getItem("resetPass");

    if (redirect || !userReset || !isValid) {
      redirectSet("/login");
    }
    if (userReset) {
      resetPassSet(userReset);
      isConfirmCodeValid(userReset.id, code);
    }
  }, []);

  const isConfirmCodeValid = (userId, code) => {
    axios
      .post(`${Config.ApiUrl}/api/v1/user/reset/isvalid`, { userId, confirmCode: code })
      .then((response) => {
        isValidSet(true);
        confirmCodeSet(code);
      })
      .catch((err) => {
        console.log("error : ", err);
        isValidSet(false);
      });
  };

  const handleChange = (setState) => (e) => {
    const { id, value } = e.target;
    setState(value);
    switch (id) {
      case "password":
        successSet({ ...success, [id]: true });
        errorSet({ ...error, [id]: false });
        break;
      case "repassword":
        if (value == password) {
          successSet({ ...success, [id]: true });
          errorSet({ ...error, [id]: false });
        } else {
          successSet({ ...success, [id]: false });
          errorSet({ ...error, [id]: true });
        }
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (!value) {
      successSet({ ...success, [id]: false });
      errorSet({ ...error, [id]: true });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      return handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (password == "" || repassword == "") {
      notifRef.current.setShow({
        show: true,
        message: "Password tidak boleh kosong",
        color: "warning",
      });
    } else if (password !== repassword) {
      notifRef.current.setShow({
        show: true,
        message: "Konfirmasi Password tidak sesuai",
        color: "warning",
      });
    } else if (password.length < 5) {
      notifRef.current.setShow({
        show: true,
        message: "Password minimal 5 karakter",
        color: "warning",
      });
    } else {
      submitDisabledSet(true);
      const payload = {
        password,
        confirmCode,
        userId: resetPass.id,
      };

      axios
        .put(`${Config.ApiUrl}/api/v1/user/reset/change`, payload)
        .then((response) => {
          secureStorage.removeItem("resetPass");
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              redirectSet("/login");
            },
          });
        })
        .catch((err) => {
          submitDisabledSet(false);
          console.log("[!] Error : ", err);
          if (err.response?.data) {
            notifRef.current.setShow({
              show: true,
              message: err.response.data
                ? Array.isArray(err.response.data?.message)
                  ? err.response.data?.message[0].message
                  : err.response.data?.message
                : "Terjadi kesalahan pada system",
              color: "warning",
            });
          } else {
            notifRef.current.setShow({
              show: true,
              message: "Koneksi jaringan terputus",
              color: "success",
            });
          }
        });
    }
  };

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <CoverLayout image={bgImage}>
      <Notif ref={notifRef} />
      <ModalNotif ref={modalNotifRef} />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Ubah Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="password"
                id="password"
                value={password}
                onChange={handleChange(passwordSet)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                label="Password Baru"
                error={error ? error.password : false}
                success={success ? success.password : false}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                id="repassword"
                value={repassword}
                onChange={handleChange(repasswordSet)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                label="Konfirmasi Password Baru"
                error={error ? error.repassword : false}
                success={success ? success.repassword : false}
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                disabled={submitDisabled}
                onClick={handleSubmit}
                fullWidth
              >
                Kirim
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default ResetPassword;
