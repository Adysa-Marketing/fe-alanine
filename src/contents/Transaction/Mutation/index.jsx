import { useEffect, useRef, useState } from "react";
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
import ModalNotif from "contents/Components/ModalNotif";

function Mutation() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Kode", accessor: "kode", width: "15%" },
    { Header: "Nominal", accessor: "amount", width: "15%" },
    { Header: "Tipe", accessor: "type", width: "15%" },
    { Header: "Kategori", accessor: "category", width: "20%" },
    { Header: "Tanggal", accessor: "date", width: "25%" },
  ]);

  const [type, typeSet] = useState(null);
  const [category, categorySet] = useState(null);
  const [types, typesSet] = useState([
    {
      id: 1,
      label: "Dana Masuk",
    },
    {
      id: 2,
      label: "Dana Keluar",
    },
    {
      id: 3,
      label: "Registrasi",
    },
  ]);
  const [categories, categoriesSet] = useState([
    {
      id: 1,
      label: "Produk",
    },
    {
      id: 2,
      label: "Stokis",
    },
    {
      id: 3,
      label: "Widhraw",
    },
    {
      id: 3,
      label: "Member",
    },
  ]);
  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1, 2].includes(user.roleId)) {
        redirectSet("/dashboard");
      } else {
        loadData();
      }
    }
  }, []);

  const loadData = (params) => {
    isLoadingSet(true);

    const type = params && params.type ? { type: params.type } : {};
    const category = params && params.category ? { category: params.category } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      startDate: params && params.startDate ? params.startDate : startDate,
      endDate: params && params.endDate ? params.endDate : endDate,
      ...type,
      ...category,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/mutation/list`, payload)
      .then((response) => {
        const data = response.data;
        const output = data.data.map((item) => {
          return {
            kode: item.kode,
            amount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
            type: item.type,
            category: item.category,
            date: moment(item.date).format("DD-MM-YYYY HH:mm:ss"),
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
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card>
              <MDBox p={2} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  Daftar Mutasi
                </MDTypography>
              </MDBox>

              <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3} lg={3}>
                    <Autocomplete
                      value={type}
                      options={types}
                      onChange={(e, value) => {
                        typeSet(value);
                        loadData({
                          keyword,
                          currentPage: 1,
                          startDate,
                          endDate,
                          category: category ? category.label : null,
                          type: value ? value.label : null,
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
                        <MDInput sx={{ padding: "0px" }} fullWidth label="Pilih Type" {...params} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3} lg={3}>
                    <Autocomplete
                      value={category}
                      options={categories}
                      onChange={(e, value) => {
                        categorySet(value);
                        loadData({
                          keyword,
                          currentPage: 1,
                          startDate,
                          endDate,
                          type: type ? type.label : null,
                          category: value ? value.label : null,
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
                          label="Pilih Kategori"
                          {...params}
                        />
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
                  <Grid item xs={12} md={1} lg={1}>
                    <MDButton
                      color="info"
                      variant="gradient"
                      onClick={() => {
                        loadData({
                          keyword,
                          currentPage: 1,
                          startDate,
                          endDate,
                          type: type ? type.label : null,
                          category: value ? value.label : null,
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
                      keyword,
                      rowsPerPage: value,
                      currentPage: 1,
                      startDate,
                      endDate,
                      type: type ? type.label : null,
                      category: category ? category.label : null,
                    });
                  }}
                  onChangePage={(current) => {
                    if (current !== currentPage) {
                      currentPageSet(current);
                      loadData({
                        keyword,
                        rowsPerPage,
                        currentPage: current,
                        startDate,
                        endDate,
                        type: type ? type.label : null,
                        category: category ? category.label : null,
                      });
                    }
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Mutation;
