import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

// react-router-dom components
import { Link } from "react-router-dom";

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

function Verification() {
  const [verCode, verCodeSet] = useState("");
  const [confirmCode, confirmCodeSet] = useState(null);
  const [redirect, redirectSet] = useState(false);
  const [submitDisabled, submitDisabledSet] = useState(false);
  const [submitRepeatDisabled, submitRepeatDisabledSet] = useState(false);

  const notifRef = useRef();

  useEffect(() => {
    const userReset = secureStorage.getItem("resetPass");
    if (!userReset) {
      redirectSet("/login");
    }
  }, []);

  const handleTimer = () => {
    setTimeout(() => submitRepeatDisabledSet(false), 5 * 1000);
  };

  const handleChangeCode = () => {
    submitRepeatDisabledSet(true);
    handleTimer();
    const userReset = secureStorage.getItem("resetPass");
    const payload = {
      username: userReset.username,
    };

    axios
      .post(`${Config.ApiUrl}/api/v1/user/reset/sendotp`, payload)
      .then((response) => {
        const data = response.data.data;
        secureStorage.setItem("resetPass", data);
        notifRef.current.setShow({
          show: true,
          message: "Kode berhasil dikirim ulang",
          color: "success",
        });
      })
      .catch((err) => {
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
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      return handleSubmit();
    }
  };

  const handleSubmit = () => {
    const userReset = secureStorage.getItem("resetPass");
    if (verCode == "") {
      notifRef.current.setShow *
        {
          show: true,
          message: "Kode Verifikasi masih kosong, mohon dilengkapi terlebih dahulu",
          color: "warning",
        };
    } else {
      submitDisabledSet(false);
      const payload = {
        userId: userReset.id,
        verCode,
      };

      axios
        .post(`${Config.ApiUrl}/api/v1/user/reset/verify`, payload)
        .then((response) => {
          const data = response.data.data;
          confirmCodeSet(data);
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

  if (confirmCode) {
    return <Navigate to={`/reset/${confirmCode}`} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const user = secureStorage.getItem("resetPass");
  return (
    <CoverLayout image={bgImage}>
      <Notif ref={notifRef} />
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
            Verifikasi OTP
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDTypography variant="h6" fontWeight="light" fontSize={14} textAlign="center" my={3}>
              Kode OTP telah dirikim via WhatsApp ke <br /> {user && user.phone}
            </MDTypography>
            <MDTypography variant="h6" fontWeight="medium" textAlign="center" my={3}>
              Masukan Kode Verifikasi OTP
            </MDTypography>
            <MDBox mb={2} textAlign="center" justifyContent="center" align="center">
              <MDInput
                id="vercode"
                type="text"
                textalign="center"
                label="Kode Verifikasi"
                variant="standard"
                mx="auto"
                inputProps={{
                  maxLength: 6,
                  style: { textAlign: "center", fontSize: 25, fontWeight: 500 },
                }}
                onKeyDown={handleKeyDown}
                value={verCode}
                onChange={(e) => verCodeSet(e.target.value)}
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
            <MDBox mt={3} mb={1} textAlign="center">
              <MDButton
                variant="text"
                color="info"
                disabled={submitRepeatDisabled}
                onClick={handleChangeCode}
                fullWidth
              >
                Kirim Ulang Kode
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Verification;
