import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import MDDatePicker from "components/MDDatePicker";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";
import ButtonAction from "contents/Components/ButtonAction";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
import moment from "moment";

function Agen() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Action", accessor: "action", width: "15%" },
    { Header: "No", accessor: "no", width: "10%" },
    { Header: "Nama", accessor: "name", width: "20%" },
    { Header: "Level Akun", accessor: "accountLevel", width: "15%" },
    { Header: "Status", accessor: "status", width: "20%" },
    { Header: "Tanggal Approve", accessor: "dateApproved", width: "20%" },
    { Header: "Stokis", accessor: "stokis", width: "20%" },
    { Header: "Diskon Produk Agen", accessor: "agenDiscount", width: "30%" },
  ]);

  const [redirect, redirectSet] = useState(null);
  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([]);

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user && ![1, 2].includes(user.roleId)) {
      redirectSet("/dashboard");
    }
    if (user) {
      loadAgenStatus();
      loadData();
    }
  }, []);

  const loadAgenStatus = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/agen-status`)
      .then((response) => {
        let data = response.data.data;
        data = data.map((status) => {
          return {
            id: status.id,
            label: status.name,
          };
        });

        statusesSet(data);
      })
      .catch((error) => console.log("[!] Error :", error));
  };

  const loadData = (params) => {
    isLoadingSet(true);
    const user = secureStorage.getItem("user");

    const statusId = params && params.statusId ? { statusId: params.statusId } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      ...statusId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/manage/agen/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          const agenStatus = item.AgenStatus;
          const levelData = item.AccountLevel
            ? { id: item.AccountLevel.id, label: item.AccountLevel.name }
            : { id: 1, label: "SILVER" }; // level id lama
          return {
            no,
            name: `${item.name} - (${item.User?.username})`,
            accountLevel: item.User && item.User.AccountLevel ? item.User.AccountLevel.name : "-",
            status: agenStatus ? (
              <MDBadge
                variant="contained"
                badgeContent={agenStatus.name}
                size="lg"
                color={
                  agenStatus.id === 1
                    ? "secondary"
                    : agenStatus.id === 2
                    ? "error"
                    : agenStatus.id === 3
                    ? "warning"
                    : "success"
                }
              />
            ) : (
              "-"
            ),
            dateApproved: item.dateApproved
              ? moment(item.dateApproved).format("DD-MM-YYYY HH:mm:ss")
              : "-",
            stokis: item.Stoki?.name,
            agenDiscount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.Stoki?.agenDiscount),
            action:
              user && [1, 2].includes(user.roleId) ? (
                <ButtonAction
                  id={item.id}
                  urlKey={"manage/agen"}
                  changePassword={true}
                  refreshData={loadData}
                  statusId={agenStatus?.id}
                  disable={true}
                  activate={true}
                  detailAgen={true}
                  userId={item.User?.id}
                  changeAccountLevel={true}
                  oldLevelData={levelData}
                ></ButtonAction>
              ) : (
                "-"
              ),
          };
        });

        totalPagesSet(data.totalPages);
        totalDataSet(data.totalData);
        rowsSet(output);
        isLoadingSet(false);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
        isLoadingSet(false);
      });
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3} my={3}>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Agen
            </MDTypography>
          </MDBox>

          <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} lg={3}>
                <MDInput
                  label="Search..."
                  size="small"
                  fullWidth
                  value={keyword}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      loadData({
                        currentPage: 1,
                        keyword: e.target.value,
                        statusId: status ? status.id : null,
                      });
                    }
                  }}
                  onChange={(e) => keywordSet(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <Autocomplete
                  value={status}
                  options={statuses}
                  onChange={(e, value) => {
                    statusSet(value);
                    loadData({
                      keyword,
                      currentPage: 1,
                      statusId: value ? value.id : null,
                    });
                  }}
                  sx={{
                    ".MuiAutocomplete-input": {
                      padding: "7.5px 5px 7.5px 8px !important",
                    },
                    ".MuiOutlinedInput-root": {
                      padding: "1.5px !important",
                    },
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <MDInput sx={{ padding: "0px" }} fullWidth label="Pilih Status" {...params} />
                  )}
                />
              </Grid>
            </Grid>
          </MDBox>
          <MDBox p={2}>
            <DataTable isLoading={isLoading} tableHead={tableHead} tableData={rows} />
            <Pagination
              totalPages={totalPages}
              totalData={totalData}
              currentPage={currentPage}
              rowsPerPage={[10, 25, 50, "All"]}
              totalButton={3}
              defaultRowsPerPage={rowsPerPage}
              onChangeRowsPerPage={(value) => {
                rowsPerPageSet(value);
                currentPageSet(1);
                loadData({
                  rowsPerPage: value,
                  currentPage: 1,
                  keyword,
                  statusId: status ? status.id : null,
                });
              }}
              onChangePage={(current) => {
                if (current !== currentPage) {
                  currentPageSet(current);
                  loadData({
                    rowsPerPage,
                    currentPage: current,
                    keyword,
                    statusId: status ? status.id : null,
                  });
                }
              }}
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Agen;
