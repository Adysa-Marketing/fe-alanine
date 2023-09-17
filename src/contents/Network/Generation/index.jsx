import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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

// Material Dashboard 2 PRO React base styles
import breakpoints from "assets/theme/base/breakpoints";

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
import moment from "moment";

function Generation() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "No", accessor: "no", width: "15%" },
    { Header: "Downline", accessor: "downline", width: "20%" },
    { Header: "Kontak", accessor: "contact", width: "20%" },
    { Header: "Level", accessor: "level", width: "20%" },
    { Header: "Status", accessor: "status", width: "20%" },
    { Header: "Tanggal", accessor: "date", width: "30%" },
  ]);

  const [level, levelSet] = useState("all");
  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");

  const [redirect, redirectSet] = useState(null);

  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![3, 4].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadData();
    }
  }, []);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
    The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  useEffect(() => {
    loadData();
  }, [level]);

  const handleSetTabValue = (event, newValue) => {
    newValue == 0 ? levelSet("all") : levelSet(newValue);
    setTabValue(newValue);
  };

  const loadData = (params) => {
    isLoadingSet(true);

    const payload = {
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      startDate: params && params.startDate ? params.startDate : startDate,
      endDate: params && params.endDate ? params.endDate : endDate,
      levelId: level,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/network/generation/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          return {
            no,
            downline: item.Downline?.name,
            contact: (
              <p>
                {item.Downline?.email} <br /> {item.Downline?.phone}
              </p>
            ),
            level: item.remark,
            status: item.Downline?.isActive ? (
              <MDBadge badgeContent="Aktif" container color="success" />
            ) : (
              <MDBadge badgeContent="Tidak Aktif" container color="error" />
            ),
            date: item.createdAt,
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
        <MDBox my={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} lg={12}>
              <AppBar position="static">
                <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                  <Tab label="All" />
                  <Tab label="Level 1" />
                  <Tab label="Level 2" />
                  <Tab label="Level 3" />
                  <Tab label="Level 4" />
                  <Tab label="Level 5" />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
        </MDBox>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              History Generasi {level == "all" ? "Semua Level" : `Level ${level}`}
            </MDTypography>
          </MDBox>

          <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
            <Grid container spacing={3}>
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
                      levelId: level ? level.id : null,
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

export default Generation;
