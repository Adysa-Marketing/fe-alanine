import { useEffect, useRef, useState } from "react";
import { Navigate, Link } from "react-router-dom";
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

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";
import ButtonAction from "contents/Master/WaBot/components/ButtonAction";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
import DialogForm from "contents/Components/DialogForm";
import ModalNotif from "contents/Components/ModalNotif";

// images
import imgActved from "assets/img/wabot/actived.svg";
import imgBadReq from "assets/img/wabot/bad-request.svg";
import imgBlank from "assets/img/wabot/blank.png";
import imgConnected from "assets/img/wabot/connected.jpg";
import imgDeleted from "assets/img/wabot/deleted.svg";
import imgLoader from "assets/img/wabot/loader.gif";
import imgTimeout from "assets/img/wabot/timeout.svg";

// socket io
import io from "socket.io-client";
import Confirm from "contents/Components/Confirm";

function WaBot() {
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Action", accessor: "action", width: "15%" },
    { Header: "Nama", accessor: "name", width: "25%" },
    { Header: "Status", accessor: "status", width: "25%" },
    { Header: "Key", accessor: "key", width: "25%" },
    { Header: "No Telpon", accessor: "phone", width: "25%" },
  ]);
  const [redirect, redirectSet] = useState(null);

  const [id, idSet] = useState(null);
  const [name, nameSet] = useState("");
  const [phone, phoneSet] = useState("");
  const [disabledSubmit, disabledSubmitSet] = useState(false);
  const [image, imageSet] = useState(imgBlank);
  const [action, actionSet] = useState("create");
  const [btnQr, btnQrSet] = useState("SUBMIT");
  const [colorBtnQr, colorBtnQrSet] = useState("info");
  const [dataSocket, dataSocketSet] = useState(null);

  const dialogFormRef = useRef();
  const modalNotifRef = useRef();
  const confirmRef = useRef();

  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1, 2].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadData();
    }
  }, []);

  const loadData = (params) => {
    isLoadingSet(true);

    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/wa-bot/list`, payload)
      .then((response) => {
        const data = response.data;
        const output = data.data.map((item) => {
          return {
            name: item.name,
            status: (
              <MDBadge
                variant="contained"
                badgeContent={item.status == 1 ? "Aktif" : "NonAktif"}
                size="lg"
                color={item.status === 1 ? "success" : "error"}
              />
            ),
            key: item.key,
            phone: item.phone,
            action: (
              <ButtonAction
                id={item.id}
                uniqKey={item.key}
                refreshData={loadData}
                regenerate={true}
                edit={true}
                close={true}
                remove={true}
                setRegenerate={handleRegenerate}
                setEdit={handleEdit}
                setClose={handleClose}
                setRemove={handleRemove}
              ></ButtonAction>
            ),
          };
        });

        totalPagesSet(data.totalPages);
        totalDataSet(data.totalData);
        rowsSet(output);
        isLoadingSet(false);
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
        isLoadingSet(false);
      });
  };

  const handleEdit = (id) => {
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/master/wa-bot/get/${id}`)
      .then((response) => {
        let data = response.data.data;
        idSet(data.id);
        nameSet(data.name);
        phoneSet(data.phone);
        actionSet("update");
        disabledSubmitSet(false);
        dialogFormRef.current.setShow({ show: true, title: "Edit Instance" });
      })
      .catch((error) => {
        console.log("[!] Error : ", error);
      });
  };

  const handleRegenerate = (key) => {
    actionSet("regenereate");
    dialogFormRef.current.setShow({ show: true, title: "Regenerate QRcode" });
    generateQr(key);
  };

  const handleClose = (key) => {
    confirmRef.current.setShow({
      title: "Konfirmasi",
      message: "Apakah anda yang ini menutup instance ?",
      onAction: () => {
        actionSet("close");
        dialogFormRef.current.setShow({ show: true, title: "Tutup Instance" });
        handleCloseDeleteInstance("close-session", key);
      },
    });
  };

  const handleRemove = (id) => {
    confirmRef.current.setShow({
      title: "Konfirmasi",
      message: "Apakah anda yang ini menghapus instance ?",
      onAction: () => {
        submitRemove(id);
      },
    });
  };

  const submitRemove = (id) => {
    useAxios()
      .delete(`${Config.ApiUrl}/api/v1/master/wa-bot/delete`, { data: { id } })
      .then((response) => {
        const key = response.data.key;
        actionSet("remove");
        dialogFormRef.current.setShow({ show: true, title: "Hapus Instance" });
        handleCloseDeleteInstance("end-session", key);
        loadData();
      })
      .catch((error) => {
        if (error.response.data) {
          modalNotifRef.current.setShow({
            modalMessage: error.response.data
              ? error.response.data?.message
              : "Terjadi kesalahan pada system",
            color: "warning",
          });
        } else {
          modalNotifRef.current.setShow({
            modalTitle: "Gagal",
            modalMessage: "Koneksi jaringan terputus",
          });
        }
      });
  };

  const refreshData = () => {
    resetForm();
    loadData();
  };

  const resetForm = () => {
    disabledSubmitSet(false);
    imageSet(imgBlank);
    idSet(null);
    nameSet("");
    phoneSet("");
    actionSet("create");
    btnQrSet("SUBMIT");
    colorBtnQrSet("info");
  };

  const handleCloseSocket = () => {
    console.log("close socket");
    if (dataSocket) {
      console.log("[!] Disconnect from server");
      dataSocket.removeListener("connect");
      dataSocket.disconnect();
    }
    return false;
  };

  const generateQr = (room) => {
    const socket = io(`${Config.SocketUrl}`);
    btnQrSet("Process generate QRcode...");
    disabledSubmitSet(true);
    imageSet(imgLoader);
    dataSocketSet(socket);

    socket.on("connect", () => {
      socket.emit("join", room);
      console.log("connect to socket server");
      let message = {
        action: "add-device",
        instanceName: room,
      };
      socket.emit("message", { room, message: message });

      // onmessage
      socket.on("message", (message) => {
        const { status, data } = message.message;
        // check status code
        if (status !== 200) {
          let stat = "info";
          let value = "Lakukan Scanning QR Code";

          // session already exist
          status == 409 && imageSet(imgActved);

          // accept base64
          status == 201 && imageSet(data);

          // error not logged
          status == 500 && data == "Gagal Login" && imageSet(imgTimeout) && (stat = "danger");

          // set final value
          btnQrSet(value) && colorBtnQrSet(stat);
        }

        // handle response session
        if ((status == 200 && data == "Login Success") || data == "Success Continue Session") {
          imageSet(imgConnected);
          colorBtnQrSet("success");
          btnQrSet(data);
        }
      });

      socket.on("disconnect", () => {
        console.log("[!] Disconnect from server");
        socket.removeListener("connect");
        socket.emit("join", room);
        console.log("[!] Re-Connect to server with room : ", room);
      });
    });
  };

  const handleCloseDeleteInstance = (action, room) => {
    const socket = io(`${Config.SocketUrl}`);
    imageSet(imgLoader);
    btnQrSet("Process...");
    colorBtnQrSet("info");
    disabledSubmitSet(true);
    dataSocketSet(socket);

    socket.on("connect", function () {
      socket.emit("join", room);
      let message = {
        action,
        instanceName: room,
      };
      socket.emit("message", { room, message: message });

      socket.on("message", (message) => {
        console.log("message : ", message);
        const { status, data } = message.message;
        let stat = "success";

        if (status == 200) {
          data == `Sukses menghapus instance` ? imageSet(imgDeleted) : imageSet(imgConnected);
        } else {
          stat = "warning";
          imageSet(imgBadReq);
        }

        btnQrSet(data);
        colorBtnQrSet(stat);
      });

      socket.on("disconnect", () => {
        console.log("[!] Disconnect from server");
        socket.removeListener("connect");
        socket.emit("join", room);
        console.log("[!] Re-Connect to server with room : ", room);
      });
    });
  };

  const handleSubmit = () => {
    if (name == "" || phone == "") {
      let input = "";
      phone == "" && (input = "No WhatsApp");
      name == "" && (input = "Nama Instance");
      modalNotifRef.current.setShow({
        modalTitle: "Gagal",
        modalMessage: `Mohon lengkapi data ${input}`,
      });
    } else {
      sendData();
    }
  };

  const sendData = () => {
    disabledSubmitSet(true);
    const payload = {
      id,
      phone,
      name,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/master/wa-bot/${action}`, payload)
      .then((response) => {
        disabledSubmitSet(false);
        if (action == "update") {
          modalNotifRef.current.setShow({
            modalTitle: "Sukses",
            modalMessage: response.data.message,
            onClose: () => {
              console.log("[REFRESH]");
              dialogFormRef.current.setShow({ show: false, title: "" });
              refreshData();
            },
          });
        } else {
          let data = response.data.data;
          generateQr(data.key);
        }
      })
      .catch((err) => {
        console.log("error : ", err);
        disabledSubmitSet(false);
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
          });
        }
      });
  };

  const renderImage = (
    <MDBox mb={2}>
      <MDBox
        component="img"
        src={image}
        alt="QRcode"
        borderRadius="lg"
        shadow="sm"
        width="100%"
        height="100%"
        position="relative"
        zIndex={10}
        mb={2}
      />
    </MDBox>
  );
  const renderInput = (
    <>
      <MDBox mb={2}>
        <MDInput
          fullWidth
          type="text"
          value={name}
          onChange={(e) => nameSet(e.target.value)}
          label="Nama Instance"
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          fullWidth
          type="text"
          value={phone}
          onChange={(e) => phoneSet(e.target.value)}
          label="No WhatsApp"
        />
      </MDBox>
    </>
  );

  const renderForm = (
    <Grid container item xs={12} lg={12} sx={{ mx: "auto" }} mt={2}>
      <MDBox width="100%" component="form">
        {action !== "update" && renderImage}
        {(action == "create" || action == "update") && renderInput}
      </MDBox>
      <MDBox py={3} width="100%">
        <MDBox>
          <MDButton
            variant="gradient"
            color={colorBtnQr}
            disabled={disabledSubmit}
            onClick={handleSubmit}
            fullWidth
          >
            {btnQr}
          </MDButton>
        </MDBox>
        <MDBox my={2}>
          <MDButton
            variant="gradient"
            color="error"
            onClick={() => {
              refreshData();
              handleCloseSocket();
              dialogFormRef.current.setShow({ show: false, title: "" });
            }}
            fullWidth
          >
            Tutup
          </MDButton>
        </MDBox>
      </MDBox>
    </Grid>
  );

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Confirm ref={confirmRef} />
      <ModalNotif ref={modalNotifRef} />
      <DialogForm ref={dialogFormRef} maxWidth="xs">
        {renderForm}
      </DialogForm>
      <MDBox pb={3} my={3}>
        <MDBox pb={2} mt={{ xs: 2, md: 0 }} display="flex">
          {totalData < 1 && (
            <MDButton
              size="medium"
              color="info"
              variant="gradient"
              onClick={() => {
                resetForm();
                dialogFormRef.current.setShow({ show: true, title: "Tambah Instance" });
              }}
            >
              Tambah
            </MDButton>
          )}
        </MDBox>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Daftar Instance WA-BOT
            </MDTypography>
          </MDBox>

          <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
            <Grid container spacing={3}></Grid>
          </MDBox>
          <MDBox p={2}>
            <DataTable isLoading={isLoading} tableHead={tableHead} tableData={rows} />
            <Pagination
              totalPages={totalPages}
              totalData={totalData}
              currentPage={currentPage}
              rowsPerPage={[10, 25, 50, "All"]}
              totalButton={3}
              defaultRowsPerPage={rowsPerPage}
              onChangeRowsPerPage={(value) => {
                rowsPerPageSet(value);
                currentPageSet(1);
                loadData({
                  rowsPerPage: value,
                  currentPage: 1,
                  keyword,
                });
              }}
              onChangePage={(current) => {
                if (current !== currentPage) {
                  currentPageSet(current);
                  loadData({
                    rowsPerPage,
                    currentPage: current,
                    keyword,
                  });
                }
              }}
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default WaBot;
