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

function DetailTrxAgenProduct() {
  const [product, productSet] = useState("");
  const [name, nameSet] = useState("");
  const [qty, qtySet] = useState(0);
  const [amount, amountSet] = useState(0);
  const [totalAmount, totalAmountSet] = useState(0);
  const [profit, profitSet] = useState(0);
  const [image, imageSet] = useState(null);
  const [paymentType, paymentTypeSet] = useState("");
  const [status, statusSet] = useState({
    id: 0,
    name: "",
  });

  const [redirect, redirectSet] = useState(null);

  const modalNotifRef = useRef();

  const params = useParams();

  useEffect(() => {
    loadDetail(params.id);
  }, []);

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/product/agen/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        const Status = data.TrStatus;

        productSet(data.Product?.name);
        nameSet(data.name);
        qtySet(data.qty);
        amountSet(data.Product?.amount);
        totalAmountSet(data.amount);
        profitSet(data.profit);
        data.image && imageSet(data.image);
        paymentTypeSet(data.PaymentType?.name);
        statusSet({ id: Status.id, name: Status.name });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/trx/product/agen");
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
                  DETAIL PENJUALAN
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
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {name}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Product */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Produk :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {product}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Harga */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Harga :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(amount)}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* QTY */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Jumlah :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {qty}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Total */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Total :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(totalAmount)}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Total */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Pembayaran :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {paymentType}
                      </p>
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
                        badgeContent={status.name}
                        size="lg"
                        color={
                          status.id === 1 //pending
                            ? "secondary"
                            : status.id === 2 //cancel
                            ? "error"
                            : status.id === 4 //approve
                            ? "success"
                            : "warning"
                        }
                      />
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Profit */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Profit :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(profit)}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              {image && (
                <MDBox
                  position="relative"
                  borderRadius="lg"
                  mx={2}
                  className="card-header"
                  sx={{ transition: "transform 300ms cubic-bezier(0.34, 1.61, 0.7, 1)" }}
                >
                  <MDTypography variant="body">Bukti Pembayaran</MDTypography>
                  <br></br>
                  <MDBox
                    component="img"
                    src={`${Config.ApiAsset}/trx/agen/product/${image}`}
                    alt="Bukti Pembayaran"
                    borderRadius="lg"
                    shadow="sm"
                    width="100%"
                    height="100%"
                    position="relative"
                    zIndex={10}
                    mb={2}
                  />
                </MDBox>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default DetailTrxAgenProduct;
