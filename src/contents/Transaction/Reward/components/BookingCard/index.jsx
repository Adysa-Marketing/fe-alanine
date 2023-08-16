/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function BookingCard({
  id,
  image,
  title,
  description,
  price,
  requirement,
  status,
  already,
  dialogForm,
  getId,
}) {
  const handleForm = () => {
    dialogForm.current.setShow({ show: true, title: "Masukan Alamat Kamu" });
    getId(id);
  };

  return (
    <Card>
      <MDBox
        position="relative"
        borderRadius="lg"
        mt={-3}
        mx={2}
        className="card-header"
        sx={{ transition: "transform 300ms cubic-bezier(0.34, 1.61, 0.7, 1)" }}
      >
        <MDBox
          component="img"
          src={image}
          alt={title}
          borderRadius="lg"
          shadow="md"
          width="100%"
          height="100%"
          position="relative"
          zIndex={1}
        />
        <MDBox
          borderRadius="lg"
          shadow="md"
          width="100%"
          height="100%"
          position="absolute"
          left={0}
          top="0"
          sx={{
            backgroundImage: `url(${image})`,
            transform: "scale(0.94)",
            filter: "blur(12px)",
            backgroundSize: "cover",
          }}
        />
      </MDBox>
      <MDBox textAlign="center" pt={3} px={3}>
        <MDTypography variant="h5" fontWeight="regular" sx={{ mt: 4 }}>
          {title}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {price}
        </MDTypography>
        <MDTypography variant="body2" color="text">
          {description}
        </MDTypography>
      </MDBox>
      <Divider />
      <MDBox textAlign="center" px={3}>
        <MDTypography variant="caption" color="text">
          {requirement}
        </MDTypography>
      </MDBox>
      <MDBox textAlign="center" mt={1} mb={3} px={3}>
        <MDButton
          mt={-3}
          color={already ? "success" : status ? "info" : "error"}
          variant="gradient"
          disabled={status ? false : true}
          onClick={() => handleForm()}
          fullWidth
        >
          {already ? "Sudah Di Klaim" : status ? "Ambil Reward" : "Tidak Memenuhi Syarat"}
        </MDButton>
      </MDBox>
    </Card>
  );
}

// Typechecking props for the BookingCard
BookingCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  requirement: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  already: PropTypes.bool.isRequired,
  dialogForm: PropTypes.func.isRequired,
  getId: PropTypes.func.isRequired,
};

export default BookingCard;
