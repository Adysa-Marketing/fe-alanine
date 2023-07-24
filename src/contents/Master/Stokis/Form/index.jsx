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

function FormStokis() {
  const [state, setState] = useState({
    title: "",
    id: "",
    name: "",
    price: "",
    discount: "",
    agenDiscount: "",
    description: "",

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
        title: "Tambah Stokis",
        action: "create",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        title: "Edit Stokis",
        action: "update",
      }));
      loadDetail(params.id);
    }
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/stokis/get/${id}`)
      .then((response) => {
        const data = response.data.data;

        setState((prev) => ({
          ...prev,
          id: data.id,
          name: data.name,
          price: data.price,
          discount: data.discount,
          agenDiscount: data.agenDiscount,
          description: data.description,
          success: {
            ...prev.success,
            name: data.name ? true : false,
            price: data.price ? true : false,
            discount: data.discount ? true : false,
            agenDiscount: data.agenDiscount ? true : false,
            description: data.description ? true : false,
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
    if (
      state.success.name &&
      state.success.price &&
      state.success.discount &&
      state.success.agenDiscount &&
      state.success.description
    ) {
      if (!/^[1-9][0-9]*$/.test(state.price)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Harga Reward harus berupa angka dan tidak boleh kurang dari 1",
        });
      } else if (!/^[1-9][0-9]*$/.test(state.discount)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Harga Diskon harus angka dan tidak boleh kurang dari 1",
        });
      } else if (!/^[1-9][0-9]*$/.test(state.agenDiscount)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Harga Produk Agen harus angka dan tidak boleh kurang dari 1",
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !state.success.description && (input = "Deskripsi");
      !state.success.agenDiscount && (input = "Diskon Produk Agen");
      !state.success.discount && (input = "Harga Diskon Stokis");
      !state.success.price && (input = "Harga Stokis");
      !state.success.name && (input = "Nama Stokis");

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
      price: parseInt(state.price),
      discount: parseInt(state.discount),
      agenDiscount: parseInt(state.agenDiscount),
      description: state.description,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/stokis/${state.action}`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            setState((prev) => ({
              ...prev,
              redirect: "/master/stokis",
            }));
          },
        });
      })
      .catch((err) => {
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
                    id="name"
                    type="text"
                    label="Nama Stokis"
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
                    id="price"
                    type="text"
                    label="Harga Stokis"
                    value={state.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.price : false}
                    error={state.error ? state.error.price : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="discount"
                    type="text"
                    label="Harga Diskon Stokis"
                    value={state.discount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.discount : false}
                    error={state.error ? state.error.discount : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="agenDiscount"
                    type="text"
                    label="Diskon Produk Agen"
                    value={state.agenDiscount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.agenDiscount : false}
                    error={state.error ? state.error.agenDiscount : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                  <MDTypography
                    component="label"
                    variant="button"
                    fontWeight="regular"
                    color="text"
                  >
                    Deskripsi&nbsp;&nbsp;
                  </MDTypography>
                </MDBox>
                <MDEditor
                  id="description"
                  value={state.description}
                  onKeyDown={handleKeyDown}
                  onChange={(content, delta, source, editorue) => {
                    if (content) {
                      setState((prev) => ({
                        ...prev,
                        description: content,
                        success: { ...prev.success, description: true },
                        error: { ...prev.error, description: false },
                      }));
                    }
                  }}
                  onBlur={(previousRange, source, editor) => {
                    const index = previousRange.index;
                    if (index > 0) {
                      setState((prev) => ({
                        ...prev,
                        success: { ...prev.success, description: true },
                        error: { ...prev.error, description: false },
                      }));
                    } else {
                      setState((prev) => ({
                        ...prev,
                        success: { ...prev.success, description: false },
                        error: { ...prev.error, description: true },
                      }));
                    }
                  }}
                />
                <MDBox pt={3} display="flex" justifyContent="space-between">
                  <ButtonBack label={"KEMBALI"} />
                  <MDButton
                    type="button"
                    variant="gradient"
                    color="info"
                    onKeyDown={handleKeyDown}
                    onClick={handleSubmit}
                  >
                    {state.action == "create" ? "Submit" : "Update"}
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

export default FormStokis;
