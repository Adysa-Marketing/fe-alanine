/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Settings page components
import Sidenav from "contents/Settings/Account/components/Sidenav";
import BasicInfo from "contents/Settings/Account/components/BasicInfo";
import ChangePassword from "contents/Settings/Account/components/ChangePassword";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import UserBank from "./components/UserBank";
import Testimoni from "./components/Testimoni";

function SettingAccount() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid>
          <Grid item xs={12} lg={9}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <BasicInfo />
                </Grid>
                <Grid item xs={12}>
                  <ChangePassword />
                </Grid>
                <Grid item xs={12}>
                  <UserBank />
                </Grid>
                <Grid item xs={12}>
                  <Testimoni />
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default SettingAccount;
