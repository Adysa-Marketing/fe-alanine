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

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";
import ButtonAction from "contents/Components/ButtonAction";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
function Admin() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Action", accessor: "action", width: "15%" },
    { Header: "No", accessor: "no", width: "15%" },
    { Header: "Nama", accessor: "name", width: "25%" },
    { Header: "Username", accessor: "username", width: "20%" },
    { Header: "Email", accessor: "email", width: "25%" },
    { Header: "Gender", accessor: "gender", width: "15%" },
    { Header: "Point", accessor: "point", width: "15%" },
    { Header: "Status", accessor: "status", width: "15%" },
  ]);

  const [status, statusSet] = useState(null);
  const [gender, genderSet] = useState(null);
  const [statuses, statusesSet] = useState([
    { id: 1, label: "Aktif" },
    { id: 2, label: "Tidak Aktif" },
  ]);
  const [genders, gendersSet] = useState([
    { key: "Male", label: "Pria" },
    { key: "Female", label: "Wanita" },
  ]);

  const [redirect, redirectSet] = useState(null);

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadData();
    }
  }, []);

  const loadData = (params) => {
    isLoadingSet(true);

    const gender = params && params.gender ? { gender: params.gender } : {};
    const status = params && params.status ? { statusId: params.status } : {};

    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      ...gender,
      ...status,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/admin/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          const statusId = item.isActive ? 1 : 2;
          return {
            no,
            name: item.name,
            username: item.username,
            email: item.email,
            gender: item.gender,
            point: item.point,
            status: item.isActive ? (
              <MDBadge badgeContent="Aktif" container color="success" />
            ) : (
              <MDBadge badgeContent="Tidak Aktif" container color="error" />
            ),
            action: (
              <ButtonAction
                id={item.id}
                urlKey={"/master/admin"}
                refreshData={loadData}
                detail={true}
                edit={true}
                remove={true}
                changePassword={true}
                changeStatus={true}
                statusId={statusId}
              ></ButtonAction>
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
        <MDBox pb={2} mt={{ xs: 2, md: 0 }} display="flex">
          <MDButton
            size="medium"
            color="info"
            variant="gradient"
            component={Link}
            to={{ pathname: "/master/admin/add" }}
          >
            Tambah
          </MDButton>
        </MDBox>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Admin
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
                        gender: gender ? gender.key : null,
                        status: status ? status.id : null,
                      });
                    }
                  }}
                  onChange={(e) => keywordSet(e.target.value)}
                />
              </Grid>
              {/* Status */}
              <Grid item xs={12} md={3} lg={3}>
                <Autocomplete
                  value={status}
                  options={statuses}
                  onChange={(e, value) => {
                    statusSet(value);
                    loadData({
                      keyword,
                      gender: gender ? gender.key : null,
                      currentPage: 1,
                      status: value ? value.id : null,
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
              {/* Gender */}
              <Grid item xs={12} md={3} lg={3}>
                <Autocomplete
                  value={gender}
                  options={genders}
                  onChange={(e, value) => {
                    genderSet(value);
                    loadData({
                      keyword,
                      status: status ? status.id : null,
                      gender: value ? value.key : null,
                      currentPage: 1,
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
                  isOptionEqualToValue={(option, value) => option.key === value.key}
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
                  gender: gender ? gender.key : null,
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
                    gender: gender ? gender.key : null,
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

export default Admin;
