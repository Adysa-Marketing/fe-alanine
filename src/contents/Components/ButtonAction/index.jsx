import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Autocomplete from "@mui/material/Autocomplete";

import useAxios from "libs/useAxios";
import Config from "config";

import Confirm from "contents/Components/Confirm";
import ModalNotif from "contents/Components/ModalNotif";
import DialogForm from "contents/Components/DialogForm";

import MDTypography from "components/MDTypography";

function ButtonAction({
  id,
  urlKey,
  refreshData,
  detail,
  detailAgen,
  userId,
  edit,
  remove,
  changePassword,
  changeStatus,
  statusId,
  cancel,
  reject,
  approve,
  deliver,
  approveStokis,
  stokisData,
  disable,
  activate,
  cancelTrx,
  rejectTrx,
  rejectTrxStokisReward,
  processTrx,
  transferedTrx,
  editTrxRw,
  setIdTrxRw,
  changeAccountLevel,
  oldLevelData,
  injectSaldo,
}) {
  const confirmRef = useRef();
  const modalNotifRef = useRef();
  const dialogFormRef = useRef();
  const dialogTrfRef = useRef();
  const dialogRejectTfRef = useRef();
  const dialogRejectTrxStokisRewardRef = useRef();
  const dialogDeliverRef = useRef();
  const imageRef = useRef();
  const accountLevelFormRef = useRef();
  const injectSaldoFormRef = useRef();

  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [password, passwordSet] = useState("");
  const [repassword, repasswordSet] = useState("");
  const [courier, courierSet] = useState("");
  const [noResi, noResiSet] = useState("");
  const [image, imageSet] = useState(null);
  const [imageFilename, imageFilenameSet] = useState("");
  const [remark, remarkSet] = useState("");
  const [alertInfo, alertInfoSet] = useState("");
  const [disabledSubmit, disabledSubmitSet] = useState(false);
  const [accountLevel, accountLevelSet] = useState({ id: 1, label: "SILVER" });
  const [accountLevels, accountLevelsSet] = useState([]);
  const [saldoAmount, saldoAmountSet] = useState(0);

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const handleEdit = () => {
    closeMenu();
    navigate(`/${urlKey}/edit/${id}`);
  };

  const handleDetail = () => {
    closeMenu();
    navigate(`/${urlKey}/detail/${id}`);
  };

  const handleDetailAgen = () => {
    closeMenu();
    navigate(`/${urlKey}/detail/${userId}`);
  };

  const handleDelete = () => {
    closeMenu();
    console.log("[DELETE]");
    confirmRef.current.setShow({
      title: "Konfirmasi",
      message: "Apakah anda yang ini menghapus data ini ?",
      onAction: () => {
        sumbitDel();
      },
    });
  };

  const sumbitDel = () => {
    useAxios()
      .delete(`${Config.ApiUrl}/api/v1/${urlKey}/delete`, { data: { id } })
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            console.log("[REFRESH]");
            refreshData();
          },
        });
      })
      .catch((error) => {
        if (error.response.data) {
          modalNotifRef.current.setShow({
            modalMessage: error.response.data
              ? error.response.data?.message
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

  const handlePassword = () => {
    closeMenu();
    dialogFormRef.current.setShow({ show: true, title: "Reset Password" });
  };

  const handleChangePassword = () => {
    if (password !== repassword) {
      modalNotifRef.current.setShow({
        modalTitle: "Peringatan",
        modalMessage: "Konfirmasi password tidak sama",
      });
    } else if (password.length < 5) {
      modalNotifRef.current.setShow({
        modalTitle: "Peringatan",
        modalMessage: "Password minimal 5 karakter",
      });
    } else {
      disabledSubmitSet(true);
      useAxios()
        .put(`${Config.ApiUrl}/api/v1/${urlKey}/change-pass`, {
          id,
          password,
        })
        .then((response) => {
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              console.log("[REFRESH]");
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
                ? Array.isArray(err.response.data?.message)
                  ? err.response.data.message[0].message
                  : err.response.data?.message
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
    }
  };

  const handleStatus = (status) => {
    closeMenu();
    confirmRef.current.setShow({
      title: "Konfirmasi",
      message: "Apakah anda yakin ingin merubah status data ?",
      onAction: () => {
        submitStatus(status);
      },
    });
  };

  const submitStatus = (status) => {
    useAxios()
      .put(`${Config.ApiUrl}/api/v1/${urlKey}/change-status`, {
        id,
        statusId: status,
      })
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            console.log("[REFRESH]");
            refreshData();
          },
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? Array.isArray(err.response.data.message)
                ? err.response.data.message[0].message
                : err.response.data.message
              : "Terjadi kesalahan pada system",
            color: "warning",
          });
        }
        // eslint-disable-next-line no-empty
        else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
          });
        }
      });
  };

  // deliver
  const handleDeliver = () => {
    closeMenu();
    dialogDeliverRef.current.setShow({ show: true, title: "Masukan Resi Pengiriman" });
  };

  const submitDeliver = () => {
    if (courier == "" || noResi == "") {
      modalNotifRef.current.setShow({
        modalTitle: "Peringatan",
        modalMessage: "Input data tidak lengkap",
      });
    } else {
      disabledSubmitSet(false);
      useAxios()
        .put(`${Config.ApiUrl}/api/v1/${urlKey}/change-status`, {
          id,
          statusId: 5,
          remark: `${courier} - ${noResi}`,
        })
        .then((response) => {
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              console.log("[REFRESH]");
              refreshData();
            },
          });
        })
        .catch((err) => {
          disabledSubmitSet(false);
          console.log(err);
          if (err.response) {
            modalNotifRef.current.setShow({
              modalTitle: "Gagal",
              modalMessage: err.response.data
                ? Array.isArray(err.response.data.message)
                  ? err.response.data.message[0].message
                  : err.response.data.message
                : "Terjadi kesalahan pada system",
              color: "warning",
            });
          }
          // eslint-disable-next-line no-empty
          else {
            modalNotifRef.current.setShow({
              modalTitle: "Gagal",
              modalMessage: "Koneksi jaringan terputus",
            });
          }
        });
    }
  };

  // approve stokis
  const handleAprStk = () => {
    closeMenu();
    confirmRef.current.setShow({
      title: "Konfirmasi",
      message: "Approve dan buat agen baru ?",
      onAction: () => {
        submitAgen();
      },
    });
  };

  const submitAgen = () => {
    useAxios()
      .post(`${Config.ApiUrl}/api/v1/manage/agen/create`, stokisData)
      .then(async (response) => {
        try {
          await useAxios().put(`${Config.ApiUrl}/api/v1/trx/stokis/change-status`, {
            id,
            statusId: 4,
          });

          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: `${response.data.message} - Lakukan Aktivasi Agen`,
            onClose: () => {
              console.log("[CREATE-AGEN]");
              navigate("/manage/agen");
            },
          });
        } catch (err) {
          console.log(err);
          if (err.response) {
            modalNotifRef.current.setShow({
              modalTitle: "Gagal",
              modalMessage: err.response.data
                ? Array.isArray(err.response.data.message)
                  ? err.response.data.message[0].message
                  : err.response.data.message
                : "Terjadi kesalahan pada system",
              color: "warning",
            });
          }
          // eslint-disable-next-line no-empty
          else {
            modalNotifRef.current.setShow({
              modalTitle: "Gagal",
              modalMessage: "Koneksi jaringan terputus",
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? Array.isArray(err.response.data.message)
                ? err.response.data.message[0].message
                : err.response.data.message
              : "Terjadi kesalahan pada system",
            color: "warning",
          });
        }
        // eslint-disable-next-line no-empty
        else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
          });
        }
      });
  };

  // Trx
  const handleStatusTrx = (status) => {
    closeMenu();
    confirmRef.current.setShow({
      title: "Konfirmasi",
      message: "Apakah anda yakin ingin merubah status data ?",
      onAction: () => {
        submitStatusTrx(status);
      },
    });
  };

  const handleTransfer = () => {
    closeMenu();
    dialogTrfRef.current.setShow({ show: true, title: "Upload Bukti Transfer" });
  };

  const submitTransfer = () => {
    submitStatusTrx(5);
  };

  const handleRejectTrx = () => {
    closeMenu();
    dialogRejectTfRef.current.setShow({ show: true, title: "Cantumkan Alasan Reject" });
  };

  const submitReject = () => {
    submitStatusTrx(3);
  };

  const submitStatusTrx = (status) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("statusId", status);
    formData.append("image", image);
    formData.append("remark", remark);

    if ([5].includes(status) && !image) {
      alertInfoSet("Tolong Upload Bukti Transfer");
    } else if ([3].includes(status) && remark == "") {
      alertInfoSet("Tolong Tulis Alasan Reject");
    } else {
      disabledSubmitSet(true);
      useAxios()
        .put(`${Config.ApiUrl}/api/v1/${urlKey}/change-status`, formData)
        .then((response) => {
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              console.log("[REFRESH]");
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
    }
  };

  // trx rw
  const handleEditTrxRw = () => {
    closeMenu();
    setIdTrxRw(id);
  };

  // reject stokis & reward
  const handleRejectTrxStokisReward = () => {
    closeMenu();
    dialogRejectTrxStokisRewardRef.current.setShow({
      show: true,
      title: "Cantumkan Alasan Reject",
    });
  };

  const submitRejectTrxStokisReward = () => {
    const payload = {
      id,
      statusId: 3,
      remark: remark,
    };
    if (remark == "") {
      alertInfoSet("Tolong Tulis Alasan Reject");
    } else {
      disabledSubmitSet(true);
      useAxios()
        .put(`${Config.ApiUrl}/api/v1/${urlKey}/change-status`, payload)
        .then((response) => {
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              console.log("[REFRESH]");
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
    }
  };

  // change account level of member or agen
  const handleAccountLevel = () => {
    closeMenu();
    loadAccountLevel();
    accountLevelSet(oldLevelData);
    accountLevelFormRef.current.setShow({ show: true, title: "Ubah Level Akun" });
  };

  const loadAccountLevel = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/dropdown/account-level`)
      .then((response) => {
        let data = response.data.data;
        data = data.map((item) => ({ id: item.id, label: item.name }));
        accountLevelsSet(data);
      })
      .catch((err) => console.log("[!] Error :", err));
  };

  const handleChangeAccountLevel = () => {
    if (!accountLevel.id) {
      modalNotifRef.current.setShow({
        modalTitle: "Peringatan",
        modalMessage: "Level Akun belum dipilih",
      });
    } else {
      disabledSubmitSet(true);
      useAxios()
        .put(`${Config.ApiUrl}/api/v1/${urlKey}/change-level`, {
          id,
          accountLevelId: parseInt(accountLevel.id),
        })
        .then((response) => {
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              console.log("[REFRESH]");
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
                ? Array.isArray(err.response.data?.message)
                  ? err.response.data.message[0].message
                  : err.response.data?.message
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
    }
  };

  // Inject saldo manual for member / agen
  const handleInjectSaldo = () => {
    injectSaldoFormRef.current.setShow({ show: true, title: "Tambahkan Saldo Akun" });
  };

  const handleSubmitInjectSaldo = () => {
    if (saldoAmount < 1) {
      modalNotifRef.current.setShow({
        modalTitle: "Peringatan",
        modalMessage: "Penambahan saldo minimal Rp.1",
      });
    } else {
      disabledSubmitSet(true);
      useAxios()
        .post(`${Config.ApiUrl}/api/v1/${urlKey}/inject-saldo`, {
          id,
          amount: parseInt(saldoAmount),
        })
        .then((response) => {
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              console.log("[REFRESH]");
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
                ? Array.isArray(err.response.data?.message)
                  ? err.response.data.message[0].message
                  : err.response.data?.message
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
    }
  };

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      {detail && <MenuItem onClick={handleDetail}>Detail</MenuItem>}
      {detailAgen && <MenuItem onClick={handleDetailAgen}>Detail</MenuItem>}
      {edit && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
      {remove && <MenuItem onClick={handleDelete}>Hapus</MenuItem>}
      {changePassword && <MenuItem onClick={handlePassword}>Ganti Password</MenuItem>}
      {changeStatus &&
        ((statusId == 1 && <MenuItem onClick={() => handleStatus(2)}>Disable</MenuItem>) ||
          (statusId == 2 && <MenuItem onClick={() => handleStatus(1)}>Activate</MenuItem>))}
      {cancel && statusId == 1 && <MenuItem onClick={() => handleStatus(2)}>Batalkan</MenuItem>}
      {reject && statusId == 1 && <MenuItem onClick={() => handleStatus(3)}>Tolak</MenuItem>}
      {approve && statusId == 1 && <MenuItem onClick={() => handleStatus(4)}>Approved</MenuItem>}
      {deliver && statusId == 4 && <MenuItem onClick={() => handleDeliver()}>Delivered</MenuItem>}

      {approveStokis && statusId == 1 && (
        <MenuItem onClick={() => handleAprStk()}>Approved</MenuItem>
      )}

      {/* activate / disable */}
      {disable && [1, 4].includes(statusId) && (
        <MenuItem onClick={() => handleStatus(2)}>Disable</MenuItem>
      )}
      {activate && [1, 2].includes(statusId) && (
        <MenuItem onClick={() => handleStatus(4)}>Activate</MenuItem>
      )}

      {/* trx with formData */}
      {cancelTrx && statusId == 1 && (
        <MenuItem onClick={() => handleStatusTrx(2)}>Batalkan</MenuItem>
      )}
      {rejectTrx && statusId == 1 && <MenuItem onClick={() => handleRejectTrx()}>Tolak</MenuItem>}
      {processTrx && statusId == 1 && (
        <MenuItem onClick={() => handleStatusTrx(4)}>Proses</MenuItem>
      )}
      {transferedTrx && statusId == 4 && (
        <MenuItem onClick={() => handleTransfer(5)}>Di Transfer</MenuItem>
      )}

      {/* trx reward */}
      {editTrxRw && [1].includes(statusId) && <MenuItem onClick={handleEditTrxRw}>Edit</MenuItem>}

      {/* trx stokis */}
      {rejectTrxStokisReward && statusId == 1 && (
        <MenuItem onClick={() => handleRejectTrxStokisReward()}>Tolak</MenuItem>
      )}

      {/* change acccount level */}
      {changeAccountLevel && <MenuItem onClick={handleAccountLevel}>Ubah Level Akun</MenuItem>}

      {/* inject saldo member / agen */}
      {injectSaldo && <MenuItem onClick={handleInjectSaldo}>Tambah Saldo Manual</MenuItem>}
    </Menu>
  );

  return (
    <MDBox display="flex">
      <Confirm ref={confirmRef} />
      <ModalNotif ref={modalNotifRef} />

      <DialogForm ref={dialogFormRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
          <MDBox width="100%" component="form">
            <MDBox mb={2}>
              <MDInput
                fullWidth
                type="password"
                value={password}
                onChange={(e) => passwordSet(e.target.value)}
                label="Password"
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                fullWidth
                type="password"
                value={repassword}
                onChange={(e) => repasswordSet(e.target.value)}
                label="Komfirmasi Password"
              />
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => dialogFormRef.current.setShow({ show: false, title: "" })}
              >
                Tutup
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={disabledSubmit}
              onClick={handleChangePassword}
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      <DialogForm ref={dialogDeliverRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
          <MDBox width="100%" component="form">
            <MDBox mb={2}>
              <MDInput
                fullWidth
                type="text"
                value={courier}
                onChange={(e) => courierSet(e.target.value)}
                label="Ekspedisi Pengiriman"
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                fullWidth
                type="text"
                value={noResi}
                onChange={(e) => noResiSet(e.target.value)}
                label="No Resi Pengiriman"
              />
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => dialogDeliverRef.current.setShow({ show: false, title: "" })}
              >
                Tutup
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={disabledSubmit}
              onClick={submitDeliver}
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      <DialogForm ref={dialogTrfRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
          <MDBox width="100%" component="form">
            <MDBox mb={2}>
              <input
                type="file"
                name="image"
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
                label="Upload Bukti Transfer"
                onClick={() => {
                  imageRef.current.click();
                }}
                readOnly
              />
              {alertInfo !== "" && (
                <MDTypography variant="caption" color="error" fontWeight="bold">
                  {alertInfo}
                </MDTypography>
              )}
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => {
                  dialogTrfRef.current.setShow({ show: false, title: "" });
                  imageSet(null);
                  imageFilenameSet("");
                  alertInfoSet("");
                }}
              >
                Tutup
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={disabledSubmit}
              onClick={submitTransfer}
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      <DialogForm ref={dialogRejectTfRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
          <MDBox width="100%" component="form">
            <MDBox mb={2}>
              <MDInput
                fullWidth
                value={remark}
                label="Alasan Ditolak"
                onChange={(e) => remarkSet(e.target.value)}
                multiline
                rows={3}
              />
              {alertInfo !== "" && (
                <MDTypography variant="caption" color="error" fontWeight="bold">
                  {alertInfo}
                </MDTypography>
              )}
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => {
                  dialogRejectTfRef.current.setShow({ show: false, title: "" });
                  remarkSet("");
                  alertInfoSet("");
                }}
              >
                Tutup
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={disabledSubmit}
              onClick={submitReject}
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      <DialogForm ref={dialogRejectTrxStokisRewardRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
          <MDBox width="100%" component="form">
            <MDBox mb={2}>
              <MDInput
                fullWidth
                value={remark}
                label="Alasan Ditolak"
                onChange={(e) => remarkSet(e.target.value)}
                multiline
                rows={3}
              />
              {alertInfo !== "" && (
                <MDTypography variant="caption" color="error" fontWeight="bold">
                  {alertInfo}
                </MDTypography>
              )}
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => {
                  dialogRejectTrxStokisRewardRef.current.setShow({ show: false, title: "" });
                  remarkSet("");
                  alertInfoSet("");
                }}
              >
                Tutup
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={disabledSubmit}
              onClick={submitRejectTrxStokisReward}
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      <DialogForm ref={accountLevelFormRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
          <MDBox width="100%" component="form">
            <MDBox mb={2}>
              <Autocomplete
                options={accountLevels}
                value={accountLevel}
                onChange={(e, value) => {
                  accountLevelSet(value);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                fullWidth
                renderInput={(params) => <MDInput {...params} label="Level Akun" />}
              />
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => accountLevelFormRef.current.setShow({ show: false, title: "" })}
              >
                Tutup
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={disabledSubmit}
              onClick={handleChangeAccountLevel}
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      {/* INJECT SALDO MEMBER / AGEN */}
      <DialogForm ref={injectSaldoFormRef} maxWidth="xs">
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
          <MDBox width="100%" component="form">
            <MDBox mb={2}>
              <MDInput
                fullWidth
                value={saldoAmount}
                label="Total Saldo Ditambahkan"
                onChange={(e) => saldoAmountSet(e.target.value)}
              />
              {alertInfo !== "" && (
                <MDTypography variant="caption" color="error" fontWeight="bold">
                  {alertInfo}
                </MDTypography>
              )}
            </MDBox>
          </MDBox>
          <MDBox
            py={3}
            width="100%"
            display="flex"
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <MDBox mr={1}>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => {
                  injectSaldoFormRef.current.setShow({ show: false, title: "" });
                  remarkSet("");
                  alertInfoSet("");
                }}
              >
                Tutup
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              disabled={disabledSubmit}
              onClick={handleSubmitInjectSaldo}
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </DialogForm>

      <MDButton variant="contained" color="info" size="small" onClick={openMenu}>
        actions&nbsp;
        <Icon>keyboard_arrow_down</Icon>
      </MDButton>
      {renderMenu}
    </MDBox>
  );
}

ButtonAction.defaultProps = {
  detail: false,
  edit: false,
  remove: false,
  changeStatus: false,
  changePassword: false,
  cancel: false,
  reject: false,
  approve: false,
  deliver: false,
  approveStokis: false,
  stokisData: {
    stokisId: null,
    userId: null,
  },
  disable: false,
  activate: false,
  cancelTrx: false,
  rejectTrx: false,
  processTrx: false,
  transferedTrx: false,
  editTrxRw: false,
  changeAccountLevel: false,
  levelData: { id: 1, label: "SILVER" },
  injectSaldo: false,
};

ButtonAction.propTypes = {
  id: PropTypes.number,
  urlKey: PropTypes.string,
  refreshData: PropTypes.func,
  detail: PropTypes.bool,
  detailAgen: PropTypes.bool,
  userId: PropTypes.number,
  edit: PropTypes.bool,
  remove: PropTypes.bool,
  changePassword: PropTypes.bool,
  changeStatus: PropTypes.bool,
  statusId: PropTypes.number,
  cancel: PropTypes.bool,
  reject: PropTypes.bool,
  approve: PropTypes.bool,
  deliver: PropTypes.bool,
  approveStokis: PropTypes.bool,
  stokisData: PropTypes.object,
  disable: PropTypes.bool,
  activate: PropTypes.bool,
  cancelTrx: PropTypes.bool,
  rejectTrx: PropTypes.bool,
  rejectTrxStokisReward: PropTypes.bool,
  processTrx: PropTypes.bool,
  transferedTrx: PropTypes.bool,
  editTrxRw: PropTypes.bool,
  setIdTrxRw: PropTypes.func,
  changeAccountLevel: PropTypes.bool,
  oldLevelData: PropTypes.object, // data level lama
  injectSaldo: PropTypes.bool,
};

export default ButtonAction;
