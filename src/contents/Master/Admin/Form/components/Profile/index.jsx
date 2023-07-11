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
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import FormField from "contents/Master/Admin/Form/components/FormField";
import { useRef, useState } from "react";
import MDInput from "components/MDInput";

function Profile({ formData }) {
  const { formField, values, errors, touched } = formData;
  const { nokk, image, gender, bio } = formField;
  const { nokk: nokkV, image: imageV, gender: genderV, bio: bioV } = values;

  const [file, fileSet] = useState(null);
  const [filename, filenameSet] = useState(null);
  const fileRef = useRef();

  return (
    <MDBox>
      <MDTypography variant="h5" fontWeight="bold">
        Profile
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={6}>
            <FormField
              type={nokk.type}
              label={nokk.label}
              name={nokk.name}
              value={nokkV}
              placeholder={nokk.placeholder}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Autocomplete
              options={["Male", "Female"]}
              value={genderV}
              onChange={(e, value) => {
                formData.values.gender = value ? value : "";
              }}
              renderInput={(params) => (
                <FormField
                  {...params}
                  type={gender.type}
                  label={gender.label}
                  name={gender.name}
                  value={genderV}
                  placeholder={gender.placeholder}
                  error={errors.gender && touched.gender}
                  success={genderV.length > 0 && !errors.gender}
                  variant="standard"
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <MDBox mb={2}>
              <input
                type="file"
                name="fileInput"
                ref={fileRef}
                onChange={(e) => {
                  if (e.target.files.length === 1) {
                    const file = e.target.files[0];
                    const filename = file.name;
                    const ext = filename.split(".")[1];
                    formData.values.image = file ? file : "";
                    fileSet(file);
                    filenameSet(filename);
                  }
                }}
                hidden
              />
              <MDInput
                fullWidth
                value={imageV ? imageV?.name : ""}
                label="Upload foto"
                variant="standard"
                onClick={() => {
                  fileRef.current.click();
                }}
                error={errors.image && touched.image}
                success={imageV.length > 0 && !errors.image}
                readOnly
              />
              <small style={{ color: "red", fontSize: "12px" }}>Maksimal ukuran 2MB</small>
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <FormField
              type={bio.type}
              label={bio.label}
              name={bio.name}
              value={bioV}
              placeholder={bio.placeholder}
              multiline
              rows={5}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for Profile
Profile.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default Profile;
