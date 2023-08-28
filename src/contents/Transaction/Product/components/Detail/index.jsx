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
import moment from "moment";

function DetailTrxProduct() {
  const [amount, amountSet] = useState(0);
  const [discount, discountSet] = useState(0);
  const [paidAmount, paidAmountSet] = useState(0);
  const [qty, qtySet] = useState(1);
  const [image, imageSet] = useState(null);
  const [fromBank, fromBankSet] = useState("");
  const [accountName, accountNameSet] = useState("");
  const [date, dateSet] = useState("");
  const [address, addressSet] = useState("");
  const [remark, remarkSet] = useState(null);
  const [user, userSet] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });
  const [status, statusSet] = useState({
    id: 0,
    name: "",
  });
  const [paymentType, paymentTypeSet] = useState("TRANSFER");
  const [bank, bankSet] = useState({
    name: "",
    noRekening: "",
  });
  const [product, productSet] = useState({
    name: "",
    stock: 1,
    amount: 0,
    discount: 0,
  });
  const [redirect, redirectSet] = useState(null);

  const modalNotifRef = useRef();

  const params = useParams();

  useEffect(() => {
    loadDetail(params.id);
  }, []);

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/product/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        const User = data.User;
        const Status = data.TrStatus;
        const PaymentType = data.PaymentType;
        const Bank = data.Bank;
        const Product = data.Product;

        amountSet(data.amount);
        discountSet(data.discount);
        paidAmountSet(data.paidAmount);
        qtySet(data.qty);
        imageSet(data.image);
        fromBankSet(data.fromBank);
        accountNameSet(data.accountName);
        dateSet(data.date);
        addressSet(data.address);
        data.remark != "" && remarkSet(data.remark);
        userSet({
          name: User.name,
          username: User.username,
          email: User.email,
          phone: User.phone,
        });
        statusSet({
          id: Status.id,
          name: Status.name,
        });
        paymentTypeSet(PaymentType.name);
        bankSet({
          name: Bank.name,
          noRekening: Bank.noRekening,
        });
        productSet({
          name: Product.name,
          stock: Product.stock,
          amount: Product.amount,
        });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/trx/product");
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
                  DETAIL TRANSKASI PRODUK
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
                      <MDTypography variant="body">
                        <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                          {user.name}
                        </p>
                        <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                          {user.username ? `(${user.username})` : ""}
                        </p>
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Phone */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        No Hp :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {user.phone ? user.phone : "-"}
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
                        {product.name}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Product */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Diskon :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(discount / qty)}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Stock */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Stok :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {product.stock}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Harga Satuan */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Harga Satuan :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(product.amount)}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* QTY */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Jumlah Beli :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {qty}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Total Amount */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Total Harga :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(amount)}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Total Discount */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Total Diskon :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(discount)}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Total Bayar */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Total Bayar :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(paidAmount)}
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
                          status.id === 1
                            ? "secondary"
                            : status.id === 2
                            ? "error"
                            : status.id === 3
                            ? "warning"
                            : status.id === 4
                            ? "info"
                            : "success"
                        }
                      />
                    </DataTableBodyCell>
                  </TableRow>
                  {/* payment type */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Pembayaran :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                          {paymentType}
                        </p>
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* bank */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Tujuan :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                          {bank.name} - {bank.noRekening}
                        </p>
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* from bank */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Dari Bank :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                          {fromBank}
                        </p>
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* accountName */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Atas Nama :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                          {accountName}
                        </p>
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* date */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Tanggal :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                          {date && moment(date).format("DD-MM-YYYY HH:mm:ss")}
                        </p>
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* address */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Alamat :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {address}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* courier */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        {status.id == 3 ? "Ditolak : " : "Pengiriman"}
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {remark ? remark : "-"}
                      </p>
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
                <MDTypography variant="body">Bukti Pembayaran</MDTypography>
                <br></br>
                {image && (
                  <MDBox
                    component="img"
                    src={`${Config.ApiAsset}/trx/product/${image}`}
                    alt="Bukti Pembayaran"
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

export default DetailTrxProduct;
