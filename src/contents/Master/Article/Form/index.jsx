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
import ButtonBack from "contents/Components/ButtonBack";

function FormArticle() {
  const [statuses, statusesSet] = useState([
    { id: 1, label: "Aktif" },
    { id: 2, label: "Draft" },
  ]);

  const [id, idSet] = useState("");
  const [title, titleSet] = useState("");
  const [name, nameSet] = useState("");
  const [excerpt, excerptSet] = useState("");
  const [status, statusSet] = useState(null);
  const [description, descriptionSet] = useState("");
  const [remark, remarkSet] = useState("");
  const [action, actionSet] = useState("");
  const [redirect, redirectSet] = useState(null);
  const [image, imageSet] = useState(null);
  const [imageFilename, imageFilenameSet] = useState("");

  const [error, errorSet] = useState([]);
  const [success, successSet] = useState([]);

  const params = useParams();
  const imageRef = useRef();
  const modalNotifRef = useRef();

  useEffect(() => {
    loadPath();
  }, []);

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      titleSet("Tambah Artikel");
      actionSet("create");
    } else {
      titleSet("Edit Artikel");
      actionSet("update");
      loadDetail(params.id);
    }
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/article/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        idSet(data.id);
        nameSet(data.title);
        excerptSet(data.excerpt);
        descriptionSet(data.description);
        statusSet(data.isActive ? { id: 1, label: "Aktif" } : { id: 2, label: "Draft" });
        remarkSet(data.remark);

        successSet({
          ...success,
          name: data.title ? true : false,
          excerpt: data.excerpt ? true : false,
          description: data.description ? true : false,
          status: data.isActive ? true : false,
          remark: data.remark ? true : false,
          image: data.image ? true : false,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/master/article");
          },
        });
      });
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (value) {
      successSet({ ...success, [e.target.id]: true });
      errorSet({ ...error, [e.target.id]: false });
    } else {
      successSet({ ...success, [e.target.id]: false });
      errorSet({ ...error, [e.target.id]: true });
    }
  };

  const handleSubmit = () => {
    if (
      success.name &&
      success.excerpt &&
      success.description &&
      success.status &&
      success.remark &&
      success.image
    ) {
      sendData();
    } else {
      let input = "";
      !success.remark && (input = "Catatan");
      !success.image && (input = "Gambar");
      !success.status && (input = "Status");
      !success.description && (input = "Deksripsi");
      !success.excerpt && (input = "Kutipan");
      !success.name && (input = "Judul");

      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", name);
    formData.append("excerpt", excerpt);
    formData.append("isActive", status?.id);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("remark", remark);

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/article/${action}`, formData)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            redirectSet("/master/article");
          },
        });
      })
      .catch((err) => {
        if (err.response.data) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? Array.isArray(err.response.data?.message)
                ? err.response.data?.message[0].message
                : err.response.data?.message
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

  if (redirect) {
    return <Navigate to={redirect} />;
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
                  {title}
                </MDTypography>
              </MDBox>
              <MDTypography variant="h6" fontWeight="regular" color="secondary">
                Informasi ini akan menjelaskan lebih lanjut tentang data artikel.
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox mt={-3} mb={3} mx={2}>
                <Stepper alternativeLabel>
                  <Step>
                    <StepLabel>Form Artikel</StepLabel>
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
                            label="Judul"
                            id="name"
                            value={name}
                            onChange={(e) => nameSet(e.target.value)}
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
                            label="Kutipan"
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => excerptSet(e.target.value)}
                            onBlur={handleBlur}
                            success={success ? success.excerpt : false}
                            error={error ? error.excerpt : false}
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
                            value={description}
                            onChange={(content, delta, source, editorue) => {
                              if (content) {
                                descriptionSet(content);
                                successSet({ ...success, description: true });
                                errorSet({ ...error, description: false });
                              }
                            }}
                            onBlur={(previousRange, source, editor) => {
                              const index = previousRange.index;
                              if (index > 0) {
                                successSet({ ...success, description: true });
                                errorSet({ ...error, description: false });
                              } else {
                                successSet({ ...success, description: false });
                                errorSet({ ...error, description: true });
                              }
                            }}
                          />
                        </Grid>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={3}>
                            <Autocomplete
                              options={statuses}
                              id="status"
                              value={status}
                              onChange={(e, newValue) => {
                                statusSet(newValue);
                                successSet({ ...success, status: true });
                                errorSet({ ...error, status: false });
                              }}
                              onBlur={handleBlur}
                              variant="standard"
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              fullWidth
                              renderInput={(params) => (
                                <MDInput
                                  {...params}
                                  label="Status Artikel"
                                  success={success ? success.status : false}
                                  error={error ? error.status : false}
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
                                    imageSet(file);
                                    imageFilenameSet(filename);
                                    successSet({ ...success, image: true });
                                    errorSet({ ...error, error: false });
                                  }
                                }}
                                hidden
                              />
                              <MDInput
                                fullWidth
                                value={imageFilename}
                                label="Upload Gambar"
                                variant="standard"
                                onClick={() => {
                                  imageRef.current.click();
                                }}
                                readOnly
                                id="image"
                                onBlur={handleBlur}
                                success={success ? success.image : false}
                                error={error ? error.image : false}
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
                            value={remark}
                            onChange={(e) => remarkSet(e.target.value)}
                            onBlur={handleBlur}
                            success={success ? success.remark : false}
                            error={error ? error.remark : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </MDBox>
                  <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                    <ButtonBack label={"KEMBALI"} />
                    <MDButton variant="gradient" type="button" color="dark" onClick={handleSubmit}>
                      {action == "create" ? "Submit" : "Update"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FormArticle;
