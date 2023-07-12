/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import MDButton from "components/MDButton";

function ButtonBack({ label, color, ref }) {
  const navigate = useNavigate();

  return (
    <MDButton ref={ref} variant="gradient" color={color} onClick={() => navigate(-1)}>
      {label}
    </MDButton>
  );
}

ButtonBack.defaultProps = {
  color: "error",
};

ButtonBack.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  ref: PropTypes.any,
};

export default ButtonBack;
