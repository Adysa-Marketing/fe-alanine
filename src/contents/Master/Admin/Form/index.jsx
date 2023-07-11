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

// formik components
import { Formik, Form } from "formik";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// NewUser page components
import UserInfo from "contents/Master/Admin/Form/components/UserInfo";
import Address from "contents/Master/Admin/Form/components/Address";
import Profile from "contents/Master/Admin/Form/components/Profile";

// NewUser layout schemas for form and form feilds
import validations from "contents/Master/Admin/Form/schemas/validations";
import form from "contents/Master/Admin/Form/schemas/form";
import initialValues from "contents/Master/Admin/Form/schemas/initialValues";
import useAxios from "libs/useAxios";
import Config from "config";
import ModalNotif from "contents/Components/ModalNotif";
import { actions } from "react-table";
import { Navigate, useParams } from "react-router-dom";
import MDTypography from "components/MDTypography";

function getSteps() {
  return ["Info Dasar", "Alamat", "Profile"];
}

function getStepContent(stepIndex, formData) {
  switch (stepIndex) {
    case 0:
      return <UserInfo formData={formData} />;
    case 1:
      return <Address formData={formData} />;
    case 2:
      return <Profile formData={formData} />;
    default:
      return null;
  }
}

function FormAdmin() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const modalNotifRef = useRef();
  const [redirect, redirectSet] = useState(null);
  const [title, titleSet] = useState("");
  const [action, actionSet] = useState("");
  const params = useParams();

  useEffect(() => {
    loadPath();
  }, []);

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      titleSet("Tambah Data Admin");
      actionSet("create");
      Object.keys(initialValues).forEach((key) => {
        initialValues[key] = "";
      });
    } else {
      titleSet("Ubah Data Admin");
      actionSet("update");
      loadDetail(params.id);
    }
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/admin/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        initialValues.id = data.id;
        initialValues.name = data.name ? data.name : "";
        initialValues.userName = data.username ? data.username : "";
        initialValues.phoneNumber = data.phone ? data.phone : "";
        initialValues.email = data.email ? data.email : "";
        initialValues.address = data.address ? data.address : "";

        const country = {
          id: data.Country?.id,
          label: data.Country?.name,
        };
        const province = {
          id: data.Province?.id,
          label: data.Province?.name,
        };
        const district = {
          id: data.District?.id,
          label: data.District?.name,
        };
        const subDistrict = {
          id: data.SubDistrict?.id,
          label: data.SubDistrict?.name,
        };

        initialValues.country = country ? country : "";
        initialValues.province = province ? province : "";
        initialValues.district = district ? district : "";
        initialValues.subDistrict = subDistrict ? subDistrict : "";

        initialValues.gender = data.gender ? data.gender : "";
        initialValues.nokk = data.kk ? data.kk : "";
        initialValues.bio = data.remark ? data.remark : "";
      })
      .catch((err) => {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/master/admin");
          },
        });
      });
  };
  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  const handleBack = () => setActiveStep(activeStep - 1);

  const submitForm = async (values, actions) => {
    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("username", values.userName);
    formData.append("password", values.password);
    formData.append("repeatPassword", values.confirmPassword);
    formData.append("email", values.email);
    formData.append("phone", values.phoneNumber);
    formData.append("gender", values.gender);
    formData.append("kk", values.nokk);
    formData.append("address", values.address);
    formData.append("countryId", values.country?.id);
    formData.append("provinceId", values.province?.id);
    formData.append("districtId", values.district?.id);
    formData.append("subDistrictId", values.subDistrict?.id);
    formData.append("remark", values.bio);
    formData.append("image", values.image != "" ? values.image : null);

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/admin/${action}`, formData)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            actions.setSubmitting(false);
            actions.resetForm({
              values: "",
            });
            setActiveStep(0);
            redirectSet("/master/admin");
          },
        });
      })
      .catch((err) => {
        if (err.response.data) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? err.response.data?.message.length
                ? err.response.data.message[0].message
                : err.response.data?.message
              : "Terjadi kesalahan pada system",
            color: "warning",
            onClose: () => {
              redirectSet("/master/admin");
            },
          });
        } else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
            onClose: () => {
              redirectSet("/master/admin");
            },
          });
        }
      });
  };

  const handleSubmit = (values, actions) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MDBox py={3} mb={20} height="65vh">
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          <Grid item xs={12} lg={8}>
            <Formik
              initialValues={initialValues}
              validationSchema={currentValidation}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form id={formId} autoComplete="off">
                  <Card sx={{ height: "100%" }}>
                    <MDBox mx={2} mt={-3}>
                      <MDBox
                        p={2}
                        mt={3}
                        lineHeight={1}
                        display="flex"
                        justifyContent={{ xs: "center", md: "flex-start" }}
                      >
                        <MDTypography variant="h5" fontWeight="medium">
                          {title}
                        </MDTypography>
                      </MDBox>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </MDBox>

                    <MDBox p={3}>
                      <MDBox>
                        {getStepContent(activeStep, {
                          values,
                          touched,
                          formField,
                          errors,
                        })}
                        <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                          {activeStep === 0 ? (
                            <MDBox />
                          ) : (
                            <MDButton variant="gradient" color="light" onClick={handleBack}>
                              back
                            </MDButton>
                          )}
                          <MDButton
                            disabled={isSubmitting}
                            type="submit"
                            variant="gradient"
                            color="dark"
                          >
                            {isLastStep ? "send" : "next"}
                          </MDButton>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Card>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FormAdmin;
