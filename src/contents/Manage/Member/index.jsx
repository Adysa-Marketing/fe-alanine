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

function Member() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Action", accessor: "action", width: "15%" },
    { Header: "No", accessor: "no", width: "5%" },
    { Header: "Nama", accessor: "name", width: "20%" },
    { Header: "Username", accessor: "username", width: "20%" },
    { Header: "Email", accessor: "email", width: "20%" },
    { Header: "No Telpon", accessor: "phone", width: "20%" },
    { Header: "Level Akun", accessor: "accountLevel", width: "15%" },
    { Header: "Poin", accessor: "point", width: "15%" },
    { Header: "Saldo", accessor: "wallet", width: "25%" },
    { Header: "Gender", accessor: "gender", width: "15%" },
    { Header: "Status", accessor: "status", width: "15%" },
    { Header: "Tgl Daftar", accessor: "createdAt", width: "25%" },
  ]);

  const [redirect, redirectSet] = useState(null);
  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([
    { id: 1, label: "Aktif" },
    { id: 2, label: "Disable" },
  ]);

  const [gender, genderSet] = useState(null);
  const [genders, gendersSet] = useState([
    { id: 1, label: "Male" },
    { id: 2, label: "Female" },
  ]);

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user && ![1, 2].includes(user.roleId)) {
      redirectSet("/dashboard");
    }
    if (user) {
      loadData();
    }
  }, []);

  const loadData = (params) => {
    isLoadingSet(true);
    const user = secureStorage.getItem("user");

    const statusId = params && params.statusId ? { statusId: params.statusId } : {};
    const queryGender = params && params.gender ? { gender: params.gender } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      ...statusId,
      ...queryGender,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/manage/member/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          const statusId = item.isActive ? 1 : 2;
          const levelData = item.AccountLevel
            ? { id: item.AccountLevel.id, label: item.AccountLevel.name }
            : { id: 1, label: "SILVER" }; // level id lama

          return {
            no,
            name: item.name,
            username: item.username,
            email: item.email,
            phone: item.phone,
            accountLevel: item.AccountLevel ? item.AccountLevel.name : "-",
            point: item.point,
            wallet: "Rp. " + new Intl.NumberFormat("id-ID").format(item.wallet),
            gender: item.gender,
            createdAt: item.createdAt,
            status: item.isActive ? (
              <MDBadge badgeContent="Aktif" container color="success" />
            ) : (
              <MDBadge badgeContent="Tidak Aktif" container color="error" />
            ),
            action:
              user && [1, 2].includes(user.roleId) ? (
                <ButtonAction
                  id={item.id}
                  urlKey={"manage/member"}
                  refreshData={loadData}
                  detail={true}
                  changePassword={true}
                  changeStatus={true}
                  statusId={statusId}
                  changeAccountLevel={true}
                  oldLevelData={levelData}
                  injectSaldo={true}
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
              Daftar Member
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
                        gender: gender ? gender.label : null,
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
                      gender: gender ? gender.label : null,
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
              <Grid item xs={12} md={3} lg={3}>
                <Autocomplete
                  value={gender}
                  options={genders}
                  onChange={(e, value) => {
                    genderSet(value);
                    loadData({
                      keyword,
                      currentPage: 1,
                      gender: value ? value.label : null,
                      statusId: status ? status.id : null,
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
                    <MDInput sx={{ padding: "0px" }} fullWidth label="Pilih Gender" {...params} />
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
                  gender: gender ? gender.label : null,
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
                    gender: gender ? gender.label : null,
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

export default Member;
