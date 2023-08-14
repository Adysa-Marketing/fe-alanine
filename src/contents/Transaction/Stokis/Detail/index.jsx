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

function DetailTrxStokis() {
  const [amount, amountSet] = useState(0);
  const [kk, kkSet] = useState("");
  const [image, imageSet] = useState("");
  const [imageKtp, imageKtpSet] = useState("");
  const [phone, phoneSet] = useState("");
  const [fromBank, fromBankSet] = useState("");
  const [accountName, accountNameSet] = useState("");
  const [address, addressSet] = useState("");
  const [status, statusSet] = useState({
    id: 0,
    name: "",
  });
  const [province, provinceSet] = useState("");
  const [district, districtSet] = useState("");
  const [subDistrict, subDistrictSet] = useState("");
  const [date, dateSet] = useState("");
  const [stokis, stokisSet] = useState("");
  const [paymentType, paymentTypeSet] = useState("");
  const [bank, bankSet] = useState({
    name: "",
    noRekening: "",
  });
  const [user, userSet] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });

  const [redirect, redirectSet] = useState(null);
  const modalNotifRef = useRef();

  const params = useParams();

  useEffect(() => {
    loadDetail(params.id);
  }, []);

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stokis/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        const Province = data.Province;
        const District = data.District;
        const SubDistrict = data.SubDistrict;
        const Bank = data.Bank;
        const User = data.User;

        amountSet(data.amount);
        kkSet(data.kk);
        imageSet(data.image);
        imageKtpSet(data.imageKtp);
        phoneSet(data.phoneNumber);
        fromBankSet(data.fromBank);
        accountNameSet(data.accountName);
        addressSet(data.address);
        statusSet(data.TrStatus);
        provinceSet(Province ? Province.name : "");
        districtSet(District ? District.name : "");
        subDistrictSet(SubDistrict ? SubDistrict.name : "");
        dateSet(data.date);
        stokisSet(data.Stoki?.name);
        paymentTypeSet(data.PaymentType?.name);
        Bank &&
          bankSet({
            name: Bank.name,
            noRekening: Bank.noRekening,
          });
        User &&
          userSet({
            name: User.name,
            username: User.username,
            email: User.email,
            phone: User.phone,
          });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/trx/stokis");
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
                  DETAIL TRANSAKSI STOKIS
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
                        {user.name} - ({user.username})
                      </MDTypography>
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
                  {/* Bank */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Dari Bank :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{fromBank}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* account name */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Atas Nama :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{accountName}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* account name */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Pembayaran :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{paymentType}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Bank */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Tujuan :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        {bank.name} - {bank.noRekening}
                      </MDTypography>
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
                  {/* Stokis */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Tipe :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{stokis}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Amount */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Harga :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        {"Rp. " + new Intl.NumberFormat("id-ID").format(amount)}
                      </MDTypography>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Address */}
                  {/* <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Alamat :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">{address}</MDTypography>
                    </DataTableBodyCell>
                  </TableRow> */}
                  {/* Area */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Area :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body">
                        {province}
                        <br></br>
                        {district}
                        <br></br>
                        {subDistrict}
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
                    src={`${Config.ApiAsset}/trx/stokis/${imageKtp}`}
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
                <MDTypography variant="body">Bukti Transfer</MDTypography>
                <br></br>
                {image && (
                  <MDBox
                    component="img"
                    src={`${Config.ApiAsset}/trx/stokis/${image}`}
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

export default DetailTrxStokis;
