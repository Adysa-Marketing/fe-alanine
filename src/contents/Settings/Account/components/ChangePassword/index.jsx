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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useEffect, useRef, useState } from "react";
import ModalNotif from "contents/Components/ModalNotif";
import useAxios from "libs/useAxios";
import Config from "config";

function ChangePassword() {
  const [state, setState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",

    error: [],
    success: [],
  });

  const modalNotifRef = useRef();

  useEffect(() => {
    loadEmpty();
  }, []);

  const loadEmpty = () => {
    setState(() => ({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",

      error: [],
      success: [],
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        success: { ...prevState.success, [e.target.id]: true },
        error: { ...prevState.error, [e.target.id]: false },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        success: { ...prevState.success, [e.target.id]: false },
        error: { ...prevState.error, [e.target.id]: true },
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = () => {
    if (state.success.oldPassword && state.success.newPassword && state.success.confirmPassword) {
      if (state.newPassword.length < 5) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: `Password minimal 5 karakter`,
        });
      } else if (state.newPassword !== state.confirmPassword) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: `Password baru harus sama dengan password konfirmasi `,
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !state.success.confirmPassword && (input = "Password Konfirmasi");
      !state.success.newPassword && (input = "Password Baru");
      !state.success.oldPassword && (input = "Password Lama");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    const payload = {
      oldPassword: state.oldPassword,
      password: state.newPassword,
    };

    useAxios()
      .put(`${Config.ApiUrl}/api/v1/setting/user/change-pass`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            loadEmpty();
          },
        });
      })
      .catch((err) => {
        if (err.response?.data) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? Array.isArray(err.response.data.message)
                ? err.response.data.message[0].message
                : err.response.data.message
              : "Terjadi kesalahan pada system",
            color: "warning",
          });
        } else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
            color: "warning",
          });
        }
      });
  };

  const passwordRequirements = [
    "Min 5 karakter",
    "Direkomendasikan menggukan gabungan huruf, angka dan simbol",
    "Disarankan untuk sering merubah password demi menjaga keamanan akun anda",
  ];

  const renderPasswordRequirements = passwordRequirements.map((item, key) => {
    const itemKey = `element-${key}`;

    return (
      <MDBox key={itemKey} component="li" color="text" fontSize="1.25rem" lineHeight={1}>
        <MDTypography variant="button" color="text" fontWeight="regular" verticalAlign="middle">
          {item}
        </MDTypography>
      </MDBox>
    );
  });

  return (
    <Card id="change-password">
      <ModalNotif ref={modalNotifRef} />
      <MDBox p={3}>
        <MDTypography variant="h5">Change Password</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="oldPassword"
              label="Password Lama"
              value={state.oldPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              success={state.success ? state.success.oldPassword : false}
              error={state.error ? state.error.oldPassword : false}
              inputProps={{ type: "password", autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="newPassword"
              label="Password Baru"
              value={state.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              success={state.success ? state.success.newPassword : false}
              error={state.error ? state.error.newPassword : false}
              inputProps={{ type: "password", autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="confirmPassword"
              label="Password Konfirmasi"
              value={state.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              success={state.success ? state.success.confirmPassword : false}
              error={state.error ? state.error.confirmPassword : false}
              inputProps={{ type: "password", autoComplete: "" }}
            />
            <MDTypography variant="button" color="error">
              Password Konfirmasi harus sama dengan password baru
            </MDTypography>
          </Grid>
        </Grid>
        <MDBox mt={6} mb={1}>
          <MDTypography variant="h5">Ketentuan Password</MDTypography>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="body2" color="text">
            Silakan ikuti panduan ini untuk kata sandi yang kuat
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap">
          <MDBox component="ul" m={0} pl={3.25} mb={{ xs: 8, sm: 0 }}>
            {renderPasswordRequirements}
          </MDBox>
          <MDBox ml="auto">
            <MDButton
              variant="gradient"
              color="dark"
              size="small"
              onKeyDown={handleKeyDown}
              onClick={handleSubmit}
            >
              update password
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ChangePassword;
