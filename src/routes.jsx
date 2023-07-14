/** 
  All of the routes for the Material Dashboard 2 PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 PRO React layouts
import Analytics from "layouts/dashboards/analytics";
import Sales from "layouts/dashboards/sales";
import AllProjects from "layouts/pages/profile/all-projects";
import NewUser from "layouts/pages/users/new-user";
import Settings from "layouts/pages/account/settings";
import Billing from "layouts/pages/account/billing";
import Invoice from "layouts/pages/account/invoice";
import Timeline from "layouts/pages/projects/timeline";
import PricingPage from "layouts/pages/pricing-page";
import Widgets from "layouts/pages/widgets";
import RTL from "layouts/pages/rtl";
import Charts from "layouts/pages/charts";
import Notifications from "layouts/pages/notifications";
import Kanban from "layouts/applications/kanban";
import Wizard from "layouts/applications/wizard";
import DataTables from "layouts/applications/data-tables";
import Calendar from "layouts/applications/calendar";
import NewProduct from "layouts/ecommerce/products/new-product";
import EditProduct from "layouts/ecommerce/products/edit-product";
import ProductPage from "layouts/ecommerce/products/product-page";
import OrderList from "layouts/ecommerce/orders/order-list";
import OrderDetails from "layouts/ecommerce/orders/order-details";
import SignInBasic from "layouts/authentication/sign-in/basic";
import SignInCover from "layouts/authentication/sign-in/cover";
import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpCover from "layouts/authentication/sign-up/cover";
import ResetCover from "layouts/authentication/reset-password/cover";

// Adysa Contents

// Material Dashboard 2 PRO React components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "assets/images/team-3.jpg";

// Contents
import Dashboard from "contents/Dashboards";
import Container from "@mui/material/Container";
import Admin from "contents/Master/Admin";
import FormAdmin from "contents/Master/Admin/Form";
import ProfileOverview from "contents/Master/Admin/Overview";
import Article from "contents/Master/Article";
import FormArticle from "contents/Master/Article/Form";
import AccountBank from "contents/Master/Bank";
import FormAccountBank from "contents/Master/Bank/Form";
import Package from "contents/Master/Package";
import FormPackage from "contents/Master/Package/Form";
import Product from "contents/Master/Product";
import FormProduct from "contents/Master/Product/Form";
import ProductCategory from "contents/Master/ProductCategory";
import FormProductCategory from "contents/Master/ProductCategory/Form";

const routes = [
  // ==========================================================================================
  // {
  //   type: "collapse",
  //   name: "Brooklyn Alice",
  //   index: true,
  //   key: "brooklyn-alice",
  //   icon: <MDAvatar src={profilePicture} alt="Brooklyn Alice" size="sm" />,
  //   collapse: [
  //     {
  //       name: "My Profile",
  //       key: "my-profile",
  //       route: "/pages/profile/profile-overview",
  //       component: <ProfileOverview />,
  //     },
  //     {
  //       name: "Settings",
  //       key: "profile-settings",
  //       route: "/pages/account/settings",
  //       component: <Settings />,
  //     },
  //     {
  //       name: "Logout",
  //       key: "logout",
  //       route: "/authentication/sign-in/basic",
  //       component: <SignInBasic />,
  //     },
  //   ],
  // },
  // { type: "divider", key: "divider-0" },
  // {
  //   type: "collapse",
  //   name: "Dashboards",
  //   key: "dashboards",
  //   icon: <Icon fontSize="medium">dashboard</Icon>,
  //   collapse: [
  //     {
  //       name: "Analytics",
  //       key: "analytics",
  //       route: "/dashboards/analytics",
  //       component: <Analytics />,
  //     },
  //     {
  //       name: "Sales",
  //       key: "sales",
  //       route: "/dashboards/sales",
  //       component: <Sales />,
  //     },
  //   ],
  // },
  // { type: "title", title: "Pages", key: "title-pages" },
  // {
  //   type: "collapse",
  //   name: "Pages",
  //   key: "pages",
  //   icon: <Icon fontSize="medium">image</Icon>,
  //   collapse: [
  //     {
  //       name: "Profile",
  //       key: "profile",
  //       collapse: [
  //         {
  //           name: "Profile Overview",
  //           key: "profile-overview",
  //           route: "/pages/profile/profile-overview",
  //           component: <ProfileOverview />,
  //         },
  //         {
  //           name: "All Projects",
  //           key: "all-projects",
  //           route: "/pages/profile/all-projects",
  //           component: <AllProjects />,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Users",
  //       key: "users",
  //       collapse: [
  //         {
  //           name: "New User",
  //           key: "new-user",
  //           route: "/pages/users/new-user",
  //           component: <NewUser />,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Account",
  //       key: "account",
  //       collapse: [
  //         {
  //           name: "Settings",
  //           key: "settings",
  //           route: "/pages/account/settings",
  //           component: <Settings />,
  //         },
  //         {
  //           name: "Billing",
  //           key: "billing",
  //           route: "/pages/account/billing",
  //           component: <Billing />,
  //         },
  //         {
  //           name: "Invoice",
  //           key: "invoice",
  //           route: "/pages/account/invoice",
  //           component: <Invoice />,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Projects",
  //       key: "projects",
  //       collapse: [
  //         {
  //           name: "Timeline",
  //           key: "timeline",
  //           route: "/pages/projects/timeline",
  //           component: <Timeline />,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Pricing Page",
  //       key: "pricing-page",
  //       route: "/pages/pricing-page",
  //       component: <PricingPage />,
  //     },
  //     { name: "RTL", key: "rtl", route: "/pages/rtl", component: <RTL /> },
  //     { name: "Widgets", key: "widgets", route: "/pages/widgets", component: <Widgets /> },
  //     { name: "Charts", key: "charts", route: "/pages/charts", component: <Charts /> },
  //     {
  //       name: "Notfications",
  //       key: "notifications",
  //       route: "/pages/notifications",
  //       component: <Notifications />,
  //     },
  //   ],
  // },
  // {
  //   type: "collapse",
  //   name: "Applications",
  //   key: "applications",
  //   icon: <Icon fontSize="medium">apps</Icon>,
  //   collapse: [
  //     {
  //       name: "Kanban",
  //       key: "kanban",
  //       route: "/applications/kanban",
  //       component: <Kanban />,
  //     },
  //     {
  //       name: "Wizard",
  //       key: "wizard",
  //       route: "/applications/wizard",
  //       component: <Wizard />,
  //     },
  //     {
  //       name: "Data Tables",
  //       key: "data-tables",
  //       route: "/applications/data-tables",
  //       component: <DataTables />,
  //     },
  //     {
  //       name: "Calendar",
  //       key: "calendar",
  //       route: "/applications/calendar",
  //       component: <Calendar />,
  //     },
  //   ],
  // },
  // {
  //   type: "collapse",
  //   name: "Ecommerce",
  //   key: "ecommerce",
  //   icon: <Icon fontSize="medium">shopping_basket</Icon>,
  //   collapse: [
  //     {
  //       name: "Products",
  //       key: "products",
  //       collapse: [
  //         {
  //           name: "New Product",
  //           key: "new-product",
  //           route: "/ecommerce/products/new-product",
  //           component: <NewProduct />,
  //         },
  //         {
  //           name: "Edit Product",
  //           key: "edit-product",
  //           route: "/ecommerce/products/edit-product",
  //           component: <EditProduct />,
  //         },
  //         {
  //           name: "Product Page",
  //           key: "product-page",
  //           route: "/ecommerce/products/product-page",
  //           component: <ProductPage />,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Orders",
  //       key: "orders",
  //       collapse: [
  //         {
  //           name: "Order List",
  //           key: "order-list",
  //           route: "/ecommerce/orders/order-list",
  //           component: <OrderList />,
  //         },
  //         {
  //           name: "Order Details",
  //           key: "order-details",
  //           route: "/ecommerce/orders/order-details",
  //           component: <OrderDetails />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: "collapse",
  //   name: "Authentication",
  //   key: "authentication",
  //   icon: <Icon fontSize="medium">content_paste</Icon>,
  //   collapse: [
  //     {
  //       name: "Sign In",
  //       key: "sign-in",
  //       collapse: [
  //         {
  //           name: "Basic",
  //           key: "basic",
  //           route: "/authentication/sign-in/basic",
  //           component: <SignInBasic />,
  //         },
  //         {
  //           name: "Cover",
  //           key: "cover",
  //           route: "/authentication/sign-in/cover",
  //           component: <SignInCover />,
  //         },
  //         {
  //           name: "Illustration",
  //           key: "illustration",
  //           route: "/authentication/sign-in/illustration",
  //           component: <SignInIllustration />,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Sign Up",
  //       key: "sign-up",
  //       collapse: [
  //         {
  //           name: "Cover",
  //           key: "cover",
  //           route: "/authentication/sign-up/cover",
  //           component: <SignUpCover />,
  //         },
  //       ],
  //     },
  //     {
  //       name: "Reset Password",
  //       key: "reset-password",
  //       collapse: [
  //         {
  //           name: "Cover",
  //           key: "cover",
  //           route: "/authentication/reset-password/cover",
  //           component: <ResetCover />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // { type: "divider", key: "divider-1" },
  // { type: "title", title: "Docs", key: "title-docs" },
  // {
  //   type: "collapse",
  //   name: "Basic",
  //   key: "basic",
  //   icon: <Icon fontSize="medium">upcoming</Icon>,
  //   collapse: [
  //     {
  //       name: "Getting Started",
  //       key: "getting-started",
  //       collapse: [
  //         {
  //           name: "Overview",
  //           key: "overview",
  //           href: "https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/",
  //         },
  //         {
  //           name: "License",
  //           key: "license",
  //           href: "https://www.creative-tim.com/learning-lab/react/license/material-dashboard/",
  //         },
  //         {
  //           name: "Quick Start",
  //           key: "quick-start",
  //           href: "https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/",
  //         },
  //         {
  //           name: "Build Tools",
  //           key: "build-tools",
  //           href: "https://www.creative-tim.com/learning-lab/react/build-tools/material-dashboard/",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Foundation",
  //       key: "foundation",
  //       collapse: [
  //         {
  //           name: "Colors",
  //           key: "colors",
  //           href: "https://www.creative-tim.com/learning-lab/react/colors/material-dashboard/",
  //         },
  //         {
  //           name: "Grid",
  //           key: "grid",
  //           href: "https://www.creative-tim.com/learning-lab/react/grid/material-dashboard/",
  //         },
  //         {
  //           name: "Typography",
  //           key: "base-typography",
  //           href: "https://www.creative-tim.com/learning-lab/react/base-typography/material-dashboard/",
  //         },
  //         {
  //           name: "Borders",
  //           key: "borders",
  //           href: "https://www.creative-tim.com/learning-lab/react/borders/material-dashboard/",
  //         },
  //         {
  //           name: "Box Shadows",
  //           key: "box-shadows",
  //           href: "https://www.creative-tim.com/learning-lab/react/box-shadows/material-dashboard/",
  //         },
  //         {
  //           name: "Functions",
  //           key: "functions",
  //           href: "https://www.creative-tim.com/learning-lab/react/functions/material-dashboard/",
  //         },
  //         {
  //           name: "Routing System",
  //           key: "routing-system",
  //           href: "https://www.creative-tim.com/learning-lab/react/routing-system/material-dashboard/",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: "collapse",
  //   name: "Components",
  //   key: "components",
  //   icon: <Icon fontSize="medium">view_in_ar</Icon>,
  //   collapse: [
  //     {
  //       name: "Alerts",
  //       key: "alerts",
  //       href: "https://www.creative-tim.com/learning-lab/react/alerts/material-dashboard/",
  //     },
  //     {
  //       name: "Avatar",
  //       key: "avatar",
  //       href: "https://www.creative-tim.com/learning-lab/react/avatar/material-dashboard/",
  //     },
  //     {
  //       name: "Badge",
  //       key: "badge",
  //       href: "https://www.creative-tim.com/learning-lab/react/badge/material-dashboard/",
  //     },
  //     {
  //       name: "Badge Dot",
  //       key: "badge-dot",
  //       href: "https://www.creative-tim.com/learning-lab/react/badge-dot/material-dashboard/",
  //     },
  //     {
  //       name: "Box",
  //       key: "box",
  //       href: "https://www.creative-tim.com/learning-lab/react/box/material-dashboard/",
  //     },
  //     {
  //       name: "Buttons",
  //       key: "buttons",
  //       href: "https://www.creative-tim.com/learning-lab/react/buttons/material-dashboard/",
  //     },
  //     {
  //       name: "Date Picker",
  //       key: "date-picker",
  //       href: "https://www.creative-tim.com/learning-lab/react/datepicker/material-dashboard/",
  //     },
  //     {
  //       name: "Dropzone",
  //       key: "dropzone",
  //       href: "https://www.creative-tim.com/learning-lab/react/dropzone/material-dashboard/",
  //     },
  //     {
  //       name: "Editor",
  //       key: "editor",
  //       href: "https://www.creative-tim.com/learning-lab/react/quill/material-dashboard/",
  //     },
  //     {
  //       name: "Input",
  //       key: "input",
  //       href: "https://www.creative-tim.com/learning-lab/react/input/material-dashboard/",
  //     },
  //     {
  //       name: "Pagination",
  //       key: "pagination",
  //       href: "https://www.creative-tim.com/learning-lab/react/pagination/material-dashboard/",
  //     },
  //     {
  //       name: "Progress",
  //       key: "progress",
  //       href: "https://www.creative-tim.com/learning-lab/react/progress/material-dashboard/",
  //     },
  //     {
  //       name: "Snackbar",
  //       key: "snackbar",
  //       href: "https://www.creative-tim.com/learning-lab/react/snackbar/material-dashboard/",
  //     },
  //     {
  //       name: "Social Button",
  //       key: "social-button",
  //       href: "https://www.creative-tim.com/learning-lab/react/social-buttons/material-dashboard/",
  //     },
  //     {
  //       name: "Typography",
  //       key: "typography",
  //       href: "https://www.creative-tim.com/learning-lab/react/typography/material-dashboard/",
  //     },
  //   ],
  // },
  // {
  //   type: "collapse",
  //   name: "Change Log",
  //   key: "changelog",
  //   href: "https://github.com/creativetimofficial/ct-material-dashboard-pro-react/blob/main/CHANGELOG.md",
  //   icon: <Icon fontSize="medium">receipt_long</Icon>,
  //   noCollapse: true,
  // },

  // ============================================= DASHBOARD =============================================
  {
    type: "collapse",
    name: "Dashboard",
    index: true,
    key: "dashboard",
    route: "/dashboard",
    icon: <Icon fontSize="medium">home</Icon>,
    component: <Dashboard />,
    noCollapse: true,
  },

  // ============================================= SETTINGS =============================================
  {
    type: "collapse",
    name: "Setting",
    key: "setting",
    route: "/setting",
    icon: <Icon fontSize="medium">settingsApplication</Icon>,
    collapse: [
      {
        name: "Account",
        key: "account",
        route: "/setting/account",
        component: <Container />,
      },
      {
        name: "Bank",
        key: "bank",
        route: "/setting/bank",
        component: <Container />,
      },
      {
        name: "Pofile Perusahaan",
        key: "company",
        route: "/setting/company",
        component: <Container />,
      },
      {
        name: "Tesrimonial",
        key: "testimoni",
        route: "/setting/testimoni",
        component: <Container />,
      },
      {
        name: "Web Config",
        key: "web",
        route: "/setting/web",
        component: <Container />,
      },
    ],
  },

  // ============================================= MASTER =============================================
  {
    type: "collapse",
    name: "Master",
    key: "master",
    route: "/master",
    icon: <Icon fontSize="medium">source</Icon>,
    collapse: [
      // ====================== admin ======================
      {
        name: "Admin",
        key: "admin",
        route: "/master/admin",
        component: <Admin />,
      },
      {
        name: "Tambah Admin",
        key: "add-admin",
        route: "/master/admin/add",
        component: <FormAdmin />,
      },
      {
        name: "Edit Admin",
        key: "edit-admin",
        route: "/master/admin/edit/:id",
        component: <FormAdmin />,
      },
      {
        name: "Detail Admin",
        key: "detail-admin",
        route: "/master/admin/detail/:id",
        component: <ProfileOverview />,
      },
      // ====================== article ======================
      {
        name: "Artikel",
        key: "article",
        route: "/master/article",
        component: <Article />,
      },
      {
        name: "Tambah Artikel",
        key: "add-article",
        route: "/master/article/add",
        component: <FormArticle />,
      },
      {
        name: "Edit Artikel",
        key: "edit-article",
        route: "/master/article/edit/:id",
        component: <FormArticle />,
      },
      {
        name: "Detail Artikel",
        key: "detail-article",
        route: "/master/article/detail/:id",
        component: <FormArticle />,
      },
      // ====================== bank ======================
      {
        name: "Bank",
        key: "bank",
        route: "/master/bank",
        component: <AccountBank />,
      },
      {
        name: "Tambah Bank",
        key: "add-bank",
        route: "/master/bank/add",
        component: <FormAccountBank />,
      },
      {
        name: "Edit Bank",
        key: "edit-bank",
        route: "/master/bank/edit/:id",
        component: <FormAccountBank />,
      },
      // ====================== package ======================
      {
        name: "Paket",
        key: "package",
        route: "/master/package",
        component: <Package />,
      },
      {
        name: "Tambah Paket",
        key: "add-package",
        route: "/master/package/add",
        component: <FormPackage />,
      },
      {
        name: "Edit Paket",
        key: "edit-package",
        route: "/master/package/edit/:id",
        component: <FormPackage />,
      },
      // ====================== product ======================
      {
        name: "Produk",
        key: "product",
        route: "/master/product",
        component: <Product />,
      },
      {
        name: "Tambah Produk",
        key: "add-product",
        route: "/master/product/add",
        component: <FormProduct />,
      },
      {
        name: "Edit Produk",
        key: "edit-product",
        route: "/master/product/edit/:id",
        component: <FormProduct />,
      },
      // ====================== product-category ======================
      {
        name: "Kategori Produk",
        key: "product-category",
        route: "/master/product-category",
        component: <ProductCategory />,
      },
      {
        name: "Tambah Kategori Produk",
        key: "add-product-category",
        route: "/master/product-category/add",
        component: <FormProductCategory />,
      },
      {
        name: "Edit Kategori Produk",
        key: "edit-product-category",
        route: "/master/product-category/edit/:id",
        component: <FormProductCategory />,
      },
      // ====================== reward ======================
      {
        name: "Reward",
        key: "reward",
        route: "/master/reward",
        component: <Container />,
      }, // ====================== serial ======================
      {
        name: "Serial",
        key: "serial",
        route: "/master/serial",
        component: <Container />,
      },
      // ====================== stokis ======================
      {
        name: "Stokis",
        key: "stokis",
        route: "/master/stokis",
        component: <Container />,
      },
      // ====================== wabot ======================
      {
        name: "WhatsApp Bot",
        key: "wa-bot",
        route: "/master/wa-bot",
        component: <Container />,
      },
    ],
  },
];

// ============================================= MENUS =============================================
const getMenu = (user) => {
  const roleId = user.roleId;
  let menus = [
    {
      type: "collapse",
      name: "Dashboard",
      // index: true,
      key: "dashboard",
      route: "/dashboard",
      icon: <Icon fontSize="medium">home</Icon>,
      component: <Container />,
      noCollapse: true,
    },
  ];

  // ============================================= MENU SETTINGS =============================================
  const subSettingAccount = [1, 2, 3, 4].includes(roleId)
    ? [
        {
          name: "Account",
          key: "account",
          route: "/setting/account",
          component: <Container />,
        },
      ]
    : [];
  const subSettingBank = [3, 4].includes(roleId)
    ? [
        {
          name: "Bank",
          key: "bank",
          route: "/setting/bank",
          component: <Container />,
        },
      ]
    : [];
  const subSettingCompany = [1, 2].includes(roleId)
    ? [
        {
          name: "Pofile Perusahaan",
          key: "company",
          route: "/setting/company",
          component: <Container />,
        },
      ]
    : [];
  const subSettingTestimoni = [3, 4].includes(roleId)
    ? [
        {
          name: "Testominial",
          key: "testimoni",
          route: "/setting/testimoni",
          component: <Container />,
        },
      ]
    : [];
  const subSettingWebConfig = [1, 2].includes(roleId)
    ? [
        {
          name: "Web Config",
          key: "web",
          route: "/setting/web",
          component: <Container />,
        },
      ]
    : [];
  const menuSetting = [1, 2, 3, 4].includes(roleId)
    ? [
        {
          type: "collapse",
          name: "Setting",
          key: "setting",
          route: "/setting",
          icon: <Icon fontSize="medium">settingsApplication</Icon>,
          collapse: [
            ...subSettingAccount,
            ...subSettingBank,
            ...subSettingCompany,
            ...subSettingTestimoni,
            ...subSettingWebConfig,
          ],
        },
      ]
    : [];

  // ============================================= MENU MASTER =============================================
  const subMasterAdmin = [1].includes(roleId)
    ? [
        {
          name: "Admin",
          key: "admin",
          route: "/master/admin",
          component: <Admin />,
        },
      ]
    : [];
  const menuMaster = [1, 2].includes(roleId)
    ? [
        {
          type: "collapse",
          name: "Master",
          key: "master",
          route: "/master",
          icon: <Icon fontSize="medium">source</Icon>,
          collapse: [
            ...subMasterAdmin,
            {
              name: "Artikel",
              key: "article",
              route: "/master/article",
              component: <Container />,
            },
            {
              name: "Bank",
              key: "bank",
              route: "/master/bank",
              component: <Container />,
            },
            {
              name: "Paket",
              key: "package",
              route: "/master/package",
              component: <Container />,
            },
            {
              name: "Produk",
              key: "product",
              route: "/master/product",
              component: <Container />,
            },
            {
              name: "Kategori Produk",
              key: "product-category",
              route: "/master/product-category",
              component: <Container />,
            },
            {
              name: "Reward",
              key: "reward",
              route: "/master/reward",
              component: <Container />,
            },
            {
              name: "Serial",
              key: "serial",
              route: "/master/serial",
              component: <Container />,
            },
            {
              name: "Stokis",
              key: "stokis",
              route: "/master/stokis",
              component: <Container />,
            },
            {
              name: "WhatsApp Bot",
              key: "wa-bot",
              route: "/master/wa-bot",
              component: <Container />,
            },
          ],
        },
      ]
    : [];

  menus = [...menus, ...menuSetting, ...menuMaster];

  return menus;
};

export { routes, getMenu };
