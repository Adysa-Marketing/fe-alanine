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

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";
import GetAppIcon from "@mui/icons-material/GetApp";

function Serial() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    // { Header: "Action", accessor: "action", width: "15%" },
    { Header: "No", accessor: "no", width: "15%" },
    { Header: "Nomor Serial", accessor: "serialNumber", width: "25%" },
    { Header: "Status", accessor: "status", width: "20%" },
    { Header: "DiBuat", accessor: "createdAt", width: "20%" },
    { Header: "DiPakai", accessor: "updatedAt", width: "20%" },
    { Header: "Member", accessor: "member", width: "20%" },
    { Header: "Level Akun", accessor: "accountLevel", width: "20%" },
    { Header: "Deskripsi", accessor: "description", width: "20%" },
  ]);

  const [redirect, redirectSet] = useState(null);
  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([
    { id: 1, label: "Pending" },
    { id: 2, label: "Aktif" },
  ]);
  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");

  // data export
  const [dataSerial, dataSerialSet] = useState([]);

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1, 2].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadData();
    }
  }, []);

  const loadData = (params) => {
    isLoadingSet(true);

    const statusId = params && params.statusId ? { statusId: params.statusId } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      startDate: params && params.startDate ? params.startDate : startDate,
      endDate: params && params.endDate ? params.endDate : endDate,
      ...statusId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/serial/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          const user = item.User ? item.User : null;
          const accountLevl = item.AccountLevel ? item.AccountLevel : null;
          no++;
          return {
            no,
            serialNumber: item.serialNumber,
            status:
              item.status == 1 ? (
                <MDBadge badgeContent="Pending" container color="warning" />
              ) : (
                <MDBadge badgeContent="Aktif" container color="success" />
              ),
            createdAt: moment(item.date).format("DD-MM-YYYY HH:mm:ss"),
            updatedAt: item.updated ? moment(item.updated).format("DD-MM-YYYY HH:mm:ss") : "-",
            member: user ? user.username : "-",
            accountLevel: accountLevl ? accountLevl.name : "-",
            description: <p style={{ wordWrap: "break-word", width: "25em" }}>{item.remark}</p>,
          };
        });

        const dataSer = data.data.map((item) => {
          let serial = item.serialNumber.toString();
          let level = item.AccountLevel ? item.AccountLevel.name : "-";
          return [serial, level];
        });
        dataSerialSet([["SERIAL", "LEVEL AKUN"], ...dataSer]);

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

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(dataSerial);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `data-serial.xlsx`);
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
            to={{ pathname: "/master/serial/add" }}
          >
            Tambah
          </MDButton>
        </MDBox>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Serial
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
                        startDate,
                        endDate,
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
                      startDate,
                      endDate,
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
              {/* Start Date */}
              <Grid item xs={12} md={2} lg={2}>
                <MDDatePicker
                  input={{
                    id: "startDate",
                    placeholder: "Tanggal Awal",
                    fullWidth: true,
                    sx: {
                      ".MuiInputBase-input": {
                        height: "1em !important",
                      },
                    },
                  }}
                  value={startDate}
                  onChange={(value) => {
                    const date = moment(value[0]).format("YYYY-MM-DD");
                    startDateSet(date);
                  }}
                />
              </Grid>
              {/* End Date */}
              <Grid item xs={12} md={2} lg={2}>
                <MDDatePicker
                  input={{
                    id: "endDate",
                    placeholder: "Tanggal Akhir",
                    fullWidth: true,
                    sx: {
                      ".MuiInputBase-input": {
                        height: "1em !important",
                      },
                    },
                  }}
                  value={endDate}
                  onChange={(value) => {
                    const date = moment(value[0]).format("YYYY-MM-DD");
                    endDateSet(date);
                  }}
                />
              </Grid>
              {/* Button Search */}
              <Grid item xs={2} md={1} lg={1}>
                <MDButton
                  color="info"
                  variant="gradient"
                  onClick={() => {
                    loadData({
                      currentPage: 1,
                      startDate,
                      endDate,
                      keyword,
                      statusId: status ? status.id : null,
                    });
                  }}
                  iconOnly
                >
                  <Icon>search</Icon>
                </MDButton>
              </Grid>
              {/* Button Export */}
              <Grid item xs={2} md={1} lg={1}>
                <MDButton
                  color="success"
                  variant="gradient"
                  onClick={() => {
                    exportToExcel();
                  }}
                  iconOnly
                >
                  <GetAppIcon />
                </MDButton>
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
                  startDate,
                  endDate,
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
                    startDate,
                    endDate,
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

export default Serial;
