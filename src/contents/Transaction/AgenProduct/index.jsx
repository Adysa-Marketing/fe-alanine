import { useEffect, useRef, useState } from "react";
import { Navigate, Link } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";

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

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
import moment from "moment";
import ButtonAction from "contents/Components/ButtonAction";
import ModalNotif from "contents/Components/ModalNotif";

function TrxAgenProduct() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Action", accessor: "action", width: "15%" },
    { Header: "Kode", accessor: "kode", width: "15%" },
    { Header: "Status", accessor: "status", width: "15%" },
    { Header: "Nama", accessor: "name", width: "15%" },
    { Header: "Produk", accessor: "product", width: "15%" },
    { Header: "Jumlah", accessor: "qty", width: "20%" },
    { Header: "Total", accessor: "amount", width: "25%" },
    { Header: "Profit", accessor: "profit", width: "20%" },
    { Header: "Tanggal", accessor: "createdAt", width: "20%" },
  ]);

  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([]);

  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");

  // state form
  const [product, productSet] = useState(null);
  const [products, productsSet] = useState([]);
  const [stock, stockSet] = useState(0);
  const [name, nameSet] = useState("");
  const [qty, qtySet] = useState(1);
  const [amount, amountSet] = useState(0);
  const [totalAmount, totalAmountSet] = useState(0);
  const [image, imageSet] = useState(null);
  const [imageFilename, imageFilenameSet] = useState("");
  const [paymentType, paymentTypeSet] = useState(null);
  const [paymentTypes, paymentTypesSet] = useState([
    { id: 1, label: "CASH" },
    { id: 2, label: "TRANSFER" },
  ]);
  const [disabledSubmit, disabledSubmitSet] = useState(false);

  const [redirect, redirectSet] = useState(null);

  const [success, successSet] = useState([]);
  const [error, errorSet] = useState([]);

  const imageRef = useRef();
  const modalNotifRef = useRef();

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user && [3].includes(user.roleId)) {
      loadAgenProduct();
      loadData();
      loadTrStatus();
    } else {
      redirectSet("/dashboard");
    }
  }, []);

  const refreshData = () => {
    loadTrStatus();
    loadData();
    resetForm();
    loadAgenProduct();
  };

  const loadAgenProduct = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/manage/agen-product/dropdown`)
      .then((response) => {
        const data = response.data.data;
        const output = data.map((item) => {
          return {
            id: item.id,
            label: item.name,
            amount: item.amount,
            stock: item.stock,
          };
        });
        productsSet(output);
      })
      .catch((error) => console.log("[!] Error : ", error));
  };

  const loadTrStatus = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/tr-status`)
      .then((response) => {
        let data = response.data.data;
        data.pop();
        data = data.map((status) => {
          return {
            id: status.id,
            label: status.name,
          };
        });

        statusesSet(data);
      })
      .catch((error) => console.log("[!] Error :", error));
  };

  const loadData = (params) => {
    isLoadingSet(true);

    const statusId = params && params.statusId ? { statusId: params.statusId } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      startDate: params && params.startDate ? params.startDate : startDate,
      endDate: params && params.endDate ? params.endDate : endDate,
      ...statusId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/product/agen/list`, payload)
      .then((response) => {
        const data = response.data;
        const output = data.data.map((item) => {
          const trStatus = item.TrStatus ? item.TrStatus : null;
          return {
            kode: (
              <MDTypography
                variant="caption"
                fontWeight="medium"
                sx={{
                  cursor: "pointer",
                }}
                color="info"
                component={Link}
                to={{ pathname: `/trx/product/agen/detail/${item.id}` }}
              >
                {item.kode}
              </MDTypography>
            ),
            name: item.name,
            product: item.Product?.name,
            qty: item.qty,
            amount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
            profit: "Rp. " + new Intl.NumberFormat("id-ID").format(item.profit),
            createdAt: moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
            status: trStatus ? (
              <MDBadge
                variant="contained"
                badgeContent={trStatus.name}
                size="lg"
                color={
                  trStatus.id === 1 //pending
                    ? "secondary"
                    : trStatus.id === 2 //cancel
                    ? "error"
                    : trStatus.id === 4 //approved
                    ? "success"
                    : "warning"
                }
              />
            ) : (
              "-"
            ),
            action: (
              <ButtonAction
                id={item.id}
                urlKey={"trx/product/agen"}
                refreshData={refreshData}
                statusId={trStatus.id}
                detail={true}
                cancel={[1].includes(trStatus.id)}
                remove={[1, 2].includes(trStatus.id)}
                approve={[1].includes(trStatus.id)}
              ></ButtonAction>
            ),
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

  const handleChange = (setState) => (e) => {
    setState(e.target.value);
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

  const resetForm = () => {
    productSet(null);
    stockSet(0);
    nameSet("");
    qtySet(1);
    amountSet(0);
    totalAmountSet(0);
    imageSet(null);
    imageFilenameSet("");
    paymentTypeSet(null);

    successSet({
      ...success,
      product: false,
      stock: false,
      name: false,
      qty: false,
      amount: false,
      totalAmount: false,
      image: false,
      paymentType: false,
    });
  };

  const handleSubmit = () => {
    if (
      success.name &&
      success.paymentType &&
      success.product &&
      success.qty &&
      success.totalAmount
    ) {
      if (parseInt(stock) < parseInt(qty)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: `Mohon maaf stock produk tidak cukup`,
        });
      } else if (paymentType.id == 2) {
        if (!success.image || imageFilename == "") {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: `Upload bukti pembayaran dahulu`,
          });
        } else {
          sendData();
        }
      } else {
        sendData();
      }
    } else {
      let input = "";
      !success.totalAmount && (input = "Total Pembayaran");
      !success.qty && (input = "Jumlah Pembelian");
      !success.product && (input = "Produk");
      !success.paymentType && (input = "Jenis Pembayaran");
      !success.name && (input = "Nama Pelanggan");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" tidak sesuai, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("qty", qty);
    formData.append("amount", totalAmount);
    formData.append("productId", product.id);
    formData.append("paymentTypeId", paymentType.id);
    if (image && imageFilename) {
      formData.append("image", image);
    }

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/product/agen/create`, formData)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            refreshData();
            disabledSubmitSet(false);
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
  const userData = secureStorage.getItem("user");

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MDBox pb={3} my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card>
              <MDBox p={2} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  Form Penjualan
                </MDTypography>
                <MDBox component="form" role="form" mt={3}>
                  <MDBox mb={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <MDInput
                          type="text"
                          label="Nama Pelanggan"
                          id="name"
                          value={name}
                          onChange={handleChange(nameSet)}
                          onBlur={handleBlur}
                          success={success ? success.name : false}
                          error={error ? error.name : false}
                          variant="standard"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          mb={2}
                          options={paymentTypes}
                          id="paymentType"
                          value={paymentType}
                          onChange={(e, value) => {
                            paymentTypeSet(value);
                            imageFilenameSet("");
                            imageSet(null);
                            successSet({
                              ...success,
                              image: false,
                            });
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
                    </Grid>
                  </MDBox>
                  <MDBox mb={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          mb={2}
                          options={products}
                          id="product"
                          value={product}
                          onChange={(e, value) => {
                            if (value) {
                              productSet({ id: value.id, label: value.label });
                              stockSet(value.stock);
                              amountSet(value.amount);
                              totalAmountSet(parseInt(value.amount) * qty);

                              successSet({
                                ...success,
                                totalAmount: true,
                              });
                            }
                          }}
                          onBlur={handleBlur}
                          success={true}
                          variant="standard"
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          fullWidth
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              label="Pilih Produk"
                              success={success ? success.product : false}
                              error={error ? error.product : false}
                              variant="standard"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item container xs={12} sm={6}>
                        <Grid item container xs={12} sm={7}>
                          <MDInput
                            type="text"
                            label="Harga"
                            id="amount"
                            value={"Rp. " + new Intl.NumberFormat("id-ID").format(amount)}
                            onBlur={handleBlur}
                            success={success ? success.amount : false}
                            error={error ? error.amount : false}
                            variant="standard"
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid item container xs={12} sm={1} my={2}></Grid>
                        <Grid item container xs={12} sm={4}>
                          <MDInput
                            type="text"
                            label="Stok"
                            id="stock"
                            value={stock}
                            onBlur={handleBlur}
                            success={success ? success.stock : false}
                            error={error ? error.stock : false}
                            variant="standard"
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox mb={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <MDInput
                          type="number"
                          label="Jumlah Pembelian"
                          id="qty"
                          value={qty}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (stock < value || value < 1) {
                              successSet({ ...success, qty: false, totalAmount: false });
                              errorSet({ ...error, qty: true, totalAmount: true });
                            } else {
                              successSet({ ...success, qty: true, totalAmount: true });
                              errorSet({ ...error, qty: false, totalAmount: false });
                            }
                            qtySet(value);
                            totalAmountSet(parseInt(amount) * parseInt(value ? value : 0));
                          }}
                          success={success ? success.qty : false}
                          error={error ? error.qty : false}
                          variant="standard"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MDInput
                          type="text"
                          label="Total"
                          id="totalAmount"
                          value={"Rp. " + new Intl.NumberFormat("id-ID").format(totalAmount)}
                          onBlur={handleBlur}
                          success={success ? success.totalAmount : false}
                          error={error ? error.totalAmount : false}
                          variant="standard"
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                    </Grid>
                  </MDBox>
                  {[2].includes(paymentType?.id) && (
                    <MDBox mb={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
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
                              }
                            }}
                            hidden
                          />
                          <MDInput
                            fullWidth
                            value={imageFilename}
                            label="Upload Bukti Pembayaran"
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
                        </Grid>
                      </Grid>
                    </MDBox>
                  )}
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={handleSubmit}
                      disabled={disabledSubmit}
                      fullWidth
                    >
                      SUBMIT
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={userData && [1, 2].includes(userData.roleId) ? 12 : 8}>
            <Card>
              <MDBox p={2} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  Daftar Penjualan
                </MDTypography>
              </MDBox>

              <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3} lg={3}>
                    <Autocomplete
                      value={status}
                      options={statuses}
                      onChange={(e, value) => {
                        statusSet(value);
                        loadData({
                          keyword,
                          currentPage: 1,
                          startDate,
                          endDate,
                          statusId: value ? value.id : null,
                        });
                      }}
                      sx={{
                        ".MuiAutocomplete-input": {
                          padding: "7.5px 5px 7.5px 8px !important",
                        },
                        ".MuiOutlinedInput-root": {
                          padding: "1.5px !important",
                        },
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <MDInput
                          sx={{ padding: "0px" }}
                          fullWidth
                          label="Pilih Status"
                          {...params}
                        />
                      )}
                    />
                  </Grid>
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
                          keyword,
                          currentPage: 1,
                          startDate,
                          endDate,
                          statusId: status ? status.id : null,
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
                      keyword,
                      rowsPerPage: value,
                      currentPage: 1,
                      startDate,
                      endDate,
                      statusId: status ? status.id : null,
                    });
                  }}
                  onChangePage={(current) => {
                    if (current !== currentPage) {
                      currentPageSet(current);
                      loadData({
                        keyword,
                        rowsPerPage,
                        currentPage: current,
                        startDate,
                        endDate,
                        statusId: status ? status.id : null,
                      });
                    }
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default TrxAgenProduct;
