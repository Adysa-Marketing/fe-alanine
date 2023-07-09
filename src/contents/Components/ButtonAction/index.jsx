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

function ButtonAction({ id, urlKey, refreshData }) {
  const confirmRef = useRef();
  const modalNotifRef = useRef();

  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const handleEdit = () => {
    closeMenu();
    navigate(`${urlKey}/edit/${id}`);
    // navigate(`/inventory/${urlKey}/edit/${id}`);
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
      .post(`${Config.ApiUrl}${urlKey}/delete`, { id })
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data,
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

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={handleEdit}>Edit</MenuItem>
      <MenuItem onClick={handleDelete}>Hapus</MenuItem>
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

ButtonAction.propTypes = {
  id: PropTypes.number,
  urlKey: PropTypes.string,
  refreshData: PropTypes.func,
};

export default ButtonAction;
