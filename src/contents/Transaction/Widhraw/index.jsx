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
import ButtonAction from "contents/Components/ButtonAction";

function Widhraw() {
  const [user, userSet] = useState(null);
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Action", accessor: "action", width: "15%" },
    { Header: "Kode", accessor: "kode", width: "15%" },
    { Header: "Nama", accessor: "name", width: "15%" },
    { Header: "Bank", accessor: "bankName", width: "20%" },
    { Header: "Penarikan", accessor: "amount", width: "25%" },
    { Header: "Dibayar", accessor: "paidAmount", width: "20%" },
    { Header: "Tanggal Pengajuan", accessor: "createdAt", width: "20%" },
    { Header: "Tanggal Dibayar", accessor: "updatedAt", width: "25%" },
    { Header: "Status", accessor: "status", width: "30%" },
  ]);

  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([]);

  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");

  useEffect(() => {
    const userData = secureStorage.getItem("user");
    userSet(userData);
  }, []);

  useEffect(() => {
    if (user) {
      loadWdStatus();
      loadData();
    }
  }, [user]);

  const loadWdStatus = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/wd-status`)
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

    const statusId = params && params.statusId ? { statusId: params.statusId } : {};
    const payload = {
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      startDate: params && params.startDate ? params.startDate : startDate,
      endDate: params && params.endDate ? params.endDate : endDate,
      ...statusId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/widhraw/list`, payload)
      .then((response) => {
        const data = response.data;
        const output = data.data.map((item) => {
          const wdStatus = item.WdStatus ? item.WdStatus : null;
          return {
            kode: item.kode,
            name: item.User ? item.User.name : "-",
            bankName: `${item.bankName} - ${item.accountName} - ${item.noRekening}`,
            amount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
            paidAmount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.paidAmount),
            createdAt: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: [5].includes(wdStatus?.id)
              ? moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss")
              : "-",
            status: wdStatus ? (
              <MDBadge
                variant="contained"
                badgeContent={wdStatus.name}
                size="lg"
                color={
                  wdStatus.id === 1
                    ? "secondary"
                    : wdStatus.id === 2
                    ? "error"
                    : wdStatus.id === 3
                    ? "warning"
                    : wdStatus.id === 4
                    ? "info"
                    : "success"
                }
              />
            ) : (
              "-"
            ),
            action:
              [1, 2].includes(user.roleId) && [1, 4].includes(wdStatus.id) ? (
                <ButtonAction
                  id={item.id}
                  urlKey={"/trx/widhraw"}
                  refreshData={loadData}
                  statusId={wdStatus.id}
                  detail={true}
                  reject={true}
                  process={true}
                  transfered={true}
                ></ButtonAction>
              ) : [3, 4].includes(user.roleId) && [1, 2, 3].includes(wdStatus.id) ? (
                <ButtonAction
                  id={item.id}
                  urlKey={"/trx/widhraw"}
                  refreshData={loadData}
                  statusId={wdStatus.id}
                  detail={true}
                  edit={[1].includes(wdStatus.id ? true : false)}
                  cancelTrx={true}
                  remove={true}
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3} my={3}>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Widhraw
            </MDTypography>
          </MDBox>

          <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} lg={3}>
                <Autocomplete
                  value={status}
                  options={statuses}
                  onChange={(e, value) => {
                    statusSet(value);
                    loadData({
                      currentPage: 1,
                      startDate,
                      endDate,
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
              {/* Start Date */}
              <Grid item xs={12} md={3} lg={2}>
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
              <Grid item xs={12} md={3} lg={2}>
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
              <Grid item xs={12} md={1} lg={1}>
                <MDButton
                  color="info"
                  variant="gradient"
                  onClick={() => {
                    loadData({
                      currentPage: 1,
                      startDate,
                      endDate,
                      statusId: status ? status.id : null,
                    });
                  }}
                  iconOnly
                >
                  <Icon>search</Icon>
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

export default Widhraw;
