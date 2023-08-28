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
import secureStorage from "libs/secureStorage";

function DetailTrxRw() {
  const [status, statusSet] = useState({
    id: 0,
    name: "",
  });

  const [date, dateSet] = useState("");
  const [imageKtp, imageKtpSet] = useState("");
  const [name, nameSet] = useState("");
  const [point, pointSet] = useState(0);
  const [minFoot, minFootSet] = useState(0);
  const [address, addressSet] = useState("");
  const [remark, remarkSet] = useState("");

  const [user, userSet] = useState({
    id: null,
    name: "",
    username: "",
    phone: "",
    kk: "",
  });

  const [redirect, redirectSet] = useState(null);
  const modalNotifRef = useRef();

  const params = useParams();

  useEffect(() => {
    loadDetail(params.id);
  }, []);

  const loadDetail = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/reward/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        const User = data.User;

        nameSet(data.Reward?.name);
        dateSet(data.date);
        pointSet(data.Reward?.point);
        minFootSet(data.Reward?.minFoot);
        imageKtpSet(data.imageKtp);
        addressSet(data.address);
        statusSet(data.RwStatus);
        dateSet(data.date);
        remarkSet(data.remark);
        User &&
          userSet({
            id: User.id,
            name: User.name,
            username: User.username,
            phone: User.phone,
            kk: User.kk,
          });
      })
      .catch((err) => {
        console.log("[!] Error : ", err);
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet("/trx/reward");
          },
        });
      });
  };

  const userData = secureStorage.getItem("user");

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
                  DETAIL TRANSAKSI REWARD
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
                  {/* KK */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        No Nik :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {user.kk ? user.kk : "-"}
                      </p>
                    </DataTableBodyCell>
                  </TableRow>
                  {/* Reward Name */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Item :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {name}
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
                  {/* Requirement */}
                  <TableRow>
                    <DataTableBodyCell noBorder>
                      <MDTypography variant="body" fontWeight="medium">
                        Syarat :
                      </MDTypography>
                    </DataTableBodyCell>
                    <DataTableBodyCell noBorder>
                      <p style={{ wordWrap: "break-word", width: "10em", color: "#344767" }}>
                        {`${minFoot} kaki . masing-masing ${point} point`}
                      </p>
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
                  {/* btn detail */}
                  {[1, 2].includes(userData.roleId) && (
                    <TableRow>
                      <DataTableBodyCell noBorder>
                        <MDButton
                          variant="gradient"
                          color="info"
                          size="small"
                          component={Link}
                          to={{ pathname: `/manage/member/detail/${user.id}` }}
                        >
                          Detail User
                        </MDButton>
                      </DataTableBodyCell>
                    </TableRow>
                  )}
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
                    src={`${Config.ApiAsset}/trx/reward/${imageKtp}`}
                    alt="Foto KTP"
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

export default DetailTrxRw;
