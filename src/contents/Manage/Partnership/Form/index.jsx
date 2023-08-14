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

import { useEffect, useRef, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDEditor from "components/MDEditor";
import MDInput from "components/MDInput";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ModalNotif from "contents/Components/ModalNotif";
import useAxios from "libs/useAxios";
import Config from "config";
import { Navigate, useParams } from "react-router-dom";
import ButtonBack from "contents/Components/ButtonBack";
import { Typography } from "@mui/material";
import secureStorage from "libs/secureStorage";

function FormPartnership() {
  // Trx Data
  const [id, idSet] = useState("");
  const [kk, kkSet] = useState("");
  const [fromBank, fromBankSet] = useState("");
  const [accountName, accountNameSet] = useState("");
  const [phoneNumber, phoneNumberSet] = useState("");
  const [paymentTypes, paymentTypesSet] = useState([{ id: 2, label: "TRANSFER" }]);
  const [paymentType, paymentTypeSet] = useState(null);
  const [bank, bankSet] = useState(null);
  const [address, addressSet] = useState("");
  const [image, imageSet] = useState(null);
  const [imageKtp, imageKtpSet] = useState(null);
  const [imageFilename, imageFilenameSet] = useState("");
  const [imageKtpFilename, imageKtpFilenameSet] = useState("");
  const [country, countrySet] = useState(null);
  const [province, provinceSet] = useState(null);
  const [district, districtSet] = useState(null);
  const [subDistrict, subDistrictSet] = useState(null);

  const [provinces, provincesSet] = useState([]);
  const [districts, districtsSet] = useState([]);
  const [subDistricts, subDistrictsSet] = useState([]);
  // Stokis
  const [stokisId, stokisIdSet] = useState(0);
  const [stokisName, stokisNameSet] = useState("");
  const [stokisPrice, stokisPriceSet] = useState(0);
  const [stokisDiscount, stokisDiscountSet] = useState(0);
  // Adysa Bank
  const [banks, banksSet] = useState([]);

  const [action, actionSet] = useState("");
  const [redirect, redirectSet] = useState(null);

  const [error, errorSet] = useState([]);
  const [success, successSet] = useState([]);

  const [disabledSubmit, disabledSubmitSet] = useState(false);

  const params = useParams();
  const imageRef = useRef();
  const imageKtpRef = useRef();
  const modalNotifRef = useRef();

  useEffect(() => {
    loadPath();
    loadBank();
  }, []);

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      actionSet("create");
      loadData(params.id);
      const user = secureStorage.getItem("user");
      if (user) {
        countrySet({ id: user.Country.id, label: user.Country.name });
        if (user.Province) {
          provinceSet({ id: user.Province.id, label: user.Province.name });
          loadDistrict(user.Province.id);
        }
        if (user.District) {
          districtSet({ id: user.District.id, label: user.District.name });
          loadSubDistrict(user.District.id);
        }

        if (user.SubDistrict) {
          subDistrictSet({ id: user.SubDistrict.id, label: user.SubDistrict.name });
        }
        loadProvince(user.Country.id);
      }
    } else {
      actionSet("update");
      loadDetail(params.id);
    }
  };

  const loadData = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/stokis/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        stokisIdSet(data.id);
        stokisNameSet(data.name);
        stokisPriceSet(parseInt(data.price));
        stokisDiscountSet(parseInt(data.discount));

        successSet({
          ...success,
          stokisDiscount: data && data.discount ? true : false,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/manage/partnership");
          },
        });
      });
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stokis/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        idSet(data.id);
        stokisDiscountSet(data.amount);
        stokisPriceSet(data.Stoki?.price);
        kkSet(data.kk);
        fromBankSet(data.fromBank);
        accountNameSet(data.accountName);
        phoneNumberSet(data.phoneNumber);
        paymentTypeSet({ id: data.PaymentType?.id, label: data.PaymentType?.name });
        bankSet({ id: data.Bank?.id, label: data.Bank?.name });
        addressSet(data.address);
        provinceSet({ id: data.Province?.id, label: data.Province?.name });
        districtSet({ id: data.District?.id, label: data.District?.name });
        subDistrictSet({ id: data.SubDistrict?.id, label: data.SubDistrict?.name });
        successSet({
          ...success,
          stokisDiscount: data.amount ? true : false,
          kk: data.kk ? true : false,
          fromBank: data.fromBank ? true : false,
          accountName: data.accountName ? true : false,
          phoneNumber: data.phoneNumber ? true : false,
          paymentType: data.PaymentType ? true : false,
          bank: data.Bank ? true : false,
          address: data.address ? true : false,
          province: data.Province ? true : false,
          district: data.District ? true : false,
          subDistrict: data.SubDistrict ? true : false,
          image: data.image ? true : false,
          imageKtp: data.imageKtp ? true : false,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/manage/partnership");
          },
        });
      });
  };

  const loadBank = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/bank/dropdown`)
      .then((response) => {
        const data = response.data.data;
        const output = data.map((bank) => {
          return {
            id: bank.id,
            label: `${bank.name} - ${bank.noRekening} - ${bank.accountName}`,
          };
        });

        banksSet(output);
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/manage/partnership");
          },
        });
      });
  };

  const loadProvince = (countryId) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/province?countryId=${countryId}`)
      .then((response) => {
        const data = response.data.data;
        const output = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        provincesSet(output);
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
        const output = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        districtsSet(output);
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
        const output = data.map((item) => ({
          id: item.id,
          label: item.name,
        }));
        subDistrictsSet(output);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const handleChange = (setState) => (event) => {
    setState(event.target.value);
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (value) {
      successSet({ ...success, [e.target.id]: true });
      errorSet({ ...error, [e.target.id]: false });
    } else {
      successSet({ ...success, [e.target.id]: false });
      errorSet({ ...error, [e.target.id]: true });
    }
  };

  const handleSubmit = () => {
    if (
      success.stokisDiscount &&
      success.kk &&
      success.fromBank &&
      success.accountName &&
      success.phoneNumber &&
      success.paymentType &&
      success.bank &&
      success.image &&
      success.imageKtp &&
      success.address &&
      success.province &&
      success.district &&
      success.subDistrict
    ) {
      sendData();
    } else {
      let input = "";
      !success.subDistrict && (input = "Kecamatan");
      !success.district && (input = "Kota / Kabupaten");
      !success.province && (input = "Provinsi");
      !success.address && (input = "Alamat");
      !success.imageKtp && (input = "KTP");
      !success.image && (input = "Bukti Transfer");
      !success.bank && (input = "Bank Tujuan");
      !success.paymentType && (input = "Metode Pembayaran");
      !success.phoneNumber && (input = "Nomor Telpon");
      !success.accountName && (input = "Pemilik Bank");
      !success.fromBank && (input = "Dari Bank");
      !success.kk && (input = "No NIK");
      !success.stokisDiscount && (input = "Harga");

      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const user = secureStorage.getItem("user");
    const formData = new FormData();
    formData.append("id", id);
    formData.append("amount", stokisDiscount);
    formData.append("kk", kk);
    formData.append("fromBank", fromBank);
    formData.append("accountName", accountName);
    formData.append("phoneNumber", phoneNumber.replace("08", "628"));
    formData.append("userId", user.id);
    formData.append("stokisId", stokisId);
    formData.append("paymentTypeId", paymentType.id);
    formData.append("bankId", bank.id);
    formData.append("address", address);
    formData.append("image", image);
    formData.append("imageKtp", imageKtp);
    formData.append("countryId", user.Country?.id);
    formData.append("provinceId", province.id);
    formData.append("districtId", district.id);
    formData.append("subDistrictId", subDistrict.id);

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/stokis/${action}`, formData)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            redirectSet("/manage/partnership");
          },
        });
      })
      .catch((err) => {
        disabledSubmitSet(false);
        if (err.response?.data) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? Array.isArray(err.response.data?.message)
                ? err.response.data?.message[0].message
                : err.response.data?.message
              : "Terjadi kesalahan pada system",
            color: "warning",
          });
        } else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
            color: "warning",
          });
        }
      });
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MDBox mt={5} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <MDBox mt={6} mb={8} textAlign="center">
              <MDBox mb={1}>
                <MDTypography variant="h4" fontWeight="bold">
                  {stokisName}
                </MDTypography>
              </MDBox>
              <MDTypography
                variant="h6"
                fontWeight="light"
                color="error"
                style={{ textDecoration: "line-through" }}
              >
                Rp. {new Intl.NumberFormat("id-ID").format(stokisPrice)}
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold" color="success">
                Rp. {new Intl.NumberFormat("id-ID").format(stokisDiscount)}
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox mt={-3} mb={3} mx={2}>
                <Stepper alternativeLabel>
                  <Step>
                    <StepLabel>Form Pendaftaran</StepLabel>
                  </Step>
                </Stepper>
              </MDBox>
              <MDBox p={2}>
                <MDBox>
                  <MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Harga"
                            id="amount"
                            value={`Rp. ${new Intl.NumberFormat("id-ID").format(stokisDiscount)}`}
                            // onChange={(e) => amountSet(e.target.value)}
                            onBlur={handleBlur}
                            success={success ? success.stokisDiscount : false}
                            error={error ? error.stokisDiscount : false}
                            variant="standard"
                            disabled={true}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="No NIK"
                            id="kk"
                            value={kk}
                            onChange={handleChange(kkSet)}
                            onBlur={handleBlur}
                            success={success ? success.kk : false}
                            error={error ? error.kk : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Dari Bank"
                            id="fromBank"
                            value={fromBank}
                            onChange={handleChange(fromBankSet)}
                            onBlur={handleBlur}
                            success={success ? success.fromBank : false}
                            error={error ? error.fromBank : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Nama Pemilik Bank"
                            id="accountName"
                            value={accountName}
                            onChange={handleChange(accountNameSet)}
                            onBlur={handleBlur}
                            success={success ? success.accountName : false}
                            error={error ? error.accountName : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Nomor Telpon"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={handleChange(phoneNumberSet)}
                            onBlur={handleBlur}
                            success={success ? success.phoneNumber : false}
                            error={error ? error.phoneNumber : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={paymentTypes}
                            id="paymentType"
                            value={paymentType}
                            onChange={(e, newValue) => {
                              paymentTypeSet(newValue);
                              successSet({ ...success, paymentType: true });
                              errorSet({ ...error, paymentType: false });
                            }}
                            onBlur={handleBlur}
                            variant="standard"
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                label="Metode Pembayran"
                                success={success ? success.paymentType : false}
                                error={error ? error.paymentType : false}
                                variant="standard"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={banks}
                            id="bank"
                            value={bank}
                            onChange={(e, newValue) => {
                              bankSet(newValue);
                              successSet({ ...success, bank: true });
                              errorSet({ ...error, bank: false });
                            }}
                            onBlur={handleBlur}
                            variant="standard"
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                label="Bank Tujuan"
                                success={success ? success.bank : false}
                                error={error ? error.bank : false}
                                variant="standard"
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
                                  imageSet(file);
                                  imageFilenameSet(filename);
                                  successSet({ ...success, image: true });
                                  errorSet({ ...error, image: false });
                                }
                              }}
                              hidden
                            />
                            <MDInput
                              fullWidth
                              value={imageFilename}
                              label="Upload Bukti Transfer"
                              variant="standard"
                              onClick={() => {
                                imageRef.current.click();
                              }}
                              readOnly
                              id="image"
                              onBlur={handleBlur}
                              success={success ? success.image : false}
                              error={error ? error.image : false}
                            />
                            <small style={{ color: "red", fontSize: "12px" }}>
                              Maksimal ukuran 2MB
                            </small>
                          </MDBox>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDBox mb={2}>
                            <input
                              type="file"
                              name="fileInput"
                              ref={imageKtpRef}
                              onChange={(e) => {
                                if (e.target.files.length === 1) {
                                  const file = e.target.files[0];
                                  const filename = file.name;
                                  const ext = filename.split(".")[1];
                                  imageKtpSet(file);
                                  imageKtpFilenameSet(filename);
                                  successSet({ ...success, imageKtp: true });
                                  errorSet({ ...error, imageKtp: false });
                                }
                              }}
                              hidden
                            />
                            <MDInput
                              fullWidth
                              value={imageKtpFilename}
                              label="Upload KTP"
                              variant="standard"
                              onClick={() => {
                                imageKtpRef.current.click();
                              }}
                              readOnly
                              id="imageKtp"
                              onBlur={handleBlur}
                              success={success ? success.imageKtp : false}
                              error={error ? error.imageKtp : false}
                            />
                            <small style={{ color: "red", fontSize: "12px" }}>
                              Maksimal ukuran 2MB
                            </small>
                          </MDBox>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={2} textAlign="center">
                      <MDTypography variant="h5" fontWeight="bold">
                        Pilih Wilayah Stokis
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Alamat"
                            id="address"
                            value={address}
                            onChange={handleChange(addressSet)}
                            onBlur={handleBlur}
                            success={success ? success.address : false}
                            error={error ? error.address : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={provinces}
                            id="province"
                            value={province}
                            onChange={(e, newValue) => {
                              if (newValue) {
                                provinceSet(newValue);
                                loadDistrict(newValue.id);
                                districtsSet([]);
                                districtSet(null);
                                subDistrictsSet([]);
                                subDistrictSet(null);
                                successSet({
                                  ...success,
                                  province: true,
                                  district: false,
                                  subDistrict: false,
                                });
                                errorSet({
                                  ...error,
                                  province: false,
                                  district: true,
                                  subDistrict: true,
                                });
                              }
                            }}
                            onBlur={handleBlur}
                            variant="standard"
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                label="Provinsi"
                                success={success ? success.province : false}
                                error={error ? error.province : false}
                                variant="standard"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={districts}
                            id="district"
                            value={district}
                            onChange={(e, newValue) => {
                              if (newValue) {
                                districtSet(newValue);
                                loadSubDistrict(newValue.id);
                                subDistrictsSet([]);
                                subDistrictSet(null);
                                successSet({ ...success, district: true, subDistrict: false });
                                errorSet({ ...error, district: false, subDistrict: true });
                              }
                            }}
                            onBlur={handleBlur}
                            variant="standard"
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                label="Kota / Kabupaten"
                                success={success ? success.district : false}
                                error={error ? error.district : false}
                                variant="standard"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={subDistricts}
                            id="subDistrict"
                            value={subDistrict}
                            onChange={(e, newValue) => {
                              if (newValue) {
                                subDistrictSet(newValue);
                                successSet({ ...success, subDistrict: true });
                                errorSet({ ...error, subDistrict: false });
                              }
                            }}
                            onBlur={handleBlur}
                            variant="standard"
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            renderInput={(params) => (
                              <MDInput
                                {...params}
                                label="Kecamatan"
                                success={success ? success.subDistrict : false}
                                error={error ? error.subDistrict : false}
                                variant="standard"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </MDBox>
                  <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                    <ButtonBack label={"KEMBALI"} />
                    <MDButton
                      variant="gradient"
                      type="button"
                      color="dark"
                      onClick={handleSubmit}
                      disabled={disabledSubmit}
                    >
                      {action == "create" ? "Submit" : "Update"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FormPartnership;
