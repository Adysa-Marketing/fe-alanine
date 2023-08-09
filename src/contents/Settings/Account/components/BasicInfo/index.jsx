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

// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Settings page components
import FormField from "contents/Components/FormField";

// Images
import burceMars from "assets/images/bruce-mars.jpg";

import { useEffect, useRef, useState } from "react";
import useAxios from "libs/useAxios";
import Config from "config";
import ModalNotif from "contents/Components/ModalNotif";
import secureStorage from "libs/secureStorage";
import MDEditor from "components/MDEditor";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

function BasicInfo() {
  const [state, setState] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: null,
    kk: "",
    address: "",
    sponsorKey: "",
    serialNumber: "",
    country: null,
    province: null,
    district: null,
    subDistrict: null,
    remark: "",
    image: null,
    imageFilename: "",
    remark: "",
    Role: null,
    wallet: 0,
    point: 0,

    genders: [
      { id: 1, label: "Male" },
      { id: 2, label: "Female" },
    ],
    countries: [{ id: 1, label: "INDONESIA" }],
    provinces: [],
    districts: [],
    subDistricts: [],

    error: [],
    success: [],
  });

  const imageRef = useRef();
  const modalNotifRef = useRef();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/setting/user/get`)
      .then((result) => {
        const user = result.data.data;
        setState((prev) => ({
          ...prev,
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender == "Male" ? { id: 1, label: "Male" } : { id: 2, label: "Female" },
          kk: user.kk || "",
          image: user.image,
          address: user.address || "",
          sponsorKey: user.SponsorKey?.key || "",
          serialNumber: user.Serial?.serialNumber || "",
          country: user.Country ? { id: user.Country.id, label: user.Country.name } : null,
          province: user.Province ? { id: user.Province.id, label: user.Province.name } : null,
          district: user.District ? { id: user.District.id, label: user.District.name } : null,
          subDistrict: user.SubDistrict
            ? { id: user.SubDistrict.id, label: user.SubDistrict.name }
            : null,
          remark: user.remark,
          Role: user.Role,
          point: user.point,
          wallet: user.wallet,

          success: {
            ...prev.success,
            name: user.name ? true : false,
            username: user.username ? true : false,
            email: user.email ? true : false,
            phone: user.phone ? true : false,
            gender: user.gender ? true : false,
            kk: user.kk ? true : false,
            address: user.address ? true : false,
            sponsorKey: user.SponsorKey ? true : false,
            serialNumber: user.Serial ? true : false,
            country: user.Country ? true : false,
            province: user.Province ? true : false,
            district: user.District ? true : false,
            subDistrict: user.SubDistrict ? true : false,
            image: user.image ? true : false,
            remark: user.remark ? true : false,
          },
        }));

        if (user.Country) {
          loadProvince(user.Country?.id);
        }
        if (user.Province) {
          loadDistrict(user.Province?.id);
        }
        if (user.District) {
          loadSubDistrict(user.District.id);
        }
      })
      .catch((error) => console.log(`[!] Error : ${error}`));
  };
  const loadProvince = (countryId) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/province?countryId=${countryId}`)
      .then((response) => {
        const data = response.data.data;
        const provinces = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        setState((prev) => ({
          ...prev,
          provinces,
        }));
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
        const districts = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        setState((prev) => ({
          ...prev,
          districts,
        }));
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
        const subDistricts = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        setState((prev) => ({
          ...prev,
          subDistricts,
        }));
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        success: { ...prevState.success, [e.target.id]: true },
        error: { ...prevState.error, [e.target.id]: false },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        success: { ...prevState.success, [e.target.id]: false },
        error: { ...prevState.error, [e.target.id]: true },
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = () => {
    if (
      state.success.name &&
      state.success.username &&
      state.success.email &&
      state.success.phone &&
      state.success.kk &&
      state.success.gender &&
      state.success.image &&
      state.success.address &&
      state.success.country &&
      state.success.province &&
      state.success.district &&
      state.success.subDistrict &&
      state.success.remark
    ) {
      if (state.kk.length < 16) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: `Nomor NIK harus 16 angka`,
        });
      } else {
        sendData();
      }
    } else {
      console.log("Success : ", state.success);
      let input = "";
      !state.success.remark && (input = "Biodata");
      !state.success.subDistrict && (input = "Kecamatan");
      !state.success.district && (input = "Kota/Kabupaten");
      !state.success.province && (input = "Provinsi");
      !state.success.country && (input = "Negara");
      !state.success.address && (input = "Alamat");
      !state.success.image && (input = "Foto");
      !state.success.gender && (input = "Gender");
      !state.success.kk && (input = "No NIK");
      !state.success.phone && (input = "No Telpon");
      !state.success.email && (input = "Email");
      !state.success.username && (input = "Username");
      !state.success.name && (input = "Nama");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("username", state.username);
    formData.append("email", state.email);
    formData.append("phone", state.phone);
    formData.append("gender", state.gender?.label);
    formData.append("kk", state.kk);
    formData.append("address", state.address);
    formData.append("countryId", state.country?.id);
    formData.append("provinceId", state.province?.id);
    formData.append("districtId", state.district?.id);
    formData.append("subDistrictId", state.subDistrict?.id);
    formData.append("remark", state.remark);
    formData.append("image", state.image);

    useAxios()
      .put(`${Config.ApiUrl}/api/v1/setting/user/update`, formData)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            loadData();
          },
        });
      })
      .catch((err) => {
        if (err.response?.data) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? Array.isArray(err.response.data.message)
                ? err.response.data.message[0].message
                : err.response.data.message
              : "Terjadi kesalahan pada system",
            color: "warning",
          });
        } else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
          });
        }
      });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card id="profile" mb={5}>
            <MDBox p={2}>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <MDAvatar
                    src={state.image ? `${Config.ApiAsset}/user/${state.image}` : burceMars}
                    alt="profile-image"
                    size="xl"
                    shadow="sm"
                  />
                </Grid>
                <Grid item>
                  <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                      {state.name}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="medium">
                      {state.Role?.name} / {state.username}
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3} sx={{ ml: "auto" }}>
                  <MDBox
                    display="flex"
                    justifyContent={{ md: "flex-end" }}
                    alignItems="center"
                    lineHeight={1}
                  >
                    <MDBox>
                      <MDTypography variant="button" fontWeight="regular">
                        Point : {state.point}
                      </MDTypography>
                      <br />
                      <MDTypography variant="button" fontWeight="regular">
                        Dompet : Rp. {new Intl.NumberFormat("id-ID").format(state.wallet)}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card id="basic-info" mt={5} sx={{ overflow: "visible" }}>
            <ModalNotif ref={modalNotifRef} />
            <MDBox p={3}>
              <MDTypography variant="h5">Informasi Umum</MDTypography>
            </MDBox>
            <MDBox component="form" pb={3} px={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    id="name"
                    label="Nama"
                    placeholder="nama"
                    value={state.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.name : false}
                    error={state.error ? state.error.name : false}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    id="username"
                    label="Username"
                    placeholder="username"
                    value={state.username}
                    success={state.success ? state.success.username : false}
                    error={state.error ? state.error.username : false}
                    readOnly={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    id="email"
                    label="Email"
                    placeholder="email"
                    value={state.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.email : false}
                    error={state.error ? state.error.email : false}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    id="phone"
                    label="No Telpon"
                    placeholder="no telpon"
                    value={state.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.phone : false}
                    error={state.error ? state.error.phone : false}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    id="kk"
                    label="No NIK"
                    placeholder="no nik"
                    value={state.kk}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.kk : false}
                    error={state.error ? state.error.kk : false}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    id="sponsorKey"
                    label="Sponsor Key"
                    placeholder="sponsor key"
                    value={state.sponsorKey}
                    success={state.success ? state.success.sponsorKey : false}
                    error={state.error ? state.error.sponsorKey : false}
                    readOnly={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    id="serialNumber"
                    label="Serial Number"
                    placeholder="serial number"
                    value={state.serialNumber}
                    success={state.success ? state.success.serialNumber : false}
                    error={state.error ? state.error.serialNumber : false}
                    readOnly={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="gender"
                    options={state.genders}
                    value={state.gender}
                    onChange={(e, value) => {
                      setState((prev) => ({
                        ...prev,
                        gender: value,
                      }));
                    }}
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <FormField
                        {...params}
                        label="Gender"
                        InputLabelProps={{ shrink: true }}
                        success={state.success ? state.success.gender : false}
                        error={state.error ? state.error.gender : false}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <input
                      type="file"
                      name="fileInput"
                      ref={imageRef}
                      onChange={(e) => {
                        if (e.target.files.length === 1) {
                          const file = e.target.files[0];
                          const filename = file.name;
                          const ext = filename.split(".")[1];
                          setState((prev) => ({
                            ...prev,
                            image: file,
                            imageFilename: filename,
                            success: { ...prev.success, image: true },
                            error: { ...prev.success, image: false },
                          }));
                        }
                      }}
                      hidden
                    />
                    <FormField
                      fullWidth
                      id="image"
                      value={state.imageFilename}
                      label="Upload Foto"
                      variant="standard"
                      onClick={() => {
                        imageRef.current.click();
                      }}
                      readOnly
                      onBlur={handleBlur}
                      success={state.success ? state.success.image : false}
                      error={state.error ? state.error.image : false}
                      InputLabelProps={{ shrink: true }}
                    />
                    <small style={{ color: "red", fontSize: "12px" }}>Maksimal ukuran 2MB</small>
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormField
                    id="address"
                    label="Alamat"
                    placeholder="alamat"
                    value={state.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    success={state.success ? state.success.address : false}
                    error={state.error ? state.error.address : false}
                    readOnly={true}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <Autocomplete
                        id="country"
                        value={state.country}
                        options={state.countries}
                        onChange={(e, value) => {
                          if (value) {
                            setState((prev) => ({
                              ...prev,
                              country: value,
                            }));
                          }
                        }}
                        onBlur={handleBlur}
                        renderInput={(params) => (
                          <FormField
                            {...params}
                            label="Negara"
                            success={state.success ? state.success.country : false}
                            error={state.error ? state.error.country : false}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Autocomplete
                        id="province"
                        value={state.province}
                        options={state.provinces}
                        onBlur={handleBlur}
                        onChange={(e, value) => {
                          if (value) {
                            setState((prev) => ({
                              ...prev,
                              province: value,
                              district: null,
                              districts: [],
                              subDistrict: null,
                              subDistricts: [],
                              success: { ...prev.success, district: false, subDistrict: false },
                              error: { ...prev.error, district: true, subDistrict: true },
                            }));
                            loadDistrict(value?.id);
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            {...params}
                            label="Provinsi"
                            InputLabelProps={{ shrink: true }}
                            success={state.success ? state.success.province : false}
                            error={state.error ? state.error.province : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Autocomplete
                        id="district"
                        value={state.district}
                        options={state.districts}
                        onBlur={handleBlur}
                        onChange={(e, value) => {
                          if (value) {
                            setState((prev) => ({
                              ...prev,
                              district: value,
                              subDistrict: null,
                              subDistricts: [],
                              success: { ...prev.success, subDistrict: false },
                              error: { ...prev.error, subDistrict: true },
                            }));
                            loadSubDistrict(value?.id);
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            {...params}
                            label="Kota/Kabupaten"
                            InputLabelProps={{ shrink: true }}
                            success={state.success ? state.success.district : false}
                            error={state.error ? state.error.district : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Autocomplete
                        id="subDistrict"
                        value={state.subDistrict}
                        options={state.subDistricts}
                        onBlur={handleBlur}
                        onChange={(e, value) => {
                          if (value) {
                            setState((prev) => ({
                              ...prev,
                              subDistrict: value,
                            }));
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            {...params}
                            label="Kecamatan"
                            InputLabelProps={{ shrink: true }}
                            success={state.success ? state.success.subDistrict : false}
                            error={state.error ? state.error.subDistrict : false}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <MDTypography
                      component="label"
                      variant="button"
                      fontWeight="regular"
                      color="text"
                    >
                      Biodata&nbsp;&nbsp;
                    </MDTypography>
                  </MDBox>
                  <MDEditor
                    id="remark"
                    minCol={5}
                    value={state.remark}
                    onChange={(content, delta, source, editorue) => {
                      if (content) {
                        setState((prev) => ({
                          ...prev,
                          remark: content,
                          success: { ...prev.success, remark: true },
                          error: { ...prev.success, remark: false },
                        }));
                      }
                    }}
                    onBlur={(previousRange, source, editor) => {
                      const index = previousRange.index;
                      if (index > 0) {
                        setState((prev) => ({
                          ...prev,
                          success: { ...prev.success, remark: true },
                          error: { ...prev.success, remark: false },
                        }));
                      } else {
                        setState((prev) => ({
                          ...prev,
                          success: { ...prev.success, remark: false },
                          error: { ...prev.success, remark: true },
                        }));
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                flexWrap="wrap"
              >
                <MDBox ml="auto" mt={3}>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    size="small"
                    onKeyDown={handleKeyDown}
                    onClick={handleSubmit}
                  >
                    simpan
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default BasicInfo;
