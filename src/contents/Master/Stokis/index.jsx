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
function Stokis() {
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
    { Header: "Nama", accessor: "name", width: "25%" },
    { Header: "Harga", accessor: "price", width: "25%" },
    { Header: "Diskon", accessor: "discount", width: "25%" },
    { Header: "Diskon Produk Agen", accessor: "agenDiscount", width: "30%" },
    { Header: "Deskripsi", accessor: "description", width: "35%" },
  ]);

  useEffect(() => {
    const userData = secureStorage.getItem("user");
    userSet(userData);
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = (params) => {
    isLoadingSet(true);

    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/stokis/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          return {
            no,
            name: item.name,
            price: "Rp. " + new Intl.NumberFormat("id-ID").format(item.price),
            discount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.discount),
            agenDiscount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.agenDiscount),
            description: (
              <p style={{ wordWrap: "break-word", width: "25em" }}>{item.description}</p>
            ),
            action:
              user && [1, 2].includes(user.roleId) ? (
                <ButtonAction
                  id={item.id}
                  urlKey={"/master/stokis"}
                  refreshData={loadData}
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
            to={{ pathname: "/master/stokis/add" }}
          >
            Tambah
          </MDButton>
        </MDBox>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Stokis
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
                      });
                    }
                  }}
                  onChange={(e) => keywordSet(e.target.value)}
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
                });
              }}
              onChangePage={(current) => {
                if (current !== currentPage) {
                  currentPageSet(current);
                  loadData({
                    rowsPerPage,
                    currentPage: current,
                    keyword,
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

export default Stokis;
