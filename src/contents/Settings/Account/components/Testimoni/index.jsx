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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useEffect, useRef, useState } from "react";
import useAxios from "libs/useAxios";
import Config from "config";
import ModalNotif from "contents/Components/ModalNotif";

function Testimoni() {
  const [state, setState] = useState({
    id: "",
    rating: 0,
    testimonial: "",
    remark: "",

    action: "create",

    error: [],
    success: [],
  });

  const modalNotifRef = useRef();

  useEffect(() => {
    loadTestimoni();
  }, []);

  const loadTestimoni = () => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/setting/testimoni/get`)
      .then((result) => {
        const data = result.data.data;
        if (data) {
          setState((prev) => ({
            ...prev,
            id: data.id,
            action: "update",
            rating: data.rating,
            testimonial: data.testimonial,
            success: {
              ...prev.success,
              rating: data.rating ? true : false,
              testimonial: data.testimonial ? true : false,
            },
          }));
        }
      })
      .catch((error) => console.log(`[!] Error : ${error}`));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        success: { ...prevState.success, [e.target.id]: true },
        error: { ...prevState.error, [e.target.id]: false },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        success: { ...prevState.success, [e.target.id]: false },
        error: { ...prevState.error, [e.target.id]: true },
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = () => {
    if (state.success.rating && state.success.testimonial) {
      if (state.rating < 1 || state.rating > 5) {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: `Rating harus antara 1 - 5`,
        });
      } else {
        sendData();
      }
    } else {
      let input = "";
      !state.success.testimonial && (input = "Testimonial");
      !state.success.rating && (input = "Rating");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Data "${input}" masih kosong, Silahkan di cek kembali !`,
      });
    }
  };

  const sendData = () => {
    const payload = {
      id: state.id,
      rating: parseInt(state.rating),
      testimonial: state.testimonial,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/setting/testimoni/${state.action}`, payload)
      .then((response) => {
        modalNotifRef.current.setShow({
          modalTitle: "Sukses",
          modalMessage: response.data.message,
          onClose: () => {
            loadTestimoni();
          },
        });
      })
      .catch((err) => {
        if (err.response?.data) {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: err.response.data
              ? Array.isArray(err.response.data.message)
                ? err.response.data.message[0].message
                : err.response.data.message
              : "Terjadi kesalahan pada system",
            color: "warning",
          });
        } else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
            color: "warning",
          });
        }
      });
  };

  return (
    <Card id="testimoni">
      <ModalNotif ref={modalNotifRef} />
      <MDBox p={3}>
        <MDTypography variant="h5">Testimonial</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="rating"
              value={state.rating}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              label="Rating ( 1 - 5 )"
              success={state.success ? state.success.rating : false}
              error={state.error ? state.error.rating : false}
              inputProps={{ type: "number", autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              id="testimonial"
              value={state.testimonial}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              label="Testimonial"
              success={state.success ? state.success.testimonial : false}
              error={state.error ? state.error.testimonial : false}
              inputProps={{ type: "text", autoComplete: "" }}
            />
          </Grid>
        </Grid>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap">
          <MDBox ml="auto" mt={3}>
            <MDButton
              variant="gradient"
              color="dark"
              size="small"
              onKeyDown={handleKeyDown}
              onClick={handleSubmit}
            >
              simpan
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Testimoni;
