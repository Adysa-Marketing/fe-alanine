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

import checkout from "contents/Master/Admin/Form/schemas/form";

let {
  formField: {
    id,
    name,
    userName,
    phoneNumber,
    email,
    password,
    confirmPassword,
    address,
    address2,
    country,
    province,
    district,
    subDistrict,
    nokk,
    image,
    gender,
    bio,
  },
} = checkout;

let initialValues = {
  [id.name]: "",
  [name.name]: "",
  [userName.name]: "",
  [phoneNumber.name]: "",
  [email.name]: "",
  [password.name]: "",
  [confirmPassword.name]: "",
  [address.name]: "",
  [country.name]: "",
  [province.name]: "",
  [district.name]: "",
  [subDistrict.name]: "",
  [nokk.name]: "",
  [image.name]: "",
  [gender.name]: "",
  [bio.name]: "",
};

export default initialValues;
