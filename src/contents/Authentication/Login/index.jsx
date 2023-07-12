import { useEffect, useRef, useState } from "react";

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
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-in-cover.jpeg";

import { Navigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import Notif from "contents/Components/Notif";
import Config from "config";
import secureStorage from "libs/secureStorage";
import axios from "axios";
function Login() {
  const [rememberMe, setRememberMe] = useState(true);
  const [username, usernameSet] = useState("");
  const [password, passwordSet] = useState("");
  const [isLogin, isLoginSet] = useState(false);
  const [submitDisabled, submitDisabledSet] = useState(false);

  const notifRef = useRef();
  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) isLoginSet(true);
    else {
      isLoginSet(false);
      secureStorage.removeItem("token");
      secureStorage.removeItem("user");
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
          setInterval(() => {
            isLoginSet(true);
          }, 2000);
        })
        .catch((error) => {
          console.log("[!] Error : ", error);
          submitDisabledSet(false);
          notifRef.current.setShow({
            show: true,
            message:
              error.response && error.response.data
                ? error.response.data?.message
                : "Terjadi kesalahan pada system",
            color: "warning",
          });
        });
    }
  };

  if (isLogin) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <CoverLayout image={bgImage}>
      <Notif ref={notifRef} />
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
                fullWidth
              >
                Login
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up/cover"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Register
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Login;
