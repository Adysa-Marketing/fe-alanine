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

function Widhraw() {
  const [user, userSet] = useState(null);
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
    { Header: "Bank", accessor: "bankName", width: "20%" },
    { Header: "Penarikan", accessor: "amount", width: "25%" },
    { Header: "Dibayar", accessor: "paidAmount", width: "20%" },
    { Header: "Tanggal Pengajuan", accessor: "createdAt", width: "20%" },
    { Header: "Tanggal Dibayar", accessor: "updatedAt", width: "25%" },
  ]);

  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([]);

  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");

  // state form
  const [wallet, walletSet] = useState(0);
  const [kk, kkSet] = useState("");
  const [amount, amountSet] = useState(0);
  const [noRekening, noRekeningSet] = useState("");
  const [accountName, accountNameSet] = useState("");
  const [bankName, bankNameSet] = useState("");
  const [password, passwordSet] = useState("");
  const [imageKtp, imageKtpSet] = useState(null);
  const [imageKtpFilename, imageKtpFilenameSet] = useState("");
  const [disabledSubmit, disabledSubmitSet] = useState(false);
  const [remark, remarkSet] = useState("");

  const [success, successSet] = useState([]);
  const [error, errorSet] = useState([]);

  const imageKtpRef = useRef();
  const modalNotifRef = useRef();

  useEffect(() => {
    const userData = secureStorage.getItem("user");
    userSet(userData);
    loadUserBank();
    loadWdStatus();
    loadData();
  }, []);

  const refreshData = () => {
    loadUserBank();
    loadWdStatus();
    loadData();
    resetForm();
  };

  const loadUserBank = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/setting/bank/get`)
      .then((response) => {
        const data = response.data.data;
        // load self info
        useAxios()
          .get(`${Config.ApiUrl}/api/v1/trx/stat/self-info`)
          .then((response) => {
            const info = response.data;
            bankNameSet(data.name);
            noRekeningSet(data.noRekening);
            accountNameSet(data.accountName);
            walletSet(info.wallet);
            kkSet(info.kk);

            successSet({
              ...success,
              kk: info.kk ? true : false,
              bankName: data.name ? true : false,
              noRekening: data.noRekening ? true : false,
              accountName: data.accountName ? true : false,
              amount: false,
              imageKtp: false,
              password: false,
            });

            errorSet({
              ...error,
              kk: !info.kk ? true : false,
              bankName: !data.name ? true : false,
              noRekening: !data.noRekening ? true : false,
              accountName: !data.accountName ? true : false,
              amount: true,
              imageKtp: true,
              password: true,
            });
          })
          .catch((error) => console.log("[!] Error : ", error));
      })
      .catch((error) => console.log("[!] Error : ", error));
  };

  const loadWdStatus = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/wd-status`)
      .then((response) => {
        let data = response.data.data;
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
      .post(`${Config.ApiUrl}/api/v1/trx/widhraw/list`, payload)
      .then((response) => {
        const user = secureStorage.getItem("user");
        const data = response.data;
        const output = data.data.map((item) => {
          const wdStatus = item.WdStatus ? item.WdStatus : null;
          return {
            kode: item.kode,
            name: item.User ? item.User.name : "-",
            bankName: `${item.bankName} - ${item.accountName} - ${item.noRekening}`,
            amount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
            paidAmount: "Rp. " + new Intl.NumberFormat("id-ID").format(item.paidAmount),
            createdAt: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: [5].includes(wdStatus?.id)
              ? moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss")
              : "-",
            status: wdStatus ? (
              <MDBadge
                variant="contained"
                badgeContent={wdStatus.name}
                size="lg"
                color={
                  wdStatus.id === 1
                    ? "secondary"
                    : wdStatus.id === 2
                    ? "error"
                    : wdStatus.id === 3
                    ? "warning"
                    : wdStatus.id === 4
                    ? "info"
                    : "success"
                }
              />
            ) : (
              "-"
            ),
            action: [1, 2].includes(user.roleId) ? (
              <ButtonAction
                id={item.id}
                urlKey={"/trx/widhraw"}
                refreshData={refreshData}
                statusId={wdStatus.id}
                detail={true}
                rejectTrx={true}
                processTrx={true}
                transferedTrx={true}
              ></ButtonAction>
            ) : [3, 4].includes(user.roleId) ? (
              <ButtonAction
                id={item.id}
                urlKey={"/trx/widhraw"}
                refreshData={refreshData}
                statusId={wdStatus.id}
                detail={true}
                edit={[1].includes(wdStatus.id ? true : false)}
                cancelTrx={true}
                remove={[1, 2, 3].includes(wdStatus.id) ? true : false}
              ></ButtonAction>
            ) : (
              "-"
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
    amountSet(0);
    imageKtpSet(null);
    imageKtpFilenameSet("");
    passwordSet("");

    successSet({
      ...success,
      amount: false,
      imageKtp: false,
      password: false,
    });

    errorSet({
      ...success,
      amount: true,
      imageKtp: true,
      password: true,
    });
  };

  const handleSubmit = () => {
    if (
      success.noRekening &&
      success.accountName &&
      success.bankName &&
      success.amount &&
      success.password &&
      success.imageKtp &&
      success.kk
    ) {
      if (parseInt(wallet) < parseInt(amount)) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: `Mohon maaf saldo anda tidak cukup`,
        });
      } else if (parseInt(amount) < 50000) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: `Minimal Widhraw Rp.50.000`,
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !success.password && (input = "Password");
      !success.imageKtp && (input = "KTP");
      !success.amount && (input = "Total Widhraw");
      !success.noRekening && (input = "No Rekening");
      !success.bankName && (input = "Nama Bank");
      !success.kk && (input = "No Nik");
      !success.accountName && (input = "Nama Pemilik");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const formData = new FormData();
    formData.append("kk", kk);
    formData.append("amount", amount);
    formData.append("noRekening", noRekening);
    formData.append("bankName", bankName);
    formData.append("accountName", accountName);
    formData.append("password", password);
    formData.append("imageKtp", imageKtp);

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/widhraw/create`, formData)
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MDBox pb={3} my={3}>
        <Grid container spacing={3}>
          {userData && [3, 4].includes(userData.roleId) && (
            <Grid item xs={12} lg={4}>
              <Card>
                <MDBox p={2} lineHeight={1}>
                  <MDTypography variant="h5" fontWeight="medium">
                    Form Widhraw
                  </MDTypography>
                  <MDBox component="form" role="form" mt={3}>
                    <MDBox mb={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Nama Pemilik Rekening"
                            id="accountName"
                            value={accountName}
                            onBlur={handleBlur}
                            success={success ? success.accountName : false}
                            error={error ? error.accountName : false}
                            variant="standard"
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="No NIK"
                            id="kk"
                            value={kk}
                            onBlur={handleBlur}
                            success={success ? success.kk : false}
                            error={error ? error.kk : false}
                            variant="standard"
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mb={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Nama Bank"
                            id="bankName"
                            value={bankName}
                            onBlur={handleBlur}
                            success={success ? success.bankName : false}
                            error={error ? error.bankName : false}
                            variant="standard"
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="text"
                            label="Nomor Rekening"
                            id="noRekening"
                            value={noRekening}
                            onBlur={handleBlur}
                            success={success ? success.noRekening : false}
                            error={error ? error.noRekening : false}
                            variant="standard"
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={3} textAlign="center">
                      <MDTypography
                        component={Link}
                        to="/setting/account"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        Update Data Bank
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={3} mt={-1} textAlign="center">
                      <MDTypography
                        component={Link}
                        to="/setting/account"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        ----------------------
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="number"
                            label="Total Widhraw"
                            id="amount"
                            value={amount}
                            onChange={handleChange(amountSet)}
                            onBlur={handleBlur}
                            success={success ? success.amount : false}
                            error={error ? error.amount : false}
                            variant="standard"
                            fullWidth
                          />
                          <small style={{ color: "green", fontSize: "12px" }}>
                            Saldo Kamu : {"Rp. " + new Intl.NumberFormat("id-ID").format(wallet)}
                          </small>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mb={2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MDInput
                            type="password"
                            label="Password"
                            id="password"
                            value={password}
                            onChange={handleChange(passwordSet)}
                            onBlur={handleBlur}
                            success={success ? success.password : false}
                            error={error ? error.password : false}
                            variant="standard"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox mt={4} mb={1}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        onClick={handleSubmit}
                        disabled={disabledSubmit}
                        fullWidth
                      >
                        Widhraw
                      </MDButton>
                    </MDBox>
                    <MDBox mt={3} mb={1} textAlign="left">
                      <small style={{ fontSize: "18px", color: "#445069" }}>Informasi : </small>
                      <ol
                        style={{ fontSize: "14px", margin: "15px 0px 0px 25px", color: "#445069" }}
                      >
                        <li style={{ margin: "5px 0px" }}>Minimal Widhraw Rp. 50.000</li>
                        <li style={{ margin: "5px 0px" }}>Biaya Admin Rp. 10.000 / Widhraw</li>
                        <li style={{ margin: "5px 0px" }}>
                          Biaya Admin dipotong dari total widhraw
                        </li>
                        <li style={{ margin: "5px 0px" }}>
                          Pastikan data anda sesuai dengan KTP agar widhraw tidak ditolak
                        </li>
                      </ol>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          )}

          <Grid item xs={12} lg={userData && [1, 2].includes(userData.roleId) ? 12 : 8}>
            <Card>
              <MDBox p={2} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  Daftar Widhraw
                </MDTypography>
              </MDBox>

              <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
                <Grid container spacing={3}>
                  {[1, 2].includes(userData.roleId) && (
                    <Grid item xs={12} md={3} lg={3}>
                      <MDInput
                        label="Search..."
                        size="small"
                        fullWidth
                        value={keyword}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            loadData({
                              currentPage: 1,
                              keyword: e.target.value,
                              statusId: status ? status.id : null,
                            });
                          }
                        }}
                        onChange={(e) => keywordSet(e.target.value)}
                      />
                    </Grid>
                  )}
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

export default Widhraw;
