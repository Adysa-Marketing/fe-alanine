/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link, Navigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "contents/Authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useEffect, useRef, useState } from "react";

import Notif from "contents/Components/Notif";
import axios from "axios";
import Config from "config";

function Register() {
  const [serial, serialSet] = useState("");
  const [referral, referralSet] = useState("");
  const [name, nameSet] = useState("");
  const [username, usernameSet] = useState("");
  const [password, passwordSet] = useState("");
  const [passwordConfirm, passwordConfirmSet] = useState("");
  const [kk, kkSet] = useState("");
  const [email, emailSet] = useState("");
  const [phone, phoneSet] = useState("");
  const [success, successSet] = useState([]);
  const [error, errorSet] = useState([]);
  const [disabledSubmit, disabledSubmitSet] = useState(false);
  const [isRegistered, isRegisteredSet] = useState(false);

  const notifRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get("ref");
    if (referralCode) {
      referralSet(referralCode);
      successSet({ ...success, referral: true });
      errorSet({ ...error, referral: false });
    }
  }, []);

  const handleChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (value) {
      successSet({ ...success, [id]: true });
      errorSet({ ...success, [id]: false });
    } else {
      successSet({ ...success, [id]: false });
      errorSet({ ...error, [id]: true });
    }
  };

  const handleSubmit = () => {
    if (
      success.serial &&
      success.referral &&
      success.name &&
      success.username &&
      success.password &&
      success.passwordConfirm &&
      success.kk &&
      success.email &&
      success.phone
    ) {
      const regexUsername = /^[^\s]*$/;
      const regexPhone = /^(08|628)[0-9]{9,13}$/;
      const regexKK = /^[0-9]{16}$/;
      if (!regexUsername.test(username)) {
        notifRef.current.setShow({
          show: true,
          message: "Username tidak boleh menggunakan spasi",
          color: "warning",
        });
      } else if (password.length < 5) {
        notifRef.current.setShow({
          show: true,
          message: "Password minimal 5 karakter",
          color: "warning",
        });
      } else if (password !== passwordConfirm) {
        notifRef.current.setShow({
          show: true,
          message: "Password Konfirmasi tidak sesuai",
          color: "warning",
        });
      } else if (!regexPhone.test(phone)) {
        notifRef.current.setShow({
          show: true,
          message: "No WhatsApp tidak valid",
          color: "warning",
        });
      } else if (!regexKK.test(kk)) {
        notifRef.current.setShow({
          show: true,
          message: "No NIK harus 16 digit",
          color: "warning",
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !success.kk && (input = "No NIK");
      !success.phone && (input = "No WhatsApp");
      !success.email && (input = "Email");
      !success.passwordConfirm && (input = "Password Konfirmasi");
      !success.password && (input = "Password");
      !success.username && (input = "Username");
      !success.name && (input = "Nama Lengkap");
      !success.referral && (input = "Kode Referral");
      !success.serial && (input = "Kode Serial");

      notifRef.current.setShow({
        show: true,
        message: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
        color: "warning",
      });
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const payload = {
      name,
      username,
      password,
      passwordConfirm,
      email,
      phone,
      serial,
      referral,
      kk,
    };

    axios
      .post(`${Config.ApiUrl}/api/v1/user/register`, payload)
      .then((response) => {
        const result = response.data;
        disabledSubmitSet(false);
        notifRef.current.setShow({
          show: true,
          message: result.message,
          color: "success",
        });
        setInterval(() => {
          isRegisteredSet(true);
        }, 2000);
      })
      .catch((err) => {
        disabledSubmitSet(false);
        console.log("[!] Error : ", err);
        if (err.response?.data) {
          notifRef.current.setShow({
            show: true,
            message: err.response.data
              ? Array.isArray(err.response.data.message)
                ? err.response.data.message[0].message
                : err.response.data.message
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
  };

  if (isRegistered) {
    return <Navigate to="/login" />;
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
            Register
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Pendaftara Anggota Baru
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="text"
                    label="Kode Serial"
                    id="serial"
                    value={serial}
                    onChange={handleChange(serialSet)}
                    onBlur={handleBlur}
                    success={success ? success.serial : false}
                    error={error ? error.serial : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="text"
                    label="Kode Referral"
                    id="referral"
                    value={referral}
                    onChange={handleChange(referralSet)}
                    onBlur={handleBlur}
                    success={success ? success.referral : false}
                    error={error ? error.referral : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="text"
                    label="Name Lengkap"
                    id="name"
                    value={name}
                    onChange={handleChange(nameSet)}
                    onBlur={handleBlur}
                    success={success ? success.name : false}
                    error={error ? error.name : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="text"
                    label="Username"
                    id="username"
                    value={username}
                    onChange={handleChange(usernameSet)}
                    onBlur={handleBlur}
                    success={success ? success.username : false}
                    error={error ? error.username : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="password"
                    label="Password"
                    id="password"
                    value={password}
                    onChange={handleChange(passwordSet)}
                    onBlur={handleBlur}
                    success={success ? success.password : false}
                    error={error ? error.password : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="password"
                    label="Password Konfirmasi"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={handleChange(passwordConfirmSet)}
                    onBlur={handleBlur}
                    success={success ? success.passwordConfirm : false}
                    error={error ? error.passwordConfirm : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="email"
                    label="Email"
                    id="email"
                    value={email}
                    onChange={handleChange(emailSet)}
                    onBlur={handleBlur}
                    success={success ? success.email : false}
                    error={error ? error.email : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    type="text"
                    label="No WhatsApp"
                    id="phone"
                    value={phone}
                    onChange={handleChange(phoneSet)}
                    onBlur={handleBlur}
                    success={success ? success.phone : false}
                    error={error ? error.phone : false}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="No NIK"
                id="kk"
                value={kk}
                onChange={handleChange(kkSet)}
                onBlur={handleBlur}
                success={success ? success.kk : false}
                error={error ? error.kk : false}
                variant="standard"
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleSubmit}
                disabled={disabledSubmit}
                fullWidth
              >
                Daftar Sekarang
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Sudah Punya Akun?{" "}
                <MDTypography
                  component={Link}
                  to="/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  LogIn
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Register;
