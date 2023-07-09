import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "contents/Components/DataTable";
import Pagination from "contents/Components/Pagination";
import ButtonAction from "contents/Inventory/ButtonAction";

import useAxios from "libs/useAxios";
import Config from "config";
import secureStorage from "libs/secureStorage";
function Admin() {
  const [name, nameSet] = useState("");
  const [username, usernameSet] = useState("");
  const [email, emailSet] = useState("");
  const [phone, phoneSet] = useState("");
  const [gender, genderSet] = useState("");
  const [point, pointSet] = useState("");
  const [isActive, isActiveSet] = useState("");

  const [isLoading, isLoadingSet] = useState(false);
  const [keyword, keywordSet] = useState("");
  const [currentPage, currentPageSet] = useState(1);
  const [rowsPerPage, rowsPerPageSet] = useState(10);
  const [totalPages, totalPagesSet] = useState(0);
  const [totalData, totalDataSet] = useState(0);
  const [rows, rowsSet] = useState([]);
  const [tableHead, tableHeadSet] = useState([
    { Header: "Action", accessr: "action", width: "15%" },
    { Header: "No", accessr: "no", width: "15%" },
    { Header: "Nama", accessr: "name", width: "15%" },
    { Header: "Username", accessr: "username", width: "15%" },
    { Header: "Email", accessr: "email", width: "15%" },
    { Header: "Gender", accessr: "gender", width: "15%" },
    { Header: "Point", accessr: "point", width: "15%" },
    { Header: "Status", accessr: "staus", width: "15%" },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = (params) => {
    isLoadingSet(true);

    const gender = params.gender ? { gender: params.gender } : {};
    const status = params.status ? { statusId: params.status } : {};

    const payload = {
      keyword: params && params.keyword ? params.keyword : keyword,
      currentPage: params && params.currentPage ? params.currentPage : 1,
      rowsPerPage: params && params.rowsPerPage ? params.rowsPerPage : rowsPerPage,
      ...gender,
      ...status,
    };
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3} my={3}>
        <MDBox>
          <MDButton
            size="medium"
            color="info"
            variant="gradient"
            component={Link}
            to={{ pathname: "/master/admin/add" }}
          >
            Tambah
          </MDButton>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Admin;
