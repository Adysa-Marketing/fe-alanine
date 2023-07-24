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
import useAxios from "libs/useAxios";
import Config from "config";
import ModalNotif from "contents/Components/ModalNotif";

function UserBank() {
  const [state, setState] = useState({
    id: "",
    bankName: "",
    noRekening: "",
    accountName: "",

    action: "create",

    error: [],
    success: [],
  });

  const modalNotifRef = useRef();

  useEffect(() => {
    loadUserBank();
  }, []);

  const loadUserBank = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/setting/bank/get`)
      .then((result) => {
        const data = result.data.data;
        if (data) {
          setState((prev) => ({
            ...prev,
            id: data.id,
            action: "update",
            bankName: data.name,
            noRekening: data.noRekening,
            accountName: data.accountName,
            success: {
              ...prev.success,
              bankName: data.name ? true : false,
              noRekening: data.name ? true : false,
              accountName: data.name ? true : false,
            },
          }));
        }
      })
      .catch((error) => console.log(`[!] Error : ${error}`));
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
    if (state.success.bankName && state.success.noRekening && state.success.accountName) {
      sendData();
    } else {
      let input = "";
      !state.success.accountName && (input = "Nama Pemilik");
      !state.success.noRekening && (input = "Nomor Rekening");
      !state.success.bankName && (input = "Nama Bank");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    const payload = {
      id: state.id,
      name: state.bankName,
      accountName: state.accountName,
      noRekening: state.noRekening,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/setting/bank/${state.action}`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            loadUserBank();
          },
        });
      })
      .catch((err) => {
        if (err.response.data) {
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

  return (
    <Card id="user-bank">
      <ModalNotif ref={modalNotifRef} />
      <MDBox p={3}>
        <MDTypography variant="h5">Data Bank</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="bankName"
              value={state.bankName}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              label="Nama Bank"
              success={state.success ? state.success.bankName : false}
              error={state.error ? state.error.bankName : false}
              inputProps={{ type: "text", autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="noRekening"
              value={state.noRekening}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              label="Nomor Rekening"
              success={state.success ? state.success.noRekening : false}
              error={state.error ? state.error.noRekening : false}
              inputProps={{ type: "text", autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="accountName"
              value={state.accountName}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              label="Nama Pemilik"
              success={state.success ? state.success.accountName : false}
              error={state.error ? state.error.accountName : false}
              inputProps={{ type: "text", autoComplete: "" }}
            />
          </Grid>
        </Grid>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap">
          <MDBox ml="auto" mt={3}>
            <MDButton
              variant="gradient"
              color="dark"
              size="small"
              onKeyDown={handleKeyDown}
              onClick={handleSubmit}
            >
              simpan
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default UserBank;
