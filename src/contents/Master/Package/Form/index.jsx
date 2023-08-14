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
import secureStorage from "libs/secureStorage";

function FormPackage() {
  const [state, setState] = useState({
    title: "",
    id: "",
    name: "",
    amount: "",
    type: null,
    description: "",
    remark: "",
    image: null,
    imageFilename: "",

    types: [
      { id: 1, label: "Bronze" },
      { id: 2, label: "Silver" },
      { id: 3, label: "Gold" },
    ],

    action: "",
    disabledSubmit: false,
    redirect: null,

    error: [],
    success: [],
  });

  const params = useParams();
  const modalNotifRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1, 2].includes(user.roleId)) {
        setState((prev) => ({
          ...prev,
          redirect: "/dashboard",
        }));
      }
      loadPath();
    }
  }, []);

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      setState((prevState) => ({
        ...prevState,
        title: "Tambah Paket",
        action: "create",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        title: "Edit Paket",
        action: "update",
      }));
      loadDetail(params.id);
    }
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/package/get/${id}`)
      .then((response) => {
        const data = response.data.data;

        setState((prev) => ({
          ...prev,
          id: data.id,
          name: data.name,
          amount: data.amount,
          type:
            data.type == "Bronze"
              ? { id: 1, label: "Bronze" }
              : data.type == "Silver"
              ? { id: 2, label: "Silver" }
              : { id: 3, label: "Gold" },
          description: data.description,
          image: data.image,
          remark: data.remark,
          success: {
            ...prev.success,
            name: data.name ? true : false,
            amount: data.amount ? true : false,
            type: data.type ? true : false,
            description: data.description ? true : false,
            image: data.image ? true : false,
            remark: data.remark ? true : false,
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
              redirect: "/master/package",
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
      state.success.amount &&
      state.success.type &&
      state.success.image &&
      state.description &&
      state.remark
    ) {
      if (!/^[1-9][0-9]*$/.test(state.amount)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Harga Paket harus berupa angka dan tidak boleh kurang dari 1",
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !state.success.remark && (input = "Catatan");
      !state.success.description && (input = "Deskripsi");
      !state.success.image && (input = "Gambar");
      !state.success.type && (input = "Type Paket");
      !state.success.amount && (input = "Harga Paket");
      !state.success.name && (input = "Nama Paket");

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
    const formData = new FormData();
    formData.append("id", state.id);
    formData.append("name", state.name);
    formData.append("amount", state.amount);
    formData.append("type", state.type?.label);
    formData.append("image", state.image);
    formData.append("description", state.description);
    formData.append("remark", state.remark);

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/package/${state.action}`, formData)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            setState((prev) => ({
              ...prev,
              redirect: "/master/package",
            }));
          },
        });
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          disabledSubmit: false,
        }));
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

  if (state.redirect) {
    return <Navigate to={state.redirect} />;
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MDBox mt={5} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <MDBox mt={6} mb={8} textAlign="center">
              <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                  {state.title}
                </MDTypography>
              </MDBox>
              <MDTypography variant="h6" fontWeight="regular" color="secondary">
                Informasi ini akan menjelaskan lebih lanjut tentang data paket.
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox mt={-3} mb={3} mx={2}>
                <Stepper alternativeLabel>
                  <Step>
                    <StepLabel>Form Paket</StepLabel>
                  </Step>
                </Stepper>
              </MDBox>
              <MDBox p={2}>
                <MDBox>
                  <MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Nama Paket"
                            id="name"
                            value={state.name}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            success={state.success ? state.success.name : false}
                            error={state.error ? state.error.name : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Harga Paket"
                            id="amount"
                            value={state.amount}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            success={state.success ? state.success.amount : false}
                            error={state.error ? state.error.amount : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={3}>
                            <Autocomplete
                              options={state.types}
                              id="type"
                              value={state.type}
                              onKeyDown={handleKeyDown}
                              onChange={(e, value) => {
                                setState((prev) => ({
                                  ...prev,
                                  type: value,
                                  // success: { ...prev.success, type: true },
                                  // error: { ...prev.error, type: false },
                                }));
                              }}
                              onBlur={handleBlur}
                              variant="standard"
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              fullWidth
                              renderInput={(params) => (
                                <MDInput
                                  {...params}
                                  label="Type Paket"
                                  success={state.success ? state.success.type : false}
                                  error={state.error ? state.error.type : false}
                                  variant="standard"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={0} sm={1}></Grid>
                          <Grid item xs={12} sm={8}>
                            <MDBox mb={2}>
                              <input
                                type="file"
                                name="fileInput"
                                ref={imageRef}
                                onChange={(e) => {
                                  if (e.target.files.length === 1) {
                                    const file = e.target.files[0];
                                    const filename = file.name;
                                    const ext = filename.split(".")[1];
                                    setState((prev) => ({
                                      ...prev,
                                      image: file,
                                      imageFilename: filename,
                                    }));
                                  }
                                }}
                                hidden
                              />
                              <MDInput
                                fullWidth
                                value={state.imageFilename}
                                label="Upload Gambar"
                                variant="standard"
                                onClick={() => {
                                  imageRef.current.click();
                                }}
                                readOnly
                                id="image"
                                onBlur={handleBlur}
                                success={state.success ? state.success.image : false}
                                error={state.error ? state.error.image : false}
                              />
                              <small style={{ color: "red", fontSize: "12px" }}>
                                Maksimal ukuran 2MB
                              </small>
                            </MDBox>
                          </Grid>
                          <MDInput
                            type="text"
                            label="Catatan"
                            id="remark"
                            value={state.remark}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            success={state.success ? state.success.remark : false}
                            error={state.error ? state.error.remark : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </MDBox>
                  <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                    <ButtonBack label={"KEMBALI"} />
                    <MDButton
                      variant="gradient"
                      type="button"
                      color="dark"
                      onClick={handleSubmit}
                      disabled={state.disabledSubmit}
                    >
                      {state.action == "create" ? "Submit" : "Update"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default FormPackage;
