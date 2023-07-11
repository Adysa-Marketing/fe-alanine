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

// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import FormField from "contents/Master/Admin/Form/components/FormField";

function UserInfo({ formData }) {
  const { formField, values, errors, touched } = formData;
  const { name, userName, phoneNumber, email, password, confirmPassword } = formField;
  const {
    name: nameV,
    userName: userNameV,
    phoneNumber: phoneNumberV,
    email: emailV,
    password: passwordV,
    confirmPassword: confirmPasswordV,
  } = values;

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Informasi Dasar</MDTypography>
        <MDTypography variant="button" color="text">
          Data utama
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={name.type}
              label={name.label}
              name={name.name}
              value={nameV}
              placeholder={name.placeholder}
              error={errors.name && touched.name}
              success={nameV.length > 0 && !errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={userName.type}
              label={userName.label}
              name={userName.name}
              value={userNameV}
              placeholder={userName.placeholder}
              error={errors.userName && touched.userName}
              success={userNameV.length > 0 && !errors.userName}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={phoneNumber.type}
              label={phoneNumber.label}
              name={phoneNumber.name}
              value={phoneNumberV}
              placeholder={phoneNumber.placeholder}
              error={errors.phoneNumber && touched.phoneNumber}
              success={phoneNumberV.length > 0 && !errors.phoneNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={email.type}
              label={email.label}
              name={email.name}
              value={emailV}
              placeholder={email.placeholder}
              error={errors.email && touched.email}
              success={emailV.length > 0 && !errors.email}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={password.type}
              label={password.label}
              name={password.name}
              value={passwordV}
              placeholder={password.placeholder}
              error={errors.password && touched.password}
              success={passwordV.length > 0 && !errors.password}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={confirmPassword.type}
              label={confirmPassword.label}
              name={confirmPassword.name}
              value={confirmPasswordV}
              placeholder={confirmPassword.placeholder}
              error={errors.confirmPassword && touched.confirmPassword}
              success={confirmPasswordV.length > 0 && !errors.confirmPassword}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for UserInfo
UserInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default UserInfo;
