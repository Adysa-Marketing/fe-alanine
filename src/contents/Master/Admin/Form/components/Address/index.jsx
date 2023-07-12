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
import { useEffect, useState } from "react";
import useAxios from "libs/useAxios";
import Config from "config";

function Address({ formData }) {
  const [countries, countriesSet] = useState([]);
  const [provinces, provincesSet] = useState([]);
  const [districts, districtsSet] = useState([]);
  const [subDistricts, subDistrictsSet] = useState([]);

  const { formField, values, errors, touched } = formData;
  let { address, country, province, district, subDistrict } = formField;
  let {
    address: addressV,
    country: countryV,
    province: provinceV,
    district: districtV,
    subDistrict: subDistrictV,
  } = values;

  useEffect(() => {
    loadCountry();
    if (countryV !== "" && "id" in countryV && "label" in countryV) {
      loadProvince(countryV?.id);
    }
    if (provinceV !== "" && "id" in provinceV && "label" in provinceV) {
      loadDistrict(provinceV?.id);
    }
    if (districtV !== "" && "id" in districtV && "label" in districtV) {
      loadSubDistrict(districtV.id);
    }
  }, []);

  const loadCountry = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/country`)
      .then((response) => {
        const data = response.data.data;
        const country = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        countriesSet(country);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const loadProvince = (countryId) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/province?countryId=${countryId}`)
      .then((response) => {
        const data = response.data.data;
        const province = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        provincesSet(province);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const loadDistrict = (provinceId) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/district?provinceId=${provinceId}`)
      .then((response) => {
        const data = response.data.data;
        const district = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        districtsSet(district);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const loadSubDistrict = (districtId) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/sub-district?districtId=${districtId}`)
      .then((response) => {
        const data = response.data.data;
        const subDistrict = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        subDistrictsSet(subDistrict);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  return (
    <MDBox>
      <MDTypography variant="h5" fontWeight="bold">
        Alamat
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <FormField
              type={address.type}
              label={address.label}
              name={address.name}
              value={addressV}
              placeholder={address.placeholder}
              error={errors.address && touched.address}
              success={addressV.length > 0 && !errors.address}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6}>
            <Autocomplete
              options={countries}
              value={countryV}
              onChange={(e, value) => {
                if (value) {
                  loadProvince(value?.id);
                  formData.values.country = value ? value : "";
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <FormField
                  {...params}
                  type={country.type}
                  label={country.label}
                  name={country.name}
                  value={countryV}
                  placeholder={country.placeholder}
                  error={errors.country && touched.country}
                  success={countryV.length > 0 && !errors.country}
                  variant="standard"
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Autocomplete
              options={provinces}
              value={provinceV}
              onChange={(e, value) => {
                if (value) {
                  loadDistrict(value?.id);
                  formData.values.province = value ? value : "";
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <FormField
                  {...params}
                  type={province.type}
                  label={province.label}
                  name={province.name}
                  value={provinceV}
                  placeholder={province.placeholder}
                  error={errors.province && touched.province}
                  success={provinceV.length > 0 && !errors.province}
                  variant="standard"
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Autocomplete
              options={districts}
              value={districtV}
              onChange={(e, value) => {
                if (value) {
                  loadSubDistrict(value?.id);
                  formData.values.district = value ? value : "";
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <FormField
                  {...params}
                  type={district.type}
                  label={district.label}
                  name={district.name}
                  value={districtV}
                  placeholder={district.placeholder}
                  error={errors.district && touched.district}
                  success={districtV.length > 0 && !errors.district}
                  variant="standard"
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Autocomplete
              options={subDistricts}
              value={subDistrictV}
              onChange={(e, value) => {
                if (value) {
                  formData.values.subDistrict = value ? value : "";
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <FormField
                  {...params}
                  type={subDistrict.type}
                  label={subDistrict.label}
                  name={subDistrict.name}
                  value={subDistrictV}
                  placeholder={subDistrict.placeholder}
                  error={errors.subDistrict && touched.subDistrict}
                  success={subDistrictV.length > 0 && !errors.subDistrict}
                  variant="standard"
                />
              )}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for Address
Address.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default Address;
