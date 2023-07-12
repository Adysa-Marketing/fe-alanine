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

import { useEffect, useRef, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDEditor from "components/MDEditor";
import MDInput from "components/MDInput";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ModalNotif from "contents/Components/ModalNotif";
import useAxios from "libs/useAxios";
import Config from "config";
import { Link, Navigate, useParams } from "react-router-dom";

import MiniFormCard from "contents/Components/FormCard/MiniFormCard";

function FormAccountBank() {
  const [state, setState] = useState({
    title: "",
    id: "",
    name: "",
    accountName: "",
    accountNumber: "",

    action: "",
    disabledSubmit: false,
    redirect: null,

    error: [],
    success: [],
  });

  const params = useParams();
  const modalNotifRef = useRef();

  useEffect(() => {
    loadPath();
  }, []);

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      setState((prevState) => ({
        ...prevState,
        title: "Tambah Akun Bank",
        action: "create",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        title: "Edit Akun Bank",
        action: "update",
      }));
      loadDetail(params.id);
    }
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/bank/get/${id}`)
      .then((response) => {
        const data = response.data.data;

        setState((prev) => ({
          ...prev,
          id: data.id,
          name: data.name,
          accountName: data.accountName,
          accountNumber: data.noRekening,
          success: {
            ...prev.success,
            name: data.name ? true : false,
            accountName: data.accountName ? true : false,
            accountNumber: data.noRekening ? true : false,
          },
        }));
      })
      .catch((err) => {
        console.log("[!] Error : ", err.response.data);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage:
            err.response && err.response.data
              ? err.response.data?.message
              : err.response.message
              ? err.response.message
              : "Terjadi kesalahan pada system",
          color: "warning",
          onClose: () => {
            setState((prev) => ({
              ...prev,
              redirect: "/master/bank",
            }));
          },
        });
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
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
    if (state.success.name && state.success.accountName && state.success.accountNumber) {
      sendData();
    } else {
      let input = "";
      !state.success.accountNumber && (input = "Nomor Rekening");
      !state.success.accountName && (input = "Nama Pemilik");
      !state.success.name && (input = "Nama Bank");

      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    const payload = {
      id: state.id,
      name: state.name,
      accountName: state.accountName,
      noRekening: state.accountNumber,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/bank/${state.action}`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            setState((prev) => ({
              ...prev,
              redirect: "/master/bank",
            }));
          },
        });
      })
      .catch((err) => {
        if (err.response.data) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage:
              err.response && err.response.data
                ? err.response.data?.message
                : err.response.message
                ? err.response.message
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

  if (state.redirect) {
    return <Navigate to={state.redirect} />;
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MiniFormCard>
        <MDBox p={3} lineHeight={1}>
          <MDTypography variant="h5" fontWeight="medium">
            {state.title}
          </MDTypography>
        </MDBox>

        <MDBox p={3}>
          <MDBox component="form" role="form">
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12} md={12}>
                <MDBox mb={2}>
                  <MDInput
                    id="name"
                    type="text"
                    label="Nama Bank"
                    value={state.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.name : false}
                    error={state.error ? state.error.name : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="accountName"
                    type="text"
                    label="Nama Pemilik"
                    value={state.accountName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.accountName : false}
                    error={state.error ? state.error.accountName : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="accountNumber"
                    type="text"
                    label="Nomor Rekening"
                    value={state.accountNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.accountNumber : false}
                    error={state.error ? state.error.accountNumber : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox pt={3} display="flex" justifyContent="space-between">
                  <MDButton
                    variant="gradient"
                    color="error"
                    component={Link}
                    to={{ pathname: "/master/bank" }}
                  >
                    KEMBALI
                  </MDButton>
                  <MDButton
                    type="button"
                    variant="gradient"
                    color="info"
                    onKeyDown={handleKeyDown}
                    onClick={handleSubmit}
                  >
                    SUBMIT
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MiniFormCard>
    </DashboardLayout>
  );
}

export default FormAccountBank;
