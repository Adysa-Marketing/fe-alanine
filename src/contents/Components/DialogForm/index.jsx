/* eslint-disable react/prop-types */
import React from "react";

import PropTypes from "prop-types";

import Zoom from "@mui/material/Zoom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

/**
 * Transition for Modal
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

class DialogForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      onClose: props.onClose ? props.onClick : null,
      title: "",
    };

    this.setShow = this.setShow.bind(this);
  }

  toggleDialog = () => this.setShow(!this.state.show);

  setShow(data) {
    this.setState({
      show: data.show,
      title: data.title,
      onClose: data.onClose,
    });
  }

  render() {
    return (
      <Dialog
        keepMounted
        fullWidth={this.props.fullWidth}
        maxWidth={this.props.maxWidth}
        open={this.state.show}
        onClose={() => this.setState({ show: false })}
        TransitionComponent={Transition}
      >
        <DialogTitle id="alert-dialog-title" sx={{ justifyContent: "center" }}>
          {this.state.title}
        </DialogTitle>
        <DialogContent>{this.props.children}</DialogContent>
      </Dialog>
    );
  }
}

DialogForm.defaultProps = {
  show: false,
  fullWidth: true,
  maxWidth: "md",
};

DialogForm.propTypes = {
  show: PropTypes.bool,
  maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  fullWidth: PropTypes.bool,
  children: PropTypes.node,
  onClose: PropTypes.func,
};

export default DialogForm;
