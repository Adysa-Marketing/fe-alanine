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

function AgenProduct() {
  const [user, userSet] = useState(null);
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "No", accessor: "no", width: "15%" },
    { Header: "Nama", accessor: "name", width: "25%" },
    { Header: "Harga", accessor: "amount", width: "20%" },
    { Header: "Stok", accessor: "stock", width: "20%" },
    { Header: "Kategori", accessor: "category", width: "25%" },
  ]);

  const [category, categorySet] = useState(null);
  const [categories, categoriesSet] = useState([]);

  useEffect(() => {
    const userData = secureStorage.getItem("user");
    userSet(userData);
  }, []);

  useEffect(() => {
    if (user) {
      loadProductCategory();
      loadData();
    }
  }, [user]);

  const loadProductCategory = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/product-category/dropdown`)
      .then((response) => {
        let data = response.data.data;
        data = data.map((status) => {
          return {
            id: status.id,
            label: status.name,
          };
        });

        categoriesSet(data);
      })
      .catch((error) => console.log("[!] Error :", error));
  };

  const loadData = (params) => {
    isLoadingSet(true);

    const categoryId = params && params.categoryId ? { categoryId: params.categoryId } : {};
    const payload = {
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      ...categoryId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/manage/agen-product/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          return {
            no,
            name: item.name,
            amount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
            stock: item.stock,
            category: item.ProductCategory?.name,
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
              Daftar Produk Agen
            </MDTypography>
          </MDBox>

          <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} lg={3}>
                <Autocomplete
                  value={category}
                  options={categories}
                  onChange={(e, value) => {
                    categorySet(value);
                    loadData({
                      currentPage: 1,
                      categoryId: value ? value.id : null,
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
                    <MDInput sx={{ padding: "0px" }} fullWidth label="Pilih Kategori" {...params} />
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
                  categoryId: category ? category.id : null,
                });
              }}
              onChangePage={(current) => {
                if (current !== currentPage) {
                  currentPageSet(current);
                  loadData({
                    rowsPerPage,
                    currentPage: current,
                    categoryId: category ? category.id : null,
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

export default AgenProduct;
