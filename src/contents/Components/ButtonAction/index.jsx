import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import useAxios from "libs/useAxios";
import Config from "config";

import Confirm from "contents/Components/Confirm";
import ModalNotif from "contents/Components/ModalNotif";

function ButtonAction({ id, urlKey, refreshData, changeStatus, statusId }) {
  const confirmRef = useRef();
  const modalNotifRef = useRef();

  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);

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
      .delete(`${Config.ApiUrl}/api/v1/${urlKey}/delete`, { id })
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
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: "Koneksi jaringan terputus",
        });
      });
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
      {changeStatus && (
        <>
          {statusId == 1 && <MenuItem onClick={() => handleStatus(2)}>Disable</MenuItem>}
          {statusId == 2 && <MenuItem onClick={() => handleStatus(1)}>Activate</MenuItem>}
        </>
      )}
    </Menu>
  );

  return (
    <MDBox display="flex">
      <Confirm ref={confirmRef} />
      <ModalNotif ref={modalNotifRef} />

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
};

ButtonAction.propTypes = {
  id: PropTypes.number,
  urlKey: PropTypes.string,
  refreshData: PropTypes.func,
  changeStatus: PropTypes.bool,
  statusId: PropTypes.number,
};

export default ButtonAction;
