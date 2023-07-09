/* eslint-disable react/prop-types */
import React from "react";

import PropTypes from "prop-types";

import Zoom from "@mui/material/Zoom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

/**
 * Transition for Modal
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      title: "",
      message: "",
      onAction: props.onAction ? props.onAction : null,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.setShow = this.setShow.bind(this);
  }

  toggleModal() {
    this.setState({ show: !this.state.show });
  }

  setShow(data) {
    // console.log({ data })
    this.setState({
      show: true,
      title: data.title,
      message: data.message,
      onAction: data.onAction ? data.onAction : null,
    });
  }

  render() {
    return (
      <Dialog keepMounted open={this.state.show} TransitionComponent={Transition}>
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
              {this.state.title}
            </MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          <MDBox component="div">
            <MDTypography fontWeight="regular" variant="button" sx={{ color: "#000 !important" }}>
              {this.state.message}
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton autoFocus onClick={this.toggleModal}>
            TIDAK
          </MDButton>
          <MDButton
            size="small"
            onClick={() => {
              this.setState({ show: false });
              this.state.onAction();
            }}
            color="success"
          >
            YA
          </MDButton>
        </DialogActions>
      </Dialog>
    );
  }
}

Confirm.defaultProps = {
  show: false,
  title: "",
  message: "",
};

Confirm.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onAction: PropTypes.func,
};

export default Confirm;
