import { useEffect, useRef, useState } from "react";
import { Navigate, Link, useParams } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import MDDatePicker from "components/MDDatePicker";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import useAxios from "libs/useAxios";
import Config from "config";
import ModalNotif from "contents/Components/ModalNotif";
import { Table, TableBody, TableRow } from "@mui/material";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import ButtonBack from "contents/Components/ButtonBack";

function DetailWidhraw() {
  const [amount, amountSet] = useState(0);
  const [paidAmount, paidAmountSet] = useState(0);
  const [noRekening, noRekeningSet] = useState("");
  const [kk, kkSet] = useState("");
  const [accountName, accountNameSet] = useState("");
  const [bankName, bankNameSet] = useState("");
  const [imageKtp, imageKtpSet] = useState(null);
  const [image, imageSet] = useState(null);
  const [wdStatus, wdStatusSet] = useState({});
  const [redirect, redirectSet] = useState(null);

  const modalNotifRef = useRef();

  const params = useParams();

  useEffect(() => {
    loadDetail(params.id);
  }, []);

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/widhraw/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        amountSet(data.amount);
        paidAmountSet(data.paidAmount);
        noRekeningSet(data.noRekening);
        accountNameSet(data.accountName);
        kkSet(data.kk);
        bankNameSet(data.bankName);
        imageKtpSet(data.imageKtp);
        imageSet(data.image);
        wdStatusSet(data.WdStatus);
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/trx/widhraw");
          },
        });
      });
  };

  if (redirect) {
    <Navigate to={redirect} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MDBox pt={3} pb={2} display="flex">
        <MDBox mr={1}>
          <ButtonBack label={"KEMBALI"} />
        </MDBox>
      </MDBox>
      <Card sx={{ overflow: "visible" }}>
        <MDBox p={3}>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox width="100%" display="flex" justifyContent="center">
                <MDTypography variant="h5" textTransform="capitalize" fontWeight="medium">
                  DETAIL WIDHRAW
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Table>
                <TableBody>
                  {/* Account Name */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Nama :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{accountName}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Bank */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Bank :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{bankName}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Rekening */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        No Rekening :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{noRekening}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* NIK */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        No NIK :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{kk}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Status */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Status :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDBadge
                        variant="contained"
                        badgeContent={wdStatus.name}
                        size="lg"
                        color={
                          wdStatus.id === 1
                            ? "secondary"
                            : wdStatus.id === 2
                            ? "error"
                            : wdStatus.id === 3
                            ? "warning"
                            : wdStatus.id === 4
                            ? "info"
                            : "success"
                        }
                      />
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Amount */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Total Widhraw :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(amount)}
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Paid Amount */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Total Dibayar
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        {paidAmount
                          ? "Rp." + new Intl.NumberFormat("id-ID").format(paidAmount)
                          : "-"}
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox
                position="relative"
                borderRadius="lg"
                mx={2}
                className="card-header"
                sx={{ transition: "transform 300ms cubic-bezier(0.34, 1.61, 0.7, 1)" }}
              >
                <MDTypography variant="body">Foto KTP</MDTypography>
                <br></br>
                {imageKtp && (
                  <MDBox
                    component="img"
                    src={`${Config.ApiAsset}/trx/widhraw/${imageKtp}`}
                    alt="Bukti Transfer"
                    borderRadius="lg"
                    shadow="sm"
                    width="100%"
                    height="100%"
                    position="relative"
                    zIndex={10}
                    mb={2}
                  />
                )}
              </MDBox>
              <MDBox
                position="relative"
                borderRadius="lg"
                mx={2}
                className="card-header"
                sx={{ transition: "transform 300ms cubic-bezier(0.34, 1.61, 0.7, 1)" }}
              >
                <MDTypography variant="body">Struk Pembayaran</MDTypography>
                <br></br>
                {image && (
                  <MDBox
                    component="img"
                    src={`${Config.ApiAsset}/trx/widhraw/${image}`}
                    alt="Bukti Transfer"
                    borderRadius="lg"
                    shadow="sm"
                    width="100%"
                    height="100%"
                    position="relative"
                    zIndex={10}
                    mb={2}
                  />
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default DetailWidhraw;
