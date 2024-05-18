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
import MiniFormCard from "contents/Components/FormCard/MiniFormCard";
import Footer from "examples/Footer";
import ModalNotif from "contents/Components/ModalNotif";
import useAxios from "libs/useAxios";
import Config from "config";
import { Navigate, useParams } from "react-router-dom";
import ButtonBack from "contents/Components/ButtonBack";
import secureStorage from "libs/secureStorage";

function FormAccountLevel() {
  const [id, idSet] = useState("");
  const [title, titleSet] = useState("");
  const [name, nameSet] = useState("");
  const [amount, amountSet] = useState(0);
  const [remark, remarkSet] = useState("");
  const [action, actionSet] = useState("");
  const [redirect, redirectSet] = useState(null);

  const [error, errorSet] = useState([]);
  const [success, successSet] = useState([]);
  const [disabledSubmit, disabledSubmitSet] = useState(false);

  const params = useParams();
  const modalNotifRef = useRef();

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1, 2].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadPath();
    }
  }, []);

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      titleSet("Tambah Levl Akun");
      actionSet("create");
    } else {
      titleSet("Edit Levl Akun");
      actionSet("update");
      loadDetail(params.id);
    }
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/account-level/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        idSet(`${data.id}`);
        nameSet(data.name);
        amountSet(data.amount);
        remarkSet(data.remark ? data.remark : "");

        successSet({
          ...success,
          name: data.name ? true : false,
          amount: data.amount ? true : false,
          remark: data.remark ? true : false,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/master/account-level");
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
    if (success.name && success.amount && success.remark) {
      if (!/^[1-9][0-9]*$/.test(amount)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Harga Akun Level harus berupa angka dan tidak boleh kurang dari 1",
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !success.remark && (input = "Catatan");
      !success.amount && (input = "Harga");
      !success.name && (input = "Judul");

      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const payload = {
      id: id,
      name: name,
      amount: amount,
      remark: remark,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/account-level/${action}`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            redirectSet("/master/account-level");
          },
        });
      })
      .catch((err) => {
        disabledSubmitSet(false);
        if (err.response?.data) {
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
      <MiniFormCard>
        <MDBox p={3} lineHeight={1}>
          <MDTypography variant="h5" fontWeight="medium">
            {title}
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
                    label="Nama Level"
                    value={name}
                    onChange={(e) => nameSet(e.target.value)}
                    onBlur={handleBlur}
                    success={success ? success.name : false}
                    error={error ? error.name : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="amount"
                    type="text"
                    label="Harga"
                    value={amount}
                    onChange={(e) => amountSet(e.target.value)}
                    onBlur={handleBlur}
                    success={success ? success.amount : false}
                    error={error ? error.amount : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="remark"
                    type="text"
                    label="Catatan"
                    value={remark}
                    onChange={(e) => remarkSet(e.target.value)}
                    onBlur={handleBlur}
                    success={success ? success.remark : false}
                    error={error ? error.remark : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox pt={3} display="flex" justifyContent="space-between">
                  <ButtonBack label={"KEMBALI"} />
                  <MDButton
                    type="button"
                    variant="gradient"
                    color="info"
                    onClick={handleSubmit}
                    disabled={disabledSubmit}
                  >
                    {action == "create" ? "Submit" : "Update"}
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MiniFormCard>
      <Footer />
    </DashboardLayout>
  );
}

export default FormAccountLevel;
