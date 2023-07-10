import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// react-table components
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

import { makeStyles } from "@mui/styles";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Autocomplete } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";

import Icon from "@mui/material/Icon";

const styles = {
  rowsPerPage: {
    width: "50px",
  },
};

const useStyles = makeStyles(styles);

function Pagination(props) {
  const {
    color,
    className,
    showTotalEntries,
    pagination,
    totalButton,
    currentPage,
    totalPages,
    totalData,
    onChangePage,
  } = props;

  const [rowsPerPage, setRowsPerpage] = useState(
    props.defaultRowsPerPage
      ? props.defaultRowsPerPage
      : props.rowsPerPage
      ? props.rowsPerPage[0]
      : ""
  );

  const handleRowsPerpage = (newValue) => {
    if (newValue) {
      setRowsPerpage(newValue);
      if (props.onChangeRowsPerPage) props.onChangeRowsPerPage(newValue);
      else alert("Rows per page " + newValue);
    }
  };

  const paginationButton = () => {
    let i =
      currentPage - parseInt(totalButton / 2) < 1 ? 1 : currentPage - parseInt(totalButton / 2);
    let n =
      currentPage + parseInt(totalButton / 2) > totalPages
        ? totalPages
        : currentPage + parseInt(totalButton / 2);
    if (totalPages < totalButton) n = totalPages;
    let buttonPages = [
      {
        disabled: currentPage === 1 ? true : false,
        text: <Icon>keyboard_double_arrow_left</Icon>,
        onClick: () => onChangePage(1),
      },
    ];
    buttonPages.push({
      disabled: currentPage === 1 ? true : false,
      text: <Icon>keyboard_arrow_left</Icon>,
      onClick: () => onChangePage(currentPage - 1),
    });

    // if (currentPage > parseInt(totalButton / 2) + 1)
    // 	buttonPages.push({ disabled: true, text: "..." });
    for (i; i <= n; i++) {
      buttonPages.push({
        active: currentPage === i ? true : false,
        text: i,
        onClick: (value) => onChangePage(value),
      });
    }
    // if (currentPage < totalPages - parseInt(totalButton / 2))
    // 	buttonPages.push({ disabled: true, text: "..." });

    buttonPages.push({
      disabled: currentPage === totalPages || totalPages === 0 ? true : false,
      text: <Icon>keyboard_arrow_right</Icon>,
      onClick: () => onChangePage(currentPage + 1),
    });
    buttonPages.push({
      disabled: currentPage === totalPages || totalPages === 0 ? true : false,
      text: <Icon>keyboard_double_arrow_right</Icon>,
      onClick: () => onChangePage(totalPages),
    });

    buttonPages.push({ disabled: true, text: "Dari " + totalData });
    return buttonPages;
  };

  const pages = paginationButton();
  return (
    <MDBox
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      p={!showTotalEntries && totalPages === 1 ? 0 : 3}
    >
      {showTotalEntries && (
        <MDBox display="flex" alignItems="center">
          <Autocomplete
            disableClearable
            value={rowsPerPage}
            options={props.rowsPerPage}
            onChange={(event, newValue) => {
              handleRowsPerpage(newValue);
            }}
            getOptionLabel={(option) => {
              if (!option) return;
              return option.toString();
            }}
            size="small"
            sx={{ width: "5rem" }}
            renderInput={(params) => <MDInput {...params} />}
          />
          <MDBox ml={2}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Showing of {totalData} entries
            </MDTypography>
          </MDBox>
        </MDBox>
        // <MDBox mb={{ xs: 3, sm: 0 }}>
        // </MDBox>
      )}
      {totalPages > 1 && (
        <MDPagination
          variant={pagination.variant ? pagination.variant : "gradient"}
          color={pagination.color ? pagination.color : "info"}
        >
          {pages.map((prop, key) => {
            return (
              <MDBox key={key}>
                {prop.onClick !== undefined ? (
                  <MDPagination
                    item
                    disabled={prop.disabled}
                    onClick={() => prop.onClick(prop.text)}
                    active={prop.active}
                  >
                    {prop.text}
                  </MDPagination>
                ) : (
                  <MDTypography ml={2} variant="button" color="text">
                    {prop.text}
                  </MDTypography>
                )}
              </MDBox>
            );
          })}
        </MDPagination>
      )}
    </MDBox>
  );
}

Pagination.defaultProps = {
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalData: PropTypes.number.isRequired,
  totalButton: PropTypes.number,
  defaultRowsPerPage: PropTypes.number,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      disabled: PropTypes.bool,
      text: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.element]).isRequired,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
  rowsPerPage: PropTypes.array,
  onChange: PropTypes.func,
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "danger"]),
  showTotalEntries: PropTypes.bool,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
};

export default Pagination;
