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

import MiniFormCard from "contents/Components/FormCard/MiniFormCard";
import ButtonBack from "contents/Components/ButtonBack";
import secureStorage from "libs/secureStorage";

function FormTrxProduct() {
  const [title, titleSet] = useState("");
  const [name, nameSet] = useState("");
  const [stock, stockSet] = useState("");
  const [amount, amountSet] = useState(0);
  const [discount, discountSet] = useState(0);
  const [type, typeSet] = useState("");
  const [description, descriptionSet] = useState("");
  const [remark, remarkSet] = useState("");
  const [image, imageSet] = useState("");
  const [category, categorySet] = useState("");
  const [action, actionSet] = useState("");
  const [disabledSubmit, disabledSubmitSet] = useState("");
  const [redirect, redirectSet] = useState("");
  const [address, addressSet] = useState("");
  const [bank, bankSet] = useState(null);
  const [banks, banksSet] = useState([]);
  const [error, errorSet] = useState({});
  const [success, successSet] = useState({ qty: true });

  // state form
  const [id, idSet] = useState("");
  const [productId, productIdSet] = useState(null);
  const [qty, qtySet] = useState(1);
  const [totalAmount, totalAmountSet] = useState(0);
  const [totalDiscount, totalDiscountSet] = useState(0);
  const [paidAmount, paidAmountSet] = useState(0);
  const [fromBank, fromBankSet] = useState("");
  const [accountName, accountNameSet] = useState("");
  const [bankId, bankIdSet] = useState("");
  const [imageTf, imageTfSet] = useState(null);
  const [imageTfFilename, imageTfFilenameSet] = useState("");
  const [paymentTypes, paymentTypesSet] = useState([{ id: 2, label: "TRANSFER" }]);
  const [paymentType, paymentTypeSet] = useState(null);

  const params = useParams();
  const modalNotifRef = useRef();
  const imageTfRef = useRef();

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![3].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadPath();
    }
  }, []);

  const loadPath = () => {
    const pathname = window.location.pathname;
    const index = pathname.indexOf("edit");
    if (index === -1) {
      titleSet("Form Pemesanan Produk");
      actionSet("create");
      loadProduct(params.id);
    } else {
      titleSet("Edit Pemesanan Produk");
      actionSet("update");
      loadDetail(params.id);
    }
    loadBank();
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
            redirectSet("/trx/product");
          },
        });
      });
  };

  const loadProduct = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/product/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        const ddiscount = data.discount ? data.discount : 0;
        const dtotalAmount = parseInt(data.amount) * qty;
        const dtotalDiscount = ddiscount * qty;
        const dpaidAmount = dtotalAmount - dtotalDiscount;
        productIdSet(data.id);
        nameSet(data.name);
        stockSet(data.stock);
        amountSet(data.amount);
        totalAmountSet(dtotalAmount);
        totalDiscountSet(dtotalDiscount);
        paidAmountSet(dpaidAmount);
        categorySet(data.ProductCategory ? data.ProductCategory.name : null);
        imageSet(data.image);
        discountSet(ddiscount);

        successSet({
          ...success,
          totalDiscount: dtotalDiscount < 0 ? false : true,
          totalAmount: dtotalAmount > 0 ? true : false,
          paidAmount: dpaidAmount > 0 ? true : false,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err.response.data);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage:
            err.response && err.response.data
              ? err.response.data?.message
              : err.response.message
              ? err.response.message
              : "Terjadi kesalahan pada system",
          color: "warning",
          onClose: () => {
            redirectSet("/trx/product");
          },
        });
      });
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/product/get/${id}`)
      .then((response) => {
        const data = response.data.data;

        const discount = data.Product?.discount ? data.Product.discount : 0;

        idSet(data.id);
        productIdSet(data.Product?.id);
        amountSet(data.Product?.amount);
        discountSet(discount);
        stockSet(data.Product?.stock);
        nameSet(data.Product?.name);
        qtySet(data.qty);
        totalAmountSet(data.amount);
        totalDiscountSet(data.discount);
        paidAmountSet(data.paidAmount);
        fromBankSet(data.fromBank);
        accountNameSet(data.accountName);
        imageTfSet(data.image);
        paymentTypeSet(
          data.PaymentType ? { id: data.PaymentType.id, label: data.PaymentType.name } : null
        );
        bankSet(data.Bank ? { id: data.Bank.id, label: data.Bank.name } : null);
        addressSet(data.address);
        imageTfFilenameSet(data.image);

        successSet({
          ...success,
          qty: data.qty ? true : false,
          totalAmount: data.amount ? true : false,
          totalDiscount: data.totalDiscount < 0 ? false : true,
          paidAmount: data.paidAmount ? true : false,
          fromBank: data.fromBank ? true : false,
          accountName: data.accountName ? true : false,
          imageTf: data.image ? true : false,
          paymentType: data.PaymentType ? true : false,
          bank: data.Bank ? true : false,
          address: data.address ? true : false,
          imageTf: data.image ? true : false,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err.response.data);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage:
            err.response && err.response.data
              ? err.response.data?.message
              : err.response.message
              ? err.response.message
              : "Terjadi kesalahan pada system",
          color: "warning",
          onClose: () => {
            redirectSet("/trx/product");
          },
        });
      });
  };

  const handleChange = (stateSet) => (e) => {
    stateSet(e.target.value);
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (value) {
      successSet({ ...success, [id]: true });
      errorSet({ ...error, [id]: false });
    } else {
      successSet({ ...success, [id]: false });
      errorSet({ ...error, [id]: true });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = () => {
    if (
      success.qty &&
      success.totalAmount &&
      success.totalDiscount &&
      success.paidAmount &&
      success.fromBank &&
      success.accountName &&
      success.paymentType &&
      success.bank &&
      success.address &&
      success.imageTf
    ) {
      if (qty > stock) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Jumlah pesanan melebihi stock yang tersedia",
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !success.imageTf && (input = "Bukti Pembayaran");
      !success.address && (input = "Alamat Pengiriman");
      !success.accountName && (input = "Nama Pemilik");
      !success.fromBank && (input = "Dari Bank");
      !success.bank && (input = "Bank Tujuan");
      !success.paymentType && (input = "Jenis Pembayaran");
      !success.paidAmount && (input = "Total Bayar");
      !success.totalDiscount && (input = "Total Diskon");
      !success.totalAmount && (input = "Total Harga");
      !success.qty && (input = "Total Produk");

      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("qty", qty);
    formData.append("amount", totalAmount);
    formData.append("discount", totalDiscount);
    formData.append("paidAmount", paidAmount);
    formData.append("fromBank", fromBank);
    formData.append("accountName", accountName);
    formData.append("productId", productId);
    formData.append("paymentTypeId", paymentType?.id);
    formData.append("bankId", bank?.id);
    formData.append("address", address);
    formData.append("image", imageTf);

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/product/${action}`, formData)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            redirectSet("/trx/product");
          },
        });
      })
      .catch((err) => {
        disabledSubmitSet(false);
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
                <MDTypography variant="h3" fontWeight="bold">
                  {title}
                </MDTypography>
              </MDBox>
            </MDBox>
            <Card>
              <MDBox mt={-3} mb={3} mx={2}>
                <Stepper alternativeLabel>
                  <Step>
                    <StepLabel>Produk {name}</StepLabel>
                  </Step>
                </Stepper>
              </MDBox>
              <MDBox p={2}>
                <MDBox>
                  <MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={9}>
                            <MDInput
                              type="text"
                              label="Nama Produk"
                              id="name"
                              value={name}
                              disabled={true}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} my={2}></Grid>
                          <Grid item xs={12} sm={2}>
                            <MDInput
                              type="text"
                              label="Stok"
                              id="stock"
                              value={stock}
                              disabled={true}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={5}>
                            <MDInput
                              type="text"
                              label="Harga Satuan"
                              id="amount"
                              value={`Rp. ${new Intl.NumberFormat("id-ID").format(amount)}`}
                              disabled={true}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} my={2}></Grid>
                          <Grid item xs={12} sm={5}>
                            <MDInput
                              type="text"
                              label="Diskon Satuan"
                              id="discount"
                              value={`Rp. ${new Intl.NumberFormat("id-ID").format(discount)}`}
                              disabled={true}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={4}>
                            <MDInput
                              type="number"
                              label="Jumlah Pesanan"
                              id="qty"
                              value={qty}
                              onChange={(e) => {
                                const { value, id } = e.target;

                                qtySet(value);
                                const totalPrice = value * amount;
                                const totalDisc = value * discount;
                                const totalPaid = totalPrice - totalDisc;
                                totalAmountSet(totalPrice);
                                if (value > 0) {
                                  totalDiscountSet(totalDisc);
                                  paidAmountSet(totalPaid);

                                  successSet({
                                    ...success,
                                    qty: true,
                                    totalAmount: true,
                                    totalDiscount: true,
                                    paidAmount: true,
                                  });
                                } else {
                                  totalDiscountSet(0);
                                  paidAmountSet(totalPrice);
                                  successSet({
                                    ...success,
                                    qty: false,
                                    totalAmount: false,
                                    totalDiscount: false,
                                    paidAmount: false,
                                  });

                                  errorSet({
                                    ...error,
                                    qty: true,
                                    totalAmount: true,
                                    totalDiscount: true,
                                    paidAmount: true,
                                  });
                                }
                              }}
                              success={success ? success.qty : false}
                              error={error ? error.qty : false}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} my={2}></Grid>
                          <Grid item xs={12} sm={7}>
                            <MDInput
                              type="text"
                              label="Total Harga"
                              id="totalAmount"
                              value={`Rp. ${new Intl.NumberFormat("id-ID").format(totalAmount)}`}
                              success={success ? success.totalAmount : false}
                              error={error ? error.totalAmount : false}
                              disabled={true}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={5}>
                            <MDInput
                              type="text"
                              label="Total Diskon"
                              id="totalDiscount"
                              value={`Rp. ${new Intl.NumberFormat("id-ID").format(totalDiscount)}`}
                              success={success ? success.totalDiscount : false}
                              error={error ? error.totalDiscount : false}
                              disabled={true}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} my={2}></Grid>
                          <Grid item xs={12} sm={5}>
                            <MDInput
                              type="text"
                              label="Total Bayar"
                              id="paidAmount"
                              value={`Rp. ${new Intl.NumberFormat("id-ID").format(paidAmount)}`}
                              success={success ? success.paidAmount : false}
                              error={error ? error.paidAmount : false}
                              disabled={true}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={4}>
                            <Autocomplete
                              mb={2}
                              options={paymentTypes}
                              id="paymentType"
                              value={paymentType}
                              onKeyDown={handleKeyDown}
                              onChange={(e, value) => {
                                paymentTypeSet(value);
                              }}
                              onBlur={handleBlur}
                              success={true}
                              variant="standard"
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              fullWidth
                              renderInput={(params) => (
                                <MDInput
                                  {...params}
                                  label="Jenis Pembayaran"
                                  success={success ? success.paymentType : false}
                                  error={error ? error.paymentType : false}
                                  variant="standard"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={1} my={2}></Grid>
                          <Grid item xs={12} sm={7}>
                            <Autocomplete
                              options={banks}
                              id="bank"
                              value={bank}
                              onKeyDown={handleKeyDown}
                              onChange={(e, value) => {
                                bankSet(value);
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
                        </Grid>
                        <Grid item container xs={12} sm={6}>
                          <Grid item xs={12} sm={4}>
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
                          <Grid item xs={12} sm={1} my={2}></Grid>
                          <Grid item xs={12} sm={7}>
                            <MDInput
                              type="text"
                              label="Nama Pemilik Bank"
                              id="accountName"
                              value={accountName}
                              onChange={handleChange(accountNameSet)}
                              success={success ? success.accountName : false}
                              error={error ? error.accountName : false}
                              onBlur={handleBlur}
                              variant="standard"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={8}>
                          <MDInput
                            type="text"
                            label="Alamat Pengiriman"
                            id="address"
                            value={address}
                            onChange={handleChange(addressSet)}
                            onBlur={handleBlur}
                            success={success ? success.address : false}
                            error={error ? error.address : false}
                            multiline
                            rows={3}
                            fullWidth
                          />
                        </Grid>
                        <Grid item container xs={12} sm={4}>
                          <input
                            type="file"
                            name="fileInput"
                            ref={imageTfRef}
                            onChange={(e) => {
                              if (e.target.files.length === 1) {
                                const file = e.target.files[0];
                                const filename = file.name;
                                const ext = filename.split(".")[1];
                                imageTfSet(file);
                                imageTfFilenameSet(filename);
                              }
                            }}
                            hidden
                          />
                          <MDInput
                            fullWidth
                            value={imageTfFilename}
                            label="Upload Bukti Pembayaran"
                            variant="standard"
                            onClick={() => {
                              imageTfRef.current.click();
                            }}
                            readOnly
                            id="imageTf"
                            onBlur={handleBlur}
                            success={success ? success.imageTf : false}
                            error={error ? error.imageTf : false}
                          />
                          <small style={{ color: "red", fontSize: "12px" }}>
                            Maksimal ukuran 2MB
                          </small>
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
    </DashboardLayout>
  );
}

export default FormTrxProduct;
