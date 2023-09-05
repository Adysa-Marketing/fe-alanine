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
function Login({ status }) {
  const [rememberMe, setRememberMe] = useState(true);
  const [username, usernameSet] = useState("");
  const [password, passwordSet] = useState("");
  const [isLogin, isLoginSet] = useState(false);
  const [submitDisabled, submitDisabledSet] = useState(false);
  const [redirect, redirectSet] = useState(null);

  // reset password
  const [resetPass, resetPassSet] = useState("");
  const [submitResetDisabled, submitResetDisabledSet] = useState(false);
  const [verify, verifySet] = useState(false);

  const notifRef = useRef();
  const dialogFormRef = useRef();

  useEffect(() => {
    if (status == "signout") {
      secureStorage.removeItem("token");
      secureStorage.removeItem("user");
      redirectSet("/login");
    } else {
      const user = secureStorage.getItem("user");
      if (user) isLoginSet(true);
      else {
        isLoginSet(false);
        secureStorage.removeItem("token");
        secureStorage.removeItem("user");
      }
    }
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleKeyDown = (e) => {
    if (e.key == "Enter") return handleLogin();
  };

  const handleLogin = () => {
    submitDisabledSet(true);
    if (username === "" || password === "") {
      submitDisabledSet(false);
      notifRef.current.setShow({
        show: true,
        message: "Date belum lengkap, mohon lengkapi dahulu",
        color: "warning",
      });
    } else {
      const payload = {
        username,
        password,
      };

      axios
        .post(`${Config.ApiUrl}/api/v1/user/login`, payload)
        .then((response) => {
          const data = response.data.data;
          secureStorage.setItem("user", data.user);
          secureStorage.setItem("token", data.token);
          axios.defaults.headers.Authorization = "Bearer " + data.token;
          submitDisabledSet(false);
          notifRef.current.setShow({
            show: true,
            message: "Login Sukses",
            color: "success",
          });
          setTimeout(() => {
            isLoginSet(true);
          }, 2000);
        })
        .catch((err) => {
          console.log("[!] Error : ", err);
          submitDisabledSet(false);
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
              color: "warning",
            });
          }
        });
    }
  };

  const toggleModal = () => {
    dialogFormRef.current.setShow({ show: true, title: "Lupa Password" });
  };

  const handleKeyDownForget = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      return handleForgetPass();
    }
  };

  const handleForgetPass = () => {
    const regexUsername = /^[^\s]*$/;
    if (!regexUsername.test(resetPass)) {
      notifRef.current.setShow({
        show: true,
        message: "Username tidak boleh menggunakan spasi",
        color: "warning",
      });
    } else if (resetPass !== "") {
      submitResetDisabledSet(false);
      const payload = {
        username: resetPass,
      };

      axios
        .post(`${Config.ApiUrl}/api/v1/user/reset/sendotp`, payload)
        .then((response) => {
          const data = response.data.data;
          secureStorage.setItem("resetPass", data);
          submitResetDisabledSet(false);
          verifySet(true);
        })
        .catch((err) => {
          console.log("[!] Error : ", err);
          submitResetDisabledSet(false);
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
              color: "warning",
            });
          }
        });
    } else {
      notifRef.current.setShow({
        show: true,
        message: "Data masih ada yang kosong, Mohon di lengkapi dahulu",
        color: "warning",
      });
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }
  if (isLogin) {
    return <Navigate to="/dashboard" />;
  }
  if (verify) {
    return <Navigate to="/verification" />;
  }

  return (
    <CoverLayout image={bgImage}>
      <Notif ref={notifRef} />
      <DialogForm ref={dialogFormRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }}>
          <MDBox width="100%" component="form">
            <MDBox my={2}>
              <MDInput
                fullWidth
                type="text"
                value={resetPass}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    resetPassSet(val);
                    submitDisabledSet(true);
                  } else {
                    resetPassSet(val);
                    submitResetDisabledSet(false);
                  }
                }}
                label="Masukan Username Anda"
                onKeyDown={handleKeyDownForget}
              />
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => dialogFormRef.current.setShow({ show: false, title: "" })}
              >
                TUTUP
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={submitResetDisabled}
              onClick={handleForgetPass}
            >
              SUBMIT
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Login
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Masukkan Username dan Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                variant="standard"
                fullWidth
                placeholder="username"
                InputLabelProps={{ shrink: true }}
                value={username}
                onChange={(e) => {
                  usernameSet(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                placeholder="************"
                InputLabelProps={{ shrink: true }}
                value={password}
                onChange={(e) => {
                  passwordSet(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                // disabled={false}
                onClick={handleLogin}
                disabled={submitDisabled}
                fullWidth
              >
                Login
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Belum Punya Akun?{" "}
                <MDTypography
                  component={Link}
                  to="/register"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Daftar
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography
                onClick={toggleModal}
                sx={{ cursor: "pointer" }}
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Lupa passsword ?
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

Login.defaultProps = {
  status: "signin",
};

Login.propTypes = {
  status: PropTypes.string,
};

export default Login;
