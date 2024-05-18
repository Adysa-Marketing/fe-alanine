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

function FormCommissionLevel() {
  const [id, idSet] = useState(null);
  const [name, nameSet] = useState("");
  const [percent, percentSet] = useState(0);
  const [level, levelSet] = useState({ id: 1, label: "Level 1" });
  const [remark, remarkSet] = useState("");

  const [title, titleSet] = useState("");
  const [action, actionSet] = useState("");
  const [redirect, redirectSet] = useState(null);

  const [accountLevel, accountLevelSet] = useState(null);
  const [accountLevels, accountLevelsSet] = useState([]);
  const [levels, levelsSet] = useState([
    { id: 1, label: "Level 1" },
    { id: 2, label: "Level 2" },
    { id: 3, label: "Level 3" },
    { id: 4, label: "Level 4" },
    { id: 5, label: "Level 5" },
  ]);

  const [error, errorSet] = useState({});
  const [success, successSet] = useState({ level: true });
  const [disabledSubmit, disabledSubmitSet] = useState(false);

  const params = useParams();
  const modalNotifRef = useRef();

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1, 2].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadAccountLevel();
      loadPath();
    }
  }, []);

  const loadAccountLevel = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/account-level`)
      .then((response) => {
        let data = response.data.data;
        data = data.map((item) => ({ id: item.id, label: item.name }));
        accountLevelsSet(data);
      })
      .catch((err) => console.log("[!] Error :", err));
  };

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      titleSet("Tambah Level Komisi");
      actionSet("create");
    } else {
      titleSet("Edit Level Komisi");
      actionSet("update");
      loadDetail(params.id);
    }
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/commission-level/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        idSet(`${data.id}`);
        nameSet(data.name);
        percentSet(data.percent);
        levelSet(data.level);
        accountLevelSet(
          data.AccountLevel ? { id: data.AccountLevel.id, label: data.AccountLevel.name } : null
        );
        remarkSet(data.remark ? data.remark : "");

        successSet({
          ...success,
          name: data.name ? true : false,
          percent: data.percent ? true : false,
          level: data.level ? true : false,
          accountLevel: data.AccountLevel ? true : false,
          remark: data.remark ? true : false,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/master/commission-level");
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
      success.percent &&
      success.level &&
      success.accountLevel &&
      success.remark
    ) {
      if (!/^[1-9][0-9]*$/.test(percent)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Persentase Komisi harus berupa angka dan tidak boleh kurang dari 1",
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !success.remark && (input = "Catatan");
      !success.accountLevel && (input = "Level Akun");
      !success.level && (input = "Level Komisi");
      !success.percent && (input = "Persentase Komisi");
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
      id: parseInt(id),
      name: name,
      percent: parseInt(percent),
      level: parseInt(level.id),
      accountLevelId: parseInt(accountLevel.id),
      remark: remark,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/commission-level/${action}`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            redirectSet("/master/commission-level");
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
                    label="Nama Level Komisi"
                    value={name}
                    onChange={(e) => nameSet(e.target.value)}
                    onBlur={handleBlur}
                    success={success ? success.name : false}
                    error={error ? error.name : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <Autocomplete
                    options={levels}
                    id="level"
                    value={level}
                    onChange={(e, value) => {
                      levelSet(value);
                    }}
                    onBlur={handleBlur}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    fullWidth
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        label="Level Komisi"
                        success={success ? success.level : false}
                        error={error ? error.level : false}
                      />
                    )}
                    disabled={title == "Edit Level Komisi"}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    id="percent"
                    type="text"
                    label="Persentase Komisi (%)"
                    value={percent}
                    onChange={(e) => percentSet(e.target.value)}
                    onBlur={handleBlur}
                    success={success ? success.percent : false}
                    error={error ? error.percent : false}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <Autocomplete
                    options={accountLevels}
                    id="accountLevel"
                    value={accountLevel}
                    onChange={(e, value) => {
                      accountLevelSet(value);
                    }}
                    onBlur={handleBlur}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    fullWidth
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        label="Level Akun"
                        success={success ? success.accountLevel : false}
                        error={error ? error.accountLevel : false}
                      />
                    )}
                    disabled={title == "Edit Level Komisi"}
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

export default FormCommissionLevel;
