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
function Article() {
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
    { Header: "Gambar", accessor: "image", width: "25%" },
    { Header: "Judul", accessor: "title", width: "25%" },
    { Header: "Slug", accessor: "slug", width: "20%" },
    { Header: "Penulis", accessor: "author", width: "25%" },
    { Header: "Views", accessor: "views", width: "15%" },
    { Header: "Status", accessor: "status", width: "15%" },
    { Header: "Kutipam", accessor: "excerpt", width: "30%" },
  ]);

  const [redirect, redirectSet] = useState(null);
  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([
    { id: 1, label: "Aktif" },
    { id: 2, label: "Draff" },
  ]);

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

    const status = params && params.status ? { statusId: params.status } : {};

    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      type: "All",
      ...status,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/article/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          const statusId = item.isActive ? 1 : 2;
          return {
            no,
            title: <p style={{ wordWrap: "break-word", width: "10em" }}>{item.title}</p>,
            slug: <p style={{ wordWrap: "break-word", width: "10em" }}>{item.slug}</p>,
            author: item.author,
            views: item.view,
            excerpt: <p style={{ wordWrap: "break-word", width: "25em" }}>{item.excerpt}</p>,
            image: item.image ? (
              <MDBox
                component="img"
                src={`${Config.ApiAsset}/article/${item.image}`}
                alt="Gambar"
                borderRadius="lg"
                shadow="sm"
                width="100%"
                height="150px"
                position="relative"
                zIndex={10}
                mb={2}
              />
            ) : (
              "-"
            ),
            status: item.isActive ? (
              <MDBadge badgeContent="Aktif" container color="success" />
            ) : (
              <MDBadge badgeContent="Draff" container color="warning" />
            ),
            action: (
              <ButtonAction
                id={item.id}
                urlKey={"master/article"}
                refreshData={loadData}
                edit={true}
                remove={true}
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
            to={{ pathname: "/master/article/add" }}
          >
            Tambah
          </MDButton>
        </MDBox>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Artikel
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
                  type: "All",
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
                    type: "All",
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

export default Article;
