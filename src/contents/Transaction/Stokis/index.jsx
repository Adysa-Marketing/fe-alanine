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
import moment from "moment";

function TrxStokis() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Aksi", accessor: "action", width: "15%" },
    { Header: "Kode", accessor: "kode", width: "15%" },
    { Header: "Status", accessor: "status", width: "15%" },
    { Header: "Nama", accessor: "name", width: "25%" },
    { Header: "Stokis", accessor: "stokis", width: "25%" },
    { Header: "Harga", accessor: "amount", width: "25%" },
    { Header: "Pembayaran", accessor: "paymentType", width: "25%" },
    { Header: "Tanggal", accessor: "date", width: "25%" },
    { Header: "Area", accessor: "area", width: "25%" },
  ]);

  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([]);

  const [paymentType, paymentTypeSet] = useState(null);
  const [paymentTypes, paymentTypesSet] = useState([
    { id: 1, label: "CASH" },
    { id: 2, label: "TRANSFER" },
  ]);

  const [redirect, redirectSet] = useState(null);

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user && ![1, 2].includes(user.roleId)) {
      redirectSet("/dashboard");
    }
    if (user) {
      loadData();
      loadStatus();
    }
  }, []);

  const loadStatus = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/tr-status`)
      .then((response) => {
        let data = response.data.data;
        data = data.map((item) => ({ id: item.id, label: item.name }));
        data.pop();
        statusesSet(data);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const loadData = (params) => {
    isLoadingSet(true);
    const user = secureStorage.getItem("user");

    const statusId = params && params.statusId ? { statusId: params.statusId } : {};
    const bankId = params && params.bankId ? { bankId: params.bankId } : {};
    const paymentTypeId =
      params && params.paymentTypeId ? { paymentTypeId: params.paymentTypeId } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      ...statusId,
      ...bankId,
      ...paymentTypeId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/stokis/list`, payload)
      .then((response) => {
        const data = response.data;
        const output = data.data.map((item) => {
          const trStatus = item.TrStatus;
          return {
            kode: item.kode,
            name: `${item.User?.name} - (${item.User?.username})`,
            stokis: item.Stoki?.name,
            amount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
            paymentType: item.PaymentType?.name,
            date: moment(item.date).format("YYYY-MM-DD HH:mm:ss"),
            status: trStatus ? (
              <MDBadge
                variant="contained"
                badgeContent={trStatus.name}
                size="lg"
                color={
                  trStatus.id === 1
                    ? "secondary"
                    : trStatus.id === 2
                    ? "error"
                    : trStatus.id === 3
                    ? "warning"
                    : "success"
                }
              />
            ) : (
              "-"
            ),
            area: `${item.Province?.name} - ${item.District?.name}`,
            action: (
              <ButtonAction
                id={item.id}
                urlKey={"trx/stokis"}
                refreshData={loadData}
                detail={true}
                approveStokis={true}
                stokisData={{
                  stokisId: item.Stoki?.id,
                  userId: item.User?.id,
                }}
                statusId={item.TrStatus?.id}
                rejectTrxStokisReward={[1].includes(item.TrStatus?.id)}
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
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Transaksi Stokis
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
                        paymentTypeId: paymentType ? paymentType.id : null,
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
                      paymentTypeId: paymentType ? paymentType.id : null,
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
                  value={paymentType}
                  options={paymentTypes}
                  onChange={(e, value) => {
                    paymentTypeSet(value);
                    loadData({
                      keyword,
                      currentPage: 1,
                      paymentTypeId: value ? value.id : null,
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
                    <MDInput
                      sx={{ padding: "0px" }}
                      fullWidth
                      label="Pilih Pembayaran"
                      {...params}
                    />
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
                  paymentTypeId: paymentType ? paymentType.id : null,
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
                    paymentTypeId: paymentType ? paymentType.id : null,
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

export default TrxStokis;
