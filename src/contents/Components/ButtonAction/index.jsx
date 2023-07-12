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

import useAxios from "libs/useAxios";
import Config from "config";

import Confirm from "contents/Components/Confirm";
import ModalNotif from "contents/Components/ModalNotif";
import DialogForm from "contents/Components/DialogForm";

function ButtonAction({ id, urlKey, refreshData, changePassword, changeStatus, statusId }) {
  const confirmRef = useRef();
  const modalNotifRef = useRef();
  const dialogFormRef = useRef();

  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [password, passwordSet] = useState("");
  const [repassword, repasswordSet] = useState("");
  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const handleEdit = () => {
    closeMenu();
    navigate(`${urlKey}/edit/${id}`);
  };

  const handleDetail = () => {
    closeMenu();
    navigate(`${urlKey}/detail/${id}`);
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
              ? error.response.data?.message.length
                ? error.response.data.message[0].message
                : error.response.data?.message
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
          if (err.response.data) {
            modalNotifRef.current.setShow({
              modalTitle: "Gagal",
              modalMessage: err.response.data
                ? err.response.data?.message.length
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

  const submitStatus = () => {
    useAxios()
      .put(`${Config.ApiUrl}/api/v1/${urlKey}/change-status`, {
        id,
        statusId: statusId == 1 ? 2 : 1,
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
            modalMessage: err.response ? err.response.message : "Terjadi kesalahan pada system",
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

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={handleDetail}>Detail</MenuItem>
      <MenuItem onClick={handleEdit}>Edit</MenuItem>
      <MenuItem onClick={handleDelete}>Hapus</MenuItem>
      {changePassword && <MenuItem onClick={handlePassword}>Ganti Password</MenuItem>}
      {changeStatus &&
        ((statusId == 1 && <MenuItem onClick={() => handleStatus(2)}>Disable</MenuItem>) ||
          (statusId == 2 && <MenuItem onClick={() => handleStatus(1)}>Activate</MenuItem>))}
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

      <MDButton variant="contained" color="info" size="small" onClick={openMenu}>
        actions&nbsp;
        <Icon>keyboard_arrow_down</Icon>
      </MDButton>
      {renderMenu}
    </MDBox>
  );
}

ButtonAction.defaultProps = {
  changeStatus: false,
  changePassword: false,
};

ButtonAction.propTypes = {
  id: PropTypes.number,
  urlKey: PropTypes.string,
  refreshData: PropTypes.func,
  changePassword: PropTypes.bool,
  changeStatus: PropTypes.bool,
  statusId: PropTypes.number,
};

export default ButtonAction;
