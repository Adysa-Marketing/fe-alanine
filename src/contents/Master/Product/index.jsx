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
function Product() {
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
    { Header: "No", accessor: "no", width: "15%" },
    { Header: "Nama Paket", accessor: "name", width: "25%" },
    { Header: "Kategori", accessor: "category", width: "25%" },
    { Header: "Harga", accessor: "amount", width: "25%" },
    { Header: "Stok", accessor: "stock", width: "15%" },
    { Header: "Deskripsi", accessor: "description", width: "35%" },
  ]);

  const [category, categorySet] = useState(null);
  const [categories, categoriesSet] = useState([]);

  useEffect(() => {
    const userData = secureStorage.getItem("user");
    userSet(userData);
  }, []);

  useEffect(() => {
    if (user) {
      loadCategory();
      loadData();
    }
  }, [user]);

  const loadCategory = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/product-category/dropdown`)
      .then((response) => {
        let data = response.data.data;
        data = data.map((item) => ({ id: item.id, label: item.name }));
        categoriesSet(data);
      })
      .catch((error) => console.log("[!] Error :", error));
  };

  const loadData = (params) => {
    isLoadingSet(true);

    const categoryId = params && params.categoryId ? { categoryId: params.categoryId } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      ...categoryId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/product/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          return {
            no,
            name: item.name,
            category: item.ProductCategory?.name,
            amount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
            stock: item.stock,
            description: (
              <p style={{ wordWrap: "break-word", width: "25em" }}>{item.description}</p>
            ),
            action:
              user && [1, 2].includes(user.roleId) ? (
                <ButtonAction
                  id={item.id}
                  urlKey={"/master/product"}
                  refreshData={loadData}
                  edit={true}
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
        <MDBox pb={2} mt={{ xs: 2, md: 0 }} display="flex">
          <MDButton
            size="medium"
            color="info"
            variant="gradient"
            component={Link}
            to={{ pathname: "/master/product/add" }}
          >
            Tambah
          </MDButton>
        </MDBox>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Paket
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
                        categoryId: category ? category.id : null,
                      });
                    }
                  }}
                  onChange={(e) => keywordSet(e.target.value)}
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
                      categoryId: value ? value.id : null,
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
                  keyword,
                  categoryId: category ? category.id : null,
                });
              }}
              onChangePage={(current) => {
                if (current !== currentPage) {
                  currentPageSet(current);
                  loadData({
                    rowsPerPage,
                    currentPage: current,
                    keyword,
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

export default Product;
