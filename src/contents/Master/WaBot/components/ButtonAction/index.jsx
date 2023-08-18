import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import Confirm from "contents/Components/Confirm";
import ModalNotif from "contents/Components/ModalNotif";
import DialogForm from "contents/Components/DialogForm";

function ButtonAction({
  id,
  uniqKey,
  regenerate,
  edit,
  close,
  remove,
  synchron,
  setRegenerate,
  setEdit,
  setClose,
  setRemove,
  setSynchron,
}) {
  const confirmRef = useRef();
  const modalNotifRef = useRef();

  const [menu, setMenu] = useState(null);

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const handleRegenerate = () => {
    closeMenu();
    setRegenerate(uniqKey);
  };

  const handleEdit = () => {
    closeMenu();
    setEdit(id);
  };

  const handleClose = () => {
    closeMenu();
    setClose(uniqKey);
  };

  const handleRemove = () => {
    closeMenu();
    setRemove(id);
  };

  const handleSynchron = () => {
    closeMenu();
    setSynchron(uniqKey);
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
      {regenerate && <MenuItem onClick={() => handleRegenerate()}>Generate QR</MenuItem>}
      {edit && <MenuItem onClick={() => handleEdit()}>Edit</MenuItem>}
      {close && <MenuItem onClick={() => handleClose()}>Tutup</MenuItem>}
      {remove && <MenuItem onClick={() => handleRemove()}>Hapus</MenuItem>}
      {synchron && <MenuItem onClick={() => handleSynchron()}>Synchron</MenuItem>}
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
  id: PropTypes.number.isRequired,
  uniqKey: PropTypes.string.isRequired,
  regenerate: PropTypes.bool,
  edit: PropTypes.bool,
  close: PropTypes.bool,
  remove: PropTypes.bool,
  synchron: PropTypes.bool,
  setRegenerate: PropTypes.func,
  setEdit: PropTypes.func,
  setClose: PropTypes.func,
  setRemove: PropTypes.func,
  setSynchron: PropTypes.func,
};

export default ButtonAction;
