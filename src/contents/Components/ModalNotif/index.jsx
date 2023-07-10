/* eslint-disable react/prop-types */
import React from "react";

import PropTypes from "prop-types";

import Zoom from "@mui/material/Zoom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Divider from "@mui/material/Divider";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

/**
 * Transition for Modal
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

class ModalNotif extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      onClose: props.onClose ? props.onClick : null,
    };

    this.setShow = this.setShow.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);

    this.btnRef = React.createRef();
  }

  componentDidMount() {
    // setTimeout(() => {
    // 	console.log(this.btnRef.current)
    // 	this.btnRef.current.focus()
    // }, 1000)
    document.addEventListener("keydown", this._handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown, false);
  }

  _handleKeyDown(e) {
    // console.log(e.key)
    // console.log(e.altKey)
    // console.log(e.keyCode)
    if (e.key === "Escape" || e.keyCode === 27) this.setState({ showModal: false });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
    this.state.onClose && this.state.onClose();
  }

  setShow(data) {
    // console.log({ data })
    this.setState({
      showModal: true,
      bgColor: data.color,
      modalTitle: data.modalTitle,
      modalMessage: data.modalMessage,
      onClose: data.onClose,
    });
  }

  render() {
    return (
      <Dialog
        // keepMounted
        open={this.state.showModal}
        TransitionComponent={Transition}
      >
        <DialogTitle id="alert-dialog-title">
          <MDBox component="div">
            <MDTypography
              variant="h5"
              fontWeight="medium"
              textTransform="uppercase"
              sx={{
                color: "#000 !important",
              }}
            >
              {this.state.modalTitle}
            </MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          <MDBox component="div">
            <MDTypography fontWeight="regular" variant="button" sx={{ color: "#000 !important" }}>
              {this.state.modalMessage}
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton ref={this.btnRef} size="small" onClick={this.toggleModal} color="success">
            OK
          </MDButton>
        </DialogActions>
      </Dialog>
    );
  }
}

ModalNotif.defaultProps = {
  showModal: false,
  modalTitle: "",
  modalMessage: "",
  bgColor: "",
};

ModalNotif.propTypes = {
  showModal: PropTypes.bool,
  modalTitle: PropTypes.string,
  modalMessage: PropTypes.string,
  bgColor: PropTypes.string,
  onClose: PropTypes.func,
};

export default ModalNotif;
