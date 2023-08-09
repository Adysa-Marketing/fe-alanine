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

import * as Yup from "yup";
import checkout from "contents/Master/Admin/Form/schemas/form";

let {
  formField: {
    name,
    userName,
    phoneNumber,
    email,
    password,
    confirmPassword,
    address,
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

let validations = [
  Yup.object().shape({
    [name.name]: Yup.string().required(name.errorMsg),
    [userName.name]: Yup.string()
      .matches(/^[^\s]*$/, "Username tidak boleh menggunakan spasi")
      .required(userName.errorMsg),
    [phoneNumber.name]: Yup.string()
      .matches(/^(08|628)[0-9]{9,13}$/, "Nomor telpon tidak valid")
      .required(phoneNumber.errorMsg),
    [email.name]: Yup.string().required(email.errorMsg).email(email.invalidMsg),
    [password.name]: Yup.string().required(password.errorMsg).min(5, password.invalidMsg),
    [confirmPassword.name]: Yup.string()
      .required(confirmPassword.errorMsg)
      .oneOf([Yup.ref("password"), null], confirmPassword.invalidMsg),
  }),
  Yup.object().shape({
    [address.name]: Yup.string().required(address.errorMsg),
    [country.name]: Yup.object().required(country.errorMsg),
    [province.name]: Yup.object().required(province.errorMsg),
    [district.name]: Yup.object().required(district.errorMsg),
    [subDistrict.name]: Yup.object().required(subDistrict.errorMsg),
  }),
  Yup.object().shape({
    [nokk.name]: Yup.string()
      .matches(/^[0-9]{16}$/, "No NIK harus 16 digit")
      .required(nokk.errorMsg),
    [image.name]: Yup.string(),
    [gender.name]: Yup.string().required(gender.errorMsg),
    [bio.name]: Yup.string().required(bio.errorMsg),
  }),
];

export default validations;
