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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

// Custom styles for ComplexProjectCard
function ComplexProjectCard({ color, id, title, price, discount, description, buy }) {
  return (
    <Card>
      <MDBox p={2}>
        <MDBox my={3} lineHeight={1} textAlign="center">
          <MDBox ml={2} mt={-2} lineHeight={0}>
            <MDTypography mb={2} variant="h4" textTransform="capitalize" fontWeight="medium">
              {title}
            </MDTypography>
            <Divider />
          </MDBox>
        </MDBox>
        <MDBox my={2} lineHeight={1} textAlign="center">
          <MDBox>
            <MDTypography
              variant="h6"
              fontWeight="light"
              color="error"
              style={{ textDecoration: "line-through" }}
            >
              Rp. {new Intl.NumberFormat("id-ID").format(price)}
            </MDTypography>
          </MDBox>
          <MDBox my={1}>
            <MDTypography variant="h4" fontWeight="bold" color="success">
              Rp. {new Intl.NumberFormat("id-ID").format(discount)}
            </MDTypography>
          </MDBox>
          <MDBox>
            <MDTypography variant="button" fontWeight="light" color="text">
              {description}
            </MDTypography>
          </MDBox>
        </MDBox>
        <Divider />
        <MDBox textAlign="center">
          {buy && (
            <MDButton variant="gradient" color="info">
              Pesan Sekarang
            </MDButton>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexProjectCard
ComplexProjectCard.defaultProps = {
  color: "dark",
  dateTime: "",
  members: [],
  dropdown: false,
  buy: false,
};

// Typechecking props for the ProfileInfoCard
ComplexProjectCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  id: PropTypes.number,
  title: PropTypes.string.isRequired,
  price: PropTypes.number,
  discount: PropTypes.number,
  description: PropTypes.node.isRequired,
  buy: PropTypes.bool.isRequired,
};

export default ComplexProjectCard;
