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

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";
import ButtonAction from "contents/Components/ButtonAction";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
import moment from "moment";
import MDDatePicker from "components/MDDatePicker";
import BookingCard from "contents/Transaction/Reward/components/BookingCard";

import DialogForm from "contents/Components/DialogForm";
import ModalNotif from "contents/Components/ModalNotif";

function TrxReward() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Aksi", accessor: "action", width: "15%" },
    { Header: "Kode", accessor: "kode", width: "15%" },
    { Header: "Status", accessor: "status", width: "15%" },
    { Header: "Nama Item", accessor: "name", width: "25%" },
    { Header: "Nama", accessor: "user", width: "25%" },
    { Header: "No Hp", accessor: "phone", width: "25%" },
    { Header: "Tanggal", accessor: "date", width: "25%" },
    { Header: "Pengiriman", accessor: "remark", width: "25%" },
  ]);

  const [status, statusSet] = useState(null);
  const [statuses, statusesSet] = useState([]);

  const [reward, rewardSet] = useState(null);
  const [rewards, rewardsSet] = useState([]);
  const [dataRewards, dataRewardsSet] = useState([]);

  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");

  // data form
  const [dataId, dataIdSet] = useState(null);
  const [imageKtp, imageKtpSet] = useState(null);
  const [imageKtpFilename, imageKtpFilenameSet] = useState("");
  const [address, addressSet] = useState("");
  const [disabledSubmit, disabledSubmitSet] = useState(false);
  const [trxId, trxIdSet] = useState(null);
  const [action, actionSet] = useState("create");

  const [redirect, redirectSet] = useState(null);
  const dialogFormRef = useRef();
  const imageKtpRef = useRef();
  const modalNotifRef = useRef();

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      loadData();
      loadStatus();
      loadReward();
    }
  }, []);

  const loadStatus = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/tr-status`)
      .then((response) => {
        let data = response.data.data;
        data = data.map((item) => ({ id: item.id, label: item.name }));
        statusesSet(data);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const loadReward = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/reward/dropdown`)
      .then((response) => {
        let data = response.data.data;
        dataRewardsSet(data);
        data = data.map((item) => ({ id: item.id, label: item.name }));
        rewardsSet(data);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const loadData = (params) => {
    isLoadingSet(true);
    const user = secureStorage.getItem("user");

    const statusId = params && params.statusId ? { statusId: params.statusId } : {};
    const rewardId = params && params.rewardId ? { rewardId: params.rewardId } : {};
    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      startDate: params && params.startDate ? params.startDate : startDate,
      endDate: params && params.endDate ? params.endDate : endDate,
      ...statusId,
      ...rewardId,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/reward/list`, payload)
      .then((response) => {
        const data = response.data;
        const output = data.data.map((item) => {
          const rwStatus = item.RwStatus;
          return {
            kode: item.kode,
            name: item.Reward?.name,
            user: item.User?.name,
            phone: item.User?.phone,
            date: moment(item.date).format("YYYY-MM-DD HH:mm:ss"),
            remark: item.remark,
            status: rwStatus ? (
              <MDBadge
                variant="contained"
                badgeContent={rwStatus.name}
                size="lg"
                color={
                  rwStatus.id === 1
                    ? "secondary"
                    : rwStatus.id === 2
                    ? "error"
                    : rwStatus.id === 3
                    ? "warning"
                    : rwStatus.id === 4
                    ? "info"
                    : "success"
                }
              />
            ) : (
              "-"
            ),
            action: (
              <ButtonAction
                id={item.id}
                urlKey={"/trx/reward"}
                refreshData={refreshData}
                detail={true}
                cancel={[3, 4].includes(user.roleId)}
                remove={[1, 2, 3].includes(rwStatus.id) && [3, 4].includes(user.roleId)}
                reject={[1, 2].includes(user.roleId)}
                approve={[1, 2].includes(user.roleId)}
                deliver={[1, 2].includes(user.roleId)}
                statusId={rwStatus.id}
                editTrxRw={[3, 4].includes(user.roleId)}
                setIdTrxRw={setTrxId}
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

  const refreshData = () => {
    dataIdSet(null);
    imageKtpSet(null);
    imageKtpFilenameSet("");
    addressSet("");
    imageKtpRef.current.value = "";
    actionSet("create");
    trxIdSet(null);
    loadData();
    loadReward();
  };
  const setId = (id) => {
    imageKtpSet(null);
    imageKtpFilenameSet("");
    addressSet("");
    imageKtpRef.current.value = "";
    actionSet("create");
    dataIdSet(id);
  };

  const setTrxId = (id) => {
    trxIdSet(id);
    actionSet("update");
    loadDetail(id);
  };

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/reward/get/${id}`)
      .then((response) => {
        let data = response.data.data;
        dataIdSet(data.Reward.id);
        addressSet(data.address);
        dialogFormRef.current.setShow({ show: true, title: "Masukan Alamat Kamu" });
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const handleSubmit = () => {
    if (!dataId || !imageKtp || address == "") {
      let item = "";
      !dataId && (item = "Item Reward");
      !address && (item = "Alamat");
      !imageKtp && (item = "Foto KTP");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Mohon lengkapi data ${item}`,
      });
    } else {
      sendData();
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const formData = new FormData();
    formData.append("id", trxId);
    formData.append("rewardId", dataId);
    formData.append("address", address);
    formData.append("imageKtp", imageKtp);

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/trx/reward/${action}`, formData)
      .then((response) => {
        disabledSubmitSet(false);
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            console.log("[REFRESH]");
            dialogFormRef.current.setShow({ show: false, title: "" });
            refreshData();
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
          });
        }
      });
  };

  const renderForm = (
    <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
      <MDBox width="100%" component="form">
        <MDBox mb={2}>
          <MDBox mb={2}>
            <input
              type="file"
              name="imageKtp"
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
              label="Upload Foto KTP"
              onClick={() => {
                imageKtpRef.current.click();
              }}
              readOnly
            />
          </MDBox>
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            fullWidth
            type="text"
            value={address}
            onChange={(e) => addressSet(e.target.value)}
            label="Alamat"
            multiline
            rows={3}
          />
        </MDBox>
      </MDBox>
      <MDBox py={3} width="100%" display="flex" justifyContent={{ md: "flex-end", xs: "center" }}>
        <MDBox mr={1}>
          <MDButton
            variant="gradient"
            color="error"
            onClick={() => {
              dataIdSet(null);
              imageKtpSet(null);
              imageKtpFilenameSet("");
              addressSet("");
              actionSet("create");
              trxIdSet(null);
              imageKtpRef.current.value = "";
              dialogFormRef.current.setShow({ show: false, title: "" });
            }}
          >
            Tutup
          </MDButton>
        </MDBox>
        <MDButton variant="gradient" color="info" disabled={disabledSubmit} onClick={handleSubmit}>
          Submit
        </MDButton>
      </MDBox>
    </Grid>
  );

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const user = secureStorage.getItem("user");
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <DialogForm ref={dialogFormRef} maxWidth="xs">
        {renderForm}
      </DialogForm>
      <MDBox pb={3} my={3}>
        {user && [3, 4].includes(user.roleId) && (
          <MDBox mt={2} mb={3}>
            <Grid container spacing={3}>
              {dataRewards.map((item, idx) => {
                return (
                  <Grid item xs={12} md={6} lg={4} key={idx}>
                    <MDBox mt={3}>
                      <BookingCard
                        id={item.id}
                        image={`${Config.ApiAsset}/reward/${item.image}`}
                        title={item.name}
                        description={item.description}
                        price={`Hadiah Senilai Rp. ${new Intl.NumberFormat("id-ID").format(
                          item.amount
                        )}`}
                        location="indo"
                        requirement={`${item.minFoot} downline masing-masing ${item.point} point`}
                        status={item.status}
                        already={item.already}
                        dialogForm={dialogFormRef}
                        getId={setId}
                      />
                    </MDBox>
                  </Grid>
                );
              })}
            </Grid>
          </MDBox>
        )}
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Transaksi Reward
            </MDTypography>
          </MDBox>

          <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
            <Grid container spacing={3}>
              {user && [1, 2].includes(user.roleId) && (
                <>
                  <Grid item xs={12} md={2} lg={2}>
                    <MDInput
                      label="Search..."
                      size="small"
                      fullWidth
                      value={keyword}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          loadData({
                            currentPage: 1,
                            startDate,
                            endDate,
                            keyword: e.target.value,
                            statusId: status ? status.id : null,
                            rewardId: reward ? reward.id : null,
                          });
                        }
                      }}
                      onChange={(e) => keywordSet(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} lg={2}>
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
                          rewardId: reward ? reward.id : null,
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
                  <Grid item xs={12} md={2} lg={2}>
                    <Autocomplete
                      value={reward}
                      options={rewards}
                      onChange={(e, value) => {
                        rewardSet(value);
                        loadData({
                          keyword,
                          currentPage: 1,
                          startDate,
                          endDate,
                          statusId: status ? status.id : null,
                          rewardId: value ? value.id : null,
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
                          label="Pilih Reward"
                          {...params}
                        />
                      )}
                    />
                  </Grid>
                  {/* Start Date */}
                  <Grid item xs={12} md={2} lg={2}>
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
                  <Grid item xs={12} md={2} lg={2}>
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
                          rewardId: reward ? reward.id : null,
                        });
                      }}
                      iconOnly
                    >
                      <Icon>search</Icon>
                    </MDButton>
                  </Grid>
                </>
              )}
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
                  rowsPerPage: value,
                  currentPage: 1,
                  keyword,
                  startDate,
                  endDate,
                  statusId: status ? status.id : null,
                  rewardId: reward ? reward.id : null,
                });
              }}
              onChangePage={(current) => {
                if (current !== currentPage) {
                  currentPageSet(current);
                  loadData({
                    rowsPerPage,
                    currentPage: current,
                    keyword,
                    startDate,
                    endDate,
                    statusId: status ? status.id : null,
                    rewardId: reward ? reward.id : null,
                  });
                }
              }}
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default TrxReward;
