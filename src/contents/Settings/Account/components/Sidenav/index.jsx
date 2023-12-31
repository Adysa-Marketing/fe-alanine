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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RateReviewIcon from "@mui/icons-material/RateReview";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";

function Sidenav() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const sidenavItems = [
    { icon: "person", label: "profile", href: "profile" },
    { icon: "receipt_long", label: "Informasi Umum", href: "basic-info" },
    { icon: "lock", label: "Ganti Password", href: "change-password" },
    { icon: <AccountBalanceIcon />, label: "Data Bank", href: "user-bank" },
    { icon: <RateReviewIcon />, label: "Testimoni", href: "testimoni" },
    // { icon: "security", label: "2FA", href: "2fa" },
    // { icon: "badge", label: "accounts", href: "accounts" },
    // { icon: "campaign", label: "notifications", href: "notifications" },
    // { icon: "settings_applications", label: "sessions", href: "sessions" },
    // { icon: "delete", label: "delete account", href: "delete-account" },
  ];

  const renderSidenavItems = sidenavItems.map(({ icon, label, href }, key) => {
    const itemKey = `item-${key}`;

    return (
      <MDBox key={itemKey} component="li" pt={key === 0 ? 0 : 1}>
        <MDTypography
          component="a"
          href={`#${href}`}
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          sx={({
            borders: { borderRadius },
            functions: { pxToRem },
            palette: { light },
            transitions,
          }) => ({
            display: "flex",
            alignItems: "center",
            borderRadius: borderRadius.md,
            padding: `${pxToRem(10)} ${pxToRem(16)}`,
            transition: transitions.create("background-color", {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.shorter,
            }),

            "&:hover": {
              backgroundColor: light.main,
            },
          })}
        >
          <MDBox mr={1.5} lineHeight={1} color={darkMode ? "white" : "dark"}>
            <Icon fontSize="small">{icon}</Icon>
          </MDBox>
          {label}
        </MDTypography>
      </MDBox>
    );
  });

  return (
    <Card
      sx={{
        borderRadius: ({ borders: { borderRadius } }) => borderRadius.lg,
        position: "sticky",
        top: "1%",
      }}
    >
      <MDBox
        component="ul"
        display="flex"
        flexDirection="column"
        p={2}
        m={0}
        sx={{ listStyle: "none" }}
      >
        {renderSidenavItems}
      </MDBox>
    </Card>
  );
}

export default Sidenav;
