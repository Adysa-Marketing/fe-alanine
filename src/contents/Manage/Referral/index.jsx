import { useEffect, useState } from "react";
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
import MDDatePicker from "components/MDDatePicker";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
import moment from "moment";

function Referral() {
  const [user, userSet] = useState(null);
  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "No", accessor: "no", width: "15%" },
    { Header: "Downline", accessor: "downline", width: "20%" },
    { Header: "Kontak", accessor: "contact", width: "20%" },
    { Header: "Tanggal", accessor: "date", width: "30%" },
  ]);

  const [startDate, startDateSet] = useState("");
  const [endDate, endDateSet] = useState("");
  const [linkReferral, linkReferralSet] = useState("");
  const [kodeReferral, kodeReferralSet] = useState("");

  useEffect(() => {
    const userData = secureStorage.getItem("user");
    userSet(userData);
  }, []);

  useEffect(() => {
    if (user) {
      linkReferralSet(`${window.location.origin}/register/?ref=${user.SponsorKey?.key}`);
      kodeReferralSet(user.SponsorKey?.key);
      loadData();
    }
  }, [user]);

  const loadData = (params) => {
    isLoadingSet(true);

    const payload = {
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      startDate: params && params.startDate ? params.startDate : startDate,
      endDate: params && params.endDate ? params.endDate : endDate,
    };

    useAxios()
      .post(`${Config.ApiUrl}/api/v1/manage/referral/list`, payload)
      .then((response) => {
        const data = response.data;
        let no = 0;
        const output = data.data.map((item) => {
          no++;
          return {
            no,
            downline: item.User?.name,
            contact: (
              <p>
                {item.User?.email} <br /> {item.User?.phone}
              </p>
            ),
            date: item.date,
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

  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3} my={3}>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Link dan Kode Referral
            </MDTypography>
          </MDBox>
          <MDBox p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={5} md={5}>
                <MDBox mb={2} textAlign="center">
                  <MDInput
                    type="text"
                    value={linkReferral}
                    disabled={true}
                    label="Link Referral"
                    variant="standard"
                    fullWidth
                  />
                  <MDButton
                    variant="text"
                    color="info"
                    onClick={() => copyToClipboard(linkReferral)}
                  >
                    Copy&nbsp;<Icon fontSize="medium">copy</Icon>
                  </MDButton>
                </MDBox>
              </Grid>
              <Grid item xs={0} lg={1} md={1}></Grid>
              <Grid item xs={12} lg={5} md={5}>
                <MDBox mb={2} textAlign="center">
                  <MDInput
                    type="text"
                    value={kodeReferral}
                    disabled={true}
                    label="Kode Referral"
                    fullWidth
                    variant="standard"
                  />
                  <MDButton
                    variant="text"
                    color="info"
                    onClick={() => copyToClipboard(kodeReferral)}
                  >
                    Copy&nbsp;<Icon fontSize="medium">copy</Icon>
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
      <MDBox pb={3} my={3}>
        <Card>
          <MDBox p={2} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              History Referrals
            </MDTypography>
          </MDBox>

          <MDBox px={2} width="100%" display="flex" justifyContent="flex-start">
            <Grid container spacing={3}>
              {/* Start Date */}
              <Grid item xs={12} md={3} lg={2}>
                <MDDatePicker
                  input={{
                    id: "startDate",
                    placeholder: "Tanggal Awal",
                    fullWidth: true,
                    sx: {
                      ".MuiInputBase-input": {
                        height: "1em !important",
                      },
                    },
                  }}
                  value={startDate}
                  onChange={(value) => {
                    const date = moment(value[0]).format("YYYY-MM-DD");
                    startDateSet(date);
                  }}
                />
              </Grid>
              {/* End Date */}
              <Grid item xs={12} md={3} lg={2}>
                <MDDatePicker
                  input={{
                    id: "endDate",
                    placeholder: "Tanggal Akhir",
                    fullWidth: true,
                    sx: {
                      ".MuiInputBase-input": {
                        height: "1em !important",
                      },
                    },
                  }}
                  value={endDate}
                  onChange={(value) => {
                    const date = moment(value[0]).format("YYYY-MM-DD");
                    endDateSet(date);
                  }}
                />
              </Grid>
              {/* Button Search */}
              <Grid item xs={12} md={1} lg={1}>
                <MDButton
                  color="info"
                  variant="gradient"
                  onClick={() => {
                    loadData({
                      currentPage: 1,
                      startDate,
                      endDate,
                      levelId: level ? level.id : null,
                    });
                  }}
                  iconOnly
                >
                  <Icon>search</Icon>
                </MDButton>
              </Grid>
            </Grid>
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
                  startDate,
                  endDate,
                });
              }}
              onChangePage={(current) => {
                if (current !== currentPage) {
                  currentPageSet(current);
                  loadData({
                    rowsPerPage,
                    currentPage: current,
                    startDate,
                    endDate,
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

export default Referral;
