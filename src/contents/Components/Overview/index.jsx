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
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "contents/Components/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "contents/Components/Overview/components/Header";
import ProfilesList from "contents/Components/Overview/components/ProfilesList";

import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useAxios from "libs/useAxios";
import Config from "config";
import ModalNotif from "contents/Components/ModalNotif";
import secureStorage from "libs/secureStorage";
import burceMars from "assets/images/bruce-mars.jpg";

function Overview({ path }) {
  const [name, nameSet] = useState("");
  const [username, usernameSet] = useState("");
  const [email, emailSet] = useState("");
  const [phone, phoneSet] = useState("");
  const [point, pointSet] = useState(0);
  const [address, addressSet] = useState("");
  const [country, countrySet] = useState("");
  const [province, provinceSet] = useState("");
  const [district, districtSet] = useState("");
  const [subDistrict, subDistrictSet] = useState("");
  const [image, imageSet] = useState("");
  const [gender, genderSet] = useState("");
  const [wallet, walletSet] = useState(0);
  const [kk, kkSet] = useState("");
  const [bio, bioSet] = useState("");
  const [testimoni, testimoniSet] = useState({});
  const [role, roleSet] = useState("");
  const [sponsorKey, sponsorKeySet] = useState("");
  const [downline, downlineSet] = useState([]);
  const [redirect, redirectSet] = useState(null);
  const [profile, profileSet] = useState({});
  const params = useParams();

  const location = useLocation();

  const modalNotifRef = useRef();
  useEffect(() => {
    const user = secureStorage.getItem("user");
    if (user) {
      if (![1, 2].includes(user.roleId)) {
        redirectSet("/dashboard");
      }
      loadDetail(params.id);
    }
  }, [location]);

  const loadDetail = (id) => {
    downlineSet([]); // to clear previous data downline if exist
    useAxios()
      .get(`${Config.ApiUrl}/api/v1/${path}/get/${id}`)
      .then((response) => {
        const data = response.data.data;
        nameSet(data.name);
        usernameSet(data.username);
        emailSet(data.email);
        phoneSet(data.phone);
        addressSet(data.address);
        pointSet(data.point);
        countrySet(data.Country?.name);
        provinceSet(data.Province?.name);
        districtSet(data.District?.name);
        subDistrictSet(data.SubDistrict?.name);
        imageSet(data.image);
        genderSet(data.gender);
        walletSet(data.wallet);
        kkSet(data.kk);
        bioSet(data.remark);
        testimoniSet(data.Testimonial);
        roleSet(data.Role?.name);
        sponsorKeySet(data.SponsorKey?.key);
        const Downline = data.SponsorKey?.Referrals
          ? data.SponsorKey?.Referrals.map((downline) => {
              const User = downline.User || {};
              const district = User.District?.name || "";
              const image = User.image ? `${Config.ApiAsset}/user/${User.image}` : burceMars;
              delete User.District;
              delete User.image;
              return {
                district,
                image,
                ...User,
              };
            })
          : [];
        downlineSet(Downline);
        profileSet({
          name: data.name,
          username: data.username,
          role: data.Role?.name,
          image: data.image,
        });
      })
      .catch((err) => {
        modalNotifRef.current.setShow({
          modalTitle: "Gagal",
          modalMessage: err.response ? err.response.data?.message : "Koneksi jaringan terputus",
          onClose: () => {
            redirectSet(`/${path}`);
          },
        });
      });
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ModalNotif ref={modalNotifRef} />
      <MDBox mb={2} />
      <Header profile={profile}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="profile information"
                description={bio ? bio : ""}
                info={{
                  "Nama Lengkap": name,
                  username: username,
                  role,
                  phone,
                  email,
                  point: point.toString(),
                  saldo: "Rp. " + new Intl.NumberFormat("id-ID").format(wallet),
                  nik: kk,
                  gender,
                  sponsorKey,
                  alamat: address || "",
                  location: country || "",
                  provinsi: province || "",
                  kota: district || "",
                  kecamatan: subDistrict || "",
                }}
                social={[]}
                action={{
                  route: path.includes("admin")
                    ? `/master/admin/edit/${params.id}`
                    : `/${path}/detail/${params.id}`,
                  tooltip: "",
                }}
                shadow={false}
                edit={path.includes("admin")}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ProfilesList title="Downline Utama" profiles={downline} shadow={false} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <MDTypography variant="h6" mt={2} mb={4} fontWeight="medium">
                Testimonial
              </MDTypography>
              <MDTypography variant="h6" mt={2} mb={4} fontWeight="light">
                {testimoni?.testimonial || ""}
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

Overview.propTypes = {
  path: PropTypes.string.isRequired,
};
export default Overview;
