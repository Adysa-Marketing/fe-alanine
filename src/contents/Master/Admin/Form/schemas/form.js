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

let form = {
  formId: "new-user-form",
  formField: {
    id: {
      name: "id",
      type: "text",
    },
    name: {
      name: "name",
      label: "Nama Lengkap",
      type: "text",
      errorMsg: "Nama Lengkap harus di isi.",
    },
    userName: {
      name: "userName",
      label: "Username",
      type: "text",
      errorMsg: "Username hasud di isi.",
    },
    phoneNumber: {
      name: "phoneNumber",
      label: "Telpon",
      type: "text",
      errorMsg: "Nomor Telpon harus di isi.",
    },
    email: {
      name: "email",
      label: "Email Address",
      type: "email",
      errorMsg: "Email address harus di isi.",
      invalidMsg: "Email address  tidak valid",
    },
    password: {
      name: "password",
      label: "Password",
      type: "password",
      errorMsg: "Password harus di isi.",
      invalidMsg: "Password minimal 5 karakter.",
    },
    confirmPassword: {
      name: "confirmPassword",
      label: "Password Confirm",
      type: "password",
      errorMsg: "Password Confirm harus di isi.",
      invalidMsg: "Password Confirm tidak sama dengan Password.",
    },
    address: {
      name: "address",
      label: "Alamat",
      type: "text",
      errorMsg: "Alamat harus di isi.",
    },
    country: {
      name: "country",
      label: "Negara",
      type: "text",
      errorMsg: "Negara harus di isi.",
    },
    province: {
      name: "province",
      label: "Provinsi",
      type: "text",
      errorMsg: "Provinsi harus di isi.",
    },
    district: {
      name: "district",
      label: "Kota / Kabupaten",
      type: "text",
      errorMsg: "Kota / Kabupaten harus di isi.",
    },
    subDistrict: {
      name: "subDistrict",
      label: "Kecamatan",
      type: "text",
      errorMsg: "Kecamatan harus di isi.",
    },
    nokk: {
      name: "nokk",
      label: "No NIK",
      type: "text",
      errorMsg: "No Nik harus diisi.",
    },
    image: {
      name: "image",
      label: "Foto",
      type: "file",
    },
    gender: {
      name: "gender",
      label: "Gender",
      type: "text",
      errorMsg: "Gender harus diisi.",
    },
    bio: {
      name: "bio",
      label: "Biodata",
      type: "text",
      errorMsg: "Biodata harus diisi.",
    },
  },
};

export default form;
