import React from "react";
import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";

function MiniFormCard({ children, ...rest }) {
  return (
    <MDBox my={3} mx="auto" width="100%" height="100vh" pb={3} {...rest}>
      <Grid container spacing={1} justifyContent="center" alignItems="flex-start" height="100%">
        <Grid item xs={11} sm={9} md={6} lg={5} xl={5} xxl={6}>
          <Card>{children}</Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}

MiniFormCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MiniFormCard;
