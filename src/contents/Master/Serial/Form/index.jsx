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
import { Navigate, useParams } from "react-router-dom";

import MiniFormCard from "contents/Components/FormCard/MiniFormCard";
import ButtonBack from "contents/Components/ButtonBack";

function FormSeri() {
  const [state, setState] = useState({
    title: "",
    id: "",
    amount: "",
    remark: "",

    disabledSubmit: false,
    redirect: null,

    error: [],
    success: [],
  });

  const modalNotifRef = useRef();

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
    if (state.success.amount && state.success.remark) {
      if (!/^[1-9][0-9]*$/.test(state.amount)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Total Serial harus berupa angka dan tidak boleh kurang dari 1",
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !state.success.remark && (input = "Deskripsi");
      !state.success.amount && (input = "Total Serial");

      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    setState((prev) => ({
      ...prev,
      disabledSubmit: true,
    }));
    const payload = {
      amount: parseInt(state.amount),
      remark: state.remark,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/serial/create`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            setState((prev) => ({
              ...prev,
              redirect: "/master/serial",
            }));
          },
        });
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          disabledSubmit: false,
        }));
        console.log("error : ", err);
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
                    id="amount"
                    type="text"
                    label="Total Serial"
                    value={state.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.amount : false}
                    error={state.error ? state.error.amount : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="remark"
                    type="text"
                    label="Deskripsi"
                    value={state.remark}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.remark : false}
                    error={state.error ? state.error.remark : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox pt={3} display="flex" justifyContent="space-between">
                  <ButtonBack label={"KEMBALI"} />
                  <MDButton
                    type="button"
                    variant="gradient"
                    color="info"
                    onKeyDown={handleKeyDown}
                    onClick={handleSubmit}
                    disabled={state.disabledSubmit}
                  >
                    Submit
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

export default FormSeri;
