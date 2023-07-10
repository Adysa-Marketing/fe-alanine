/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import MDBox from "components/MDBox";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class Notif extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      color: props.color,
      message: props.message,
    };
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ show: false });
  };

  setShow(data) {
    this.setState({
      ...data,
      // show, color, message
    });
  }

  render() {
    return (
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={this.state.show} autoHideDuration={3500} onClose={this.handleClose}>
          <Alert
            onClose={this.handleClose}
            severity={this.state.color}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <MDTypography variant="body2" color="white" fontWeight="regular">
              {this.state.message}
            </MDTypography>
            {this.props.onAction && (
              <MDBox ml={2}>
                <MDButton
                  variant="gradient"
                  color="info"
                  size="small"
                  onClick={this.props.onAction}
                >
                  Update
                </MDButton>
              </MDBox>
            )}
          </Alert>
        </Snackbar>
      </Stack>
    );
  }
}

Notif.defaultProps = {
  message: "",
  show: false,
  color: "warning",
};

Notif.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool,
  color: PropTypes.oneOf(["warning", "error", "info", "success"]),
  onAction: PropTypes.func,
};

export default Notif;
