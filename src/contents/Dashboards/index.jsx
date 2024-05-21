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

import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Meterial Icon
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import secureStorage from "libs/secureStorage";
import useAxios from "libs/useAxios";
import Config from "config";
import ChartSales from "contents/Dashboards/components/ChartSales";
import StatisticsCard from "contents/Dashboards/components/StatisticsCard";
import PieCharts from "contents/Dashboards/components/PieChart";
import moment from "moment";
import CTable from "contents/Components/CTable";
import MDBadge from "components/MDBadge";
import { Link } from "react-router-dom";

function Dashboard() {
  // ADMIN STATS
  const [datasetMembers, datasetMembersSet] = useState({
    labels: [],
    datasets: [],
  });
  const [product, productSet] = useState(0);
  const [users, usersSet] = useState({
    admin: 0,
    agen: 0,
    member: 0,
  });
  const [newMember, newMemberSet] = useState(0);
  const [packages, packagesSet] = useState(0);
  const [stokis, stokisSet] = useState(0);
  const [sale, saleSet] = useState(0);
  const [monMutation, monMutationSet] = useState({
    income: 0,
    outcome: 0,
  });
  const [saleStokis, saleStokisSet] = useState(0);
  const [monRw, monRwSet] = useState(0);
  const [monWd, monWdSet] = useState(0);
  const [monSpendWd, monSpendWdSet] = useState(0);

  // AGEN & MEMBER STATS
  const [agenSale, agenSaleSet] = useState(0);
  const [agenProduct, agenProductSet] = useState(0);
  const [agenProfit, agenProfitSet] = useState(0);
  const [agenMonProfit, agenMonProfitSet] = useState(0);
  const [monBonus, monBonusSet] = useState(0);
  const [successWd, successWdSet] = useState(0);
  const [referral, referralSet] = useState(0);
  const [trRw, trRwSet] = useState(0);
  const [selfInfo, selfInfoSet] = useState({
    point: 0,
    wallet: 0,
  });

  // LIST DATA
  const [historyReferral, historyReferralSet] = useState([]);
  const [historyWidhraw, historyWidhrawSet] = useState([]);
  const [historyAgenSale, historyAgenSaleSet] = useState([]);
  const [historySale, historySaleSet] = useState([]);
  const [historyReward, historyRewardSet] = useState([]);
  const [historyStokis, historyStokisSet] = useState([]);

  useEffect(() => {
    const user = secureStorage.getItem("user");

    if (user && [1, 2].includes(user.roleId)) {
      Promise.all([
        loadCountUser(),
        loadCountNewMember(),
        loadCountProduct(),
        loadCountPackage(),
        loadCountStokis(),
        loadCountTrSale(),
        loadMonMutation(),
        loadCountSaleStokis(),
        loadMonReward(),
        loadMonWidhraw(),
        loadMonSpendWd(),
        loadChart(),
        loadHistorySale(),
        loadHistoryReward(),
        loadHistoryStokis(),
        loadHistoryWidhraw(),
      ])
        .then((result) => {
          usersSet(
            result[0]
              ? result[0]
              : {
                  admin: 0,
                  agen: 0,
                  member: 0,
                }
          );
          newMemberSet(result[1] ? result[1].amount : 0);
          productSet(result[2] ? result[2].amount : 0);
          packagesSet(result[3] ? result[3].amount : 0);
          stokisSet(result[4] ? result[4].amount : 0);
          saleSet(result[5] ? result[5].amount : 0);
          monMutationSet(result[6] ? result[6] : { income: 0, outcome: 0 });
          saleStokisSet(result[7] ? result[7].amount : 0);
          monRwSet(result[8] ? result[8].amount : 0);
          monWdSet(result[9] ? result[9].amount : 0);
          monSpendWdSet(result[10] ? result[10].amount : 0);
          datasetMembersSet(result[11] ? result[11] : { labels: [], datasets: [] });
          historySaleSet(result[12] ? result[12] : []);
          historyRewardSet(result[13] ? result[13] : []);
          historyStokisSet(result[14] ? result[14] : []);
          historyWidhrawSet(result[15] ? result[15] : []);
        })
        .catch((error) => console.log(`[!] Error : ${error}`));
    }
    if (user && [3].includes(user.roleId)) {
      Promise.all([
        loadCountAgenSale(),
        loadCountAgenProduct(),
        loadAgenProfit(),
        loadMonAgenProfit(),
        loadHistoryAgenSale(),
      ])
        .then((result) => {
          agenSaleSet(result[0] ? result[0].amount : 0);
          agenProductSet(result[1] ? result[1].amount : 0);
          agenProfitSet(result[2] ? result[2].amount : 0);
          agenMonProfitSet(result[3] ? result[3].amount : 0);
          historyAgenSaleSet(result[4] ? result[4] : []);
        })
        .catch((error) => console.log(`[!] Error : ${error}`));
    }

    if (user && [3, 4].includes(user.roleId)) {
      Promise.all([
        loadMonBonus(),
        loadSuccessWd(),
        loadCountReferral(),
        loadCountTrReward(),
        loadSelfInfo(),
        loadHistoryReferral(),
        loadHistoryWidhraw(),
      ])
        .then((result) => {
          monBonusSet(result[0] ? result[0].amount : 0);
          successWdSet(result[1] ? result[1].amount : 0);
          referralSet(result[2] ? result[2].amount : 0);
          trRwSet(result[3] ? result[3].amount : 0);
          selfInfoSet(
            result[4]
              ? result[4]
              : {
                  point: 0,
                  wallet: 0,
                }
          );
          historyReferralSet(result[5] ? result[5] : []);
          historyWidhrawSet(result[6] ? result[6] : []);
        })
        .catch((error) => console.log(`[!] Error : ${error}`));
    }
  }, []);

  // LOAD ADMIN STATS
  const loadCountUser = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/user`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountNewMember = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/new-member`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountProduct = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/product`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountPackage = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/package`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountStokis = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/stokis`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountTrSale = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/sale`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadMonMutation = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/mon-mutation`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountSaleStokis = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/sale-stokis`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadMonReward = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/mon-rw`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadMonWidhraw = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/mon-wd`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadMonSpendWd = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/mon-spend-wd`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadChart = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat?byView=month`)
      .then((res) => {
        const data = res.data.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  // LOAD AGEN & MEMBER STATS
  const loadCountAgenSale = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/agen-sale`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountAgenProduct = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/agen-product`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadAgenProfit = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/agen-profit`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadMonAgenProfit = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/agen-mon-profit`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadMonBonus = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/mon-bonus`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadSuccessWd = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/success-wd`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountReferral = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/referral`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadCountTrReward = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/tr-reward`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadSelfInfo = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/self-info`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  // HISTORY LIST DATA
  const loadHistorySale = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/history-sale`)
      .then((res) => {
        const data = res.data.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadHistoryReward = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/history-reward`)
      .then((res) => {
        const data = res.data.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadHistoryStokis = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/history-stokis`)
      .then((res) => {
        const data = res.data.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadHistoryWidhraw = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/history-widhraw`)
      .then((res) => {
        const data = res.data.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadHistoryReferral = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/history-referral`)
      .then((res) => {
        const data = res.data.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const loadHistoryAgenSale = () => {
    return useAxios()
      .get(`${Config.ApiUrl}/api/v1/trx/stat/history-agen-sale`)
      .then((res) => {
        const data = res.data.data;
        return data;
      })
      .catch((err) => console.log(`[!] Error : ${err}`));
  };

  const user = secureStorage.getItem("user");
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} mb={5}>
          {user && [1, 2].includes(user.roleId) && (
            <>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={users.admin}
                  color="info"
                  icon={<ManageAccountsIcon />}
                  title={"Admin"}
                  description={"Total Admin"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={users.agen}
                  color="secondary"
                  icon="person"
                  title={"Agen"}
                  description={"Total Agen"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={users.member}
                  color="dark"
                  icon="group"
                  title={"Member"}
                  description={"Total Member"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={newMember}
                  color="success"
                  icon={<HowToRegIcon />}
                  title={"Register"}
                  description={"Member Baru"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={product}
                  color="primary"
                  icon="inventory"
                  title={"Produk"}
                  description={"Total Produk"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={packages}
                  color="warning"
                  icon="category"
                  title={"Paket"}
                  description={"Total Paket"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={stokis}
                  color="secondary"
                  icon="layers"
                  title={"Stokis"}
                  description={"Jenis Stokis"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={sale}
                  color="error"
                  icon="shoppingcart"
                  title={"Penjualan"}
                  description={"Total Penjualan"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={new Intl.NumberFormat("id-ID").format(monMutation.income)}
                  color="success"
                  icon="paid"
                  title={"Dana Masuk"}
                  description={"Dana Masuk"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={new Intl.NumberFormat("id-ID").format(monMutation.outcome)}
                  color="error"
                  icon="southeast"
                  title={"Dana Keluar"}
                  description={"Dana Keluar"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={saleStokis}
                  color="info"
                  icon={<PersonAddAltIcon />}
                  title={"Regis Agen"}
                  description={"Pendaftaran Agen"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={monRw}
                  color="warning"
                  icon={<DevicesOtherIcon />}
                  title={"Reward"}
                  description={"Pengajuan Reward"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={monWd}
                  color="primary"
                  icon={<MoveDownIcon />}
                  title={"Widhraw"}
                  description={"Pengajuan Widhraw"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={new Intl.NumberFormat("id-ID").format(monSpendWd)}
                  color="error"
                  icon={<CreditCardOffIcon />}
                  title={"Pencairan"}
                  description={"Pencairan WD"}
                />
              </Grid>
            </>
          )}
          {user && [3, 4].includes(user.roleId) && (
            <>
              {user && [3].includes(user.roleId) && (
                <>
                  <Grid item xs={6} md={3} lg={2}>
                    <StatisticsCard
                      count={agenSale}
                      color="success"
                      icon="sell"
                      title={"Penjualan"}
                      description={"Total Penjualan"}
                    />
                  </Grid>
                  <Grid item xs={6} md={3} lg={2}>
                    <StatisticsCard
                      count={agenProduct}
                      color="primary"
                      icon="inventory"
                      title={"Produk Item"}
                      description={"Total Item"}
                    />
                  </Grid>
                  <Grid item xs={6} md={3} lg={2}>
                    <StatisticsCard
                      count={new Intl.NumberFormat("id-ID").format(agenProfit)}
                      color="info"
                      icon={<LocalAtmIcon />}
                      title={"Profit"}
                      description={"Total Profit"}
                    />
                  </Grid>
                  <Grid item xs={6} md={3} lg={2}>
                    <StatisticsCard
                      count={new Intl.NumberFormat("id-ID").format(agenMonProfit)}
                      color="warning"
                      icon="shoppingcart"
                      title={"Profit Bulanan"}
                      description={"Profit Bulanan"}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={selfInfo.point}
                  color="secondary"
                  icon="timeline"
                  title={"Poin"}
                  description={"Total Poin"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={new Intl.NumberFormat("id-ID").format(selfInfo.wallet)}
                  color="success"
                  icon="wallet"
                  title={"Dompet"}
                  description={"Total Saldo"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={new Intl.NumberFormat("id-ID").format(monBonus)}
                  color="secondary"
                  icon="sell"
                  title={"Bonus Bulanan"}
                  description={"Bonus Bulan ini"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={new Intl.NumberFormat("id-ID").format(successWd)}
                  color="success"
                  icon="paid"
                  title={"Widhraw"}
                  description={"Total Widhraw"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={referral}
                  color="dark"
                  icon="group"
                  title={"Referral"}
                  description={"Total Referral"}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <StatisticsCard
                  count={trRw}
                  color="info"
                  icon={<DevicesOtherIcon />}
                  title={"Reward"}
                  description={"Klaim Reward"}
                />
              </Grid>
            </>
          )}
        </Grid>
        {user && [1, 2].includes(user.roleId) && (
          <>
            <Grid container spacing={3} mb={2}>
              <Grid item xs={12} md={12} lg={8}>
                <MDBox mb={3}>
                  <ChartSales
                    title={`Statistik Pendaftaran Bulanan ${moment().format("YYYY")}`}
                    height={"22.19rem"}
                    chart={datasetMembers}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={12} lg={4}>
                <MDBox mb={2}>
                  <PieCharts
                    title="Statistik Keuangan Bulanan"
                    height="325px"
                    description={"Laporan Dana Masuk dan Dana Keluar Bulan ini"}
                    chart={{
                      labels: ["Dana Masuk", "Dana Keluar", "Register Member"],
                      datasets: {
                        label: "Statistik Keuangan",
                        backgroundColors: ["success", "error", "info"],
                        data: [monMutation.income, monMutation.outcome, monMutation.registration],
                      },
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </>
        )}

        {/* HISTORY LIST DATA */}
        {user && [1, 2].includes(user.roleId) && (
          <>
            {/* history sale & history reward */}
            <Grid container spacing={3} mb={2}>
              <Grid item xs={12} md={12} lg={6}>
                <Card>
                  <MDBox
                    p={2}
                    lineHeight={1}
                    display="flex"
                    flexDirection={{ md: "row", xs: "column" }}
                    justifyContent={{ md: "space-between", xs: "center" }}
                    alignItems={{ md: "center", xs: "flex-start" }}
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      History Penjualan
                    </MDTypography>

                    <MDBox mt={{ xs: 1, md: 0 }}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        component={Link}
                        size="small"
                        to={{ pathname: "/trx/product" }}
                      >
                        Lihat Semua
                      </MDButton>
                    </MDBox>
                  </MDBox>

                  <MDBox pb={2} px={2}>
                    <CTable
                      tableHead={[
                        { name: "kode", width: "15%" },
                        { name: "nama", width: "20%" },
                        { name: "produk", width: "25%" },
                        { name: "status", width: "15%" },
                        { name: "harga", width: "20%" },
                        { name: "diskon", width: "20%" },
                        { name: "dibayar", width: "20%" },
                        { name: "tanggal", width: "20%" },
                      ]}
                      textAlignColumns={["center", "left", "left", "right", "center"]}
                      tableData={historySale.map((item, idx) => [
                        item.kode,
                        item.User?.name,
                        item.Product?.name,
                        <MDBadge
                          key={idx}
                          size="lg"
                          variant="contained"
                          badgeContent={item.TrStatus && item.TrStatus ? item.TrStatus.name : ""}
                          color={
                            item.TrStatus.id === 1
                              ? "secondary"
                              : item.TrStatus.id === 2
                              ? "error"
                              : item.TrStatus.id === 3
                              ? "warning"
                              : item.TrStatus.id === 4
                              ? "info"
                              : "success"
                          }
                        />,
                        "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
                        "Rp. " + new Intl.NumberFormat("id-ID").format(item.discount),
                        "Rp. " + new Intl.NumberFormat("id-ID").format(item.paidAmount),
                        moment(item.date).format("DD-MM-YYYY HH:mm:ss"),
                      ])}
                    />
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <Card>
                  <MDBox
                    p={2}
                    lineHeight={1}
                    display="flex"
                    flexDirection={{ md: "row", xs: "column" }}
                    justifyContent={{ md: "space-between", xs: "center" }}
                    alignItems={{ md: "center", xs: "flex-start" }}
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      History Reward
                    </MDTypography>

                    <MDBox mt={{ xs: 1, md: 0 }}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        component={Link}
                        size="small"
                        to={{ pathname: "/trx/reward" }}
                      >
                        Lihat Semua
                      </MDButton>
                    </MDBox>
                  </MDBox>

                  <MDBox pb={2} px={2}>
                    <CTable
                      tableHead={[
                        { name: "kode", width: "15%" },
                        { name: "nama", width: "20%" },
                        { name: "item", width: "25%" },
                        { name: "status", width: "15%" },
                        { name: "tanggal", width: "15%" },
                      ]}
                      textAlignColumns={["center", "left", "left", "right", "center"]}
                      tableData={historyReward.map((item, idx) => [
                        item.kode,
                        item.User?.name,
                        item.Reward?.name,
                        <MDBadge
                          key={idx}
                          size="lg"
                          variant="contained"
                          badgeContent={item.RwStatus && item.RwStatus ? item.RwStatus.name : ""}
                          color={
                            item.RwStatus.id === 1
                              ? "secondary"
                              : item.RwStatus.id === 2
                              ? "error"
                              : item.RwStatus.id === 3
                              ? "warning"
                              : item.RwStatus.id === 4
                              ? "info"
                              : "success"
                          }
                        />,
                        moment(item.date).format("DD-MM-YYYY HH:mm:ss"),
                      ])}
                    />
                  </MDBox>
                </Card>
              </Grid>
            </Grid>

            {/* history stokis & history widharaw */}
            <Grid container spacing={3} mb={2}>
              <Grid item xs={12} md={12} lg={6}>
                <Card>
                  <MDBox
                    p={2}
                    lineHeight={1}
                    display="flex"
                    flexDirection={{ md: "row", xs: "column" }}
                    justifyContent={{ md: "space-between", xs: "center" }}
                    alignItems={{ md: "center", xs: "flex-start" }}
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      History Stokis
                    </MDTypography>

                    <MDBox mt={{ xs: 1, md: 0 }}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        component={Link}
                        size="small"
                        to={{ pathname: "/trx/stokis" }}
                      >
                        Lihat Semua
                      </MDButton>
                    </MDBox>
                  </MDBox>

                  <MDBox pb={2} px={2}>
                    <CTable
                      tableHead={[
                        { name: "kode", width: "15%" },
                        { name: "nama", width: "20%" },
                        { name: "stokis", width: "25%" },
                        { name: "harga", width: "20%" },
                        { name: "diskon", width: "20%" },
                        { name: "status", width: "20%" },
                        { name: "tanggal", width: "20%" },
                      ]}
                      textAlignColumns={["center", "left", "left", "right", "center"]}
                      tableData={historyStokis.map((item, idx) => {
                        const pelanggan = (
                          <p>
                            {item.User?.username} <br />
                            {item.User?.email} <br />
                            {item.User?.phone}
                          </p>
                        );
                        return [
                          item.kode,
                          pelanggan,
                          item.Stoki?.name,
                          "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
                          "Rp. " + new Intl.NumberFormat("id-ID").format(item.Stoki?.price),
                          <MDBadge
                            key={idx}
                            size="lg"
                            variant="contained"
                            badgeContent={item.TrStatus && item.TrStatus ? item.TrStatus.name : ""}
                            color={
                              item.TrStatus.id === 1
                                ? "secondary"
                                : item.TrStatus.id === 2
                                ? "error"
                                : item.TrStatus.id === 3
                                ? "warning"
                                : "success"
                            }
                          />,
                          moment(item.date).format("DD-MM-YYYY HH:mm:ss"),
                        ];
                      })}
                    />
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <Card>
                  <MDBox
                    p={2}
                    lineHeight={1}
                    display="flex"
                    flexDirection={{ md: "row", xs: "column" }}
                    justifyContent={{ md: "space-between", xs: "center" }}
                    alignItems={{ md: "center", xs: "flex-start" }}
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      History Widhraw
                    </MDTypography>

                    <MDBox mt={{ xs: 1, md: 0 }}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        component={Link}
                        size="small"
                        to={{ pathname: "/trx/widhraw" }}
                      >
                        Lihat Semua
                      </MDButton>
                    </MDBox>
                  </MDBox>

                  <MDBox pb={2} px={2}>
                    <CTable
                      tableHead={[
                        { name: "kode", width: "15%" },
                        { name: "penarikan", width: "20%" },
                        { name: "dibayar", width: "25%" },
                        { name: "status", width: "15%" },
                        { name: "pengajuan", width: "15%" },
                        { name: "pencairan", width: "15%" },
                      ]}
                      textAlignColumns={["center", "left", "left", "right", "center"]}
                      tableData={historyWidhraw.map((item, idx) => [
                        item.kode,
                        "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
                        "Rp. " + new Intl.NumberFormat("id-ID").format(item.paidAmount),
                        <MDBadge
                          key={idx}
                          size="lg"
                          variant="contained"
                          badgeContent={item.WdStatus && item.WdStatus ? item.WdStatus.name : ""}
                          color={
                            item.WdStatus.id === 1
                              ? "secondary"
                              : item.WdStatus.id === 2
                              ? "error"
                              : item.WdStatus.id === 3
                              ? "warning"
                              : item.WdStatus.id === 4
                              ? "info"
                              : "success"
                          }
                        />,
                        moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                        [5].includes(item.WdStatus?.id)
                          ? moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss")
                          : "-",
                      ])}
                    />
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* history referral & history widhraw */}
        {user && [3, 4].includes(user.roleId) && (
          <Grid container spacing={3} mb={2}>
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <MDBox
                  p={2}
                  lineHeight={1}
                  display="flex"
                  flexDirection={{ md: "row", xs: "column" }}
                  justifyContent={{ md: "space-between", xs: "center" }}
                  alignItems={{ md: "center", xs: "flex-start" }}
                >
                  <MDTypography variant="button" fontWeight="medium">
                    History Referral
                  </MDTypography>

                  <MDBox mt={{ xs: 1, md: 0 }}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      component={Link}
                      size="small"
                      to={{ pathname: "/manage/referral" }}
                    >
                      Lihat Semua
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox pb={2} px={2}>
                  <CTable
                    tableHead={[
                      { name: "downline", width: "20%" },
                      { name: "kontak", width: "25%" },
                      { name: "tanggal", width: "15%" },
                    ]}
                    textAlignColumns={["center", "left", "left", "right", "center"]}
                    tableData={historyReferral.map((item, idx) => {
                      const kontak = (
                        <p>
                          {item.User?.email} <br /> {item.User?.phone}
                        </p>
                      );

                      return [
                        item.User?.name,
                        kontak,
                        moment(item.date).format("DD-MM-YYYY HH:mm:ss"),
                      ];
                    })}
                  />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <MDBox
                  p={2}
                  lineHeight={1}
                  display="flex"
                  flexDirection={{ md: "row", xs: "column" }}
                  justifyContent={{ md: "space-between", xs: "center" }}
                  alignItems={{ md: "center", xs: "flex-start" }}
                >
                  <MDTypography variant="button" fontWeight="medium">
                    History Widhraw
                  </MDTypography>

                  <MDBox mt={{ xs: 1, md: 0 }}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      component={Link}
                      size="small"
                      to={{ pathname: "/trx/widhraw" }}
                    >
                      Lihat Semua
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox pb={2} px={2}>
                  <CTable
                    tableHead={[
                      { name: "kode", width: "15%" },
                      { name: "penarikan", width: "20%" },
                      { name: "dibayar", width: "25%" },
                      { name: "status", width: "15%" },
                      { name: "pengajuan", width: "15%" },
                      { name: "pencairan", width: "15%" },
                    ]}
                    textAlignColumns={["center", "left", "left", "right", "center"]}
                    tableData={historyWidhraw.map((item, idx) => [
                      item.kode,
                      "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
                      "Rp. " + new Intl.NumberFormat("id-ID").format(item.paidAmount),
                      <MDBadge
                        key={idx}
                        size="lg"
                        variant="contained"
                        badgeContent={item.WdStatus && item.WdStatus ? item.WdStatus.name : ""}
                        color={
                          item.WdStatus.id === 1
                            ? "secondary"
                            : item.WdStatus.id === 2
                            ? "error"
                            : item.WdStatus.id === 3
                            ? "warning"
                            : item.WdStatus.id === 4
                            ? "info"
                            : "success"
                        }
                      />,
                      moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                      [5].includes(item.WdStatus?.id)
                        ? moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss")
                        : "-",
                    ])}
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* trx product agen */}
        {user && [3].includes(user.roleId) && (
          <Grid container spacing={3} mb={2}>
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <MDBox
                  p={2}
                  lineHeight={1}
                  display="flex"
                  flexDirection={{ md: "row", xs: "column" }}
                  justifyContent={{ md: "space-between", xs: "center" }}
                  alignItems={{ md: "center", xs: "flex-start" }}
                >
                  <MDTypography variant="button" fontWeight="medium">
                    History Penjualan
                  </MDTypography>

                  <MDBox mt={{ xs: 1, md: 0 }}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      component={Link}
                      size="small"
                      to={{ pathname: "/trx/product/agen" }}
                    >
                      Lihat Semua
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox pb={2} px={2}>
                  <CTable
                    tableHead={[
                      { name: "kode", width: "15%" },
                      { name: "name", width: "20%" },
                      { name: "product", width: "25%" },
                      { name: "qty", width: "15%" },
                      { name: "total", width: "15%" },
                      { name: "profit", width: "15%" },
                      { name: "status", width: "20%" },
                      { name: "tanggal", width: "20%" },
                    ]}
                    textAlignColumns={["center", "left", "left", "right", "center"]}
                    tableData={historyAgenSale.map((item, idx) => [
                      item.kode,
                      item.name,
                      item.Product?.name,
                      item.qty,
                      "Rp. " + new Intl.NumberFormat("id-ID").format(item.amount),
                      "Rp. " + new Intl.NumberFormat("id-ID").format(item.profit),
                      <MDBadge
                        key={idx}
                        size="lg"
                        variant="contained"
                        badgeContent={item.TrStatus && item.TrStatus ? item.TrStatus.name : ""}
                        color={
                          item.TrStatus.id === 1
                            ? "secondary"
                            : item.TrStatus.id === 2
                            ? "error"
                            : item.TrStatus.id === 4
                            ? "success"
                            : "warning"
                        }
                      />,
                      moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                    ])}
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
