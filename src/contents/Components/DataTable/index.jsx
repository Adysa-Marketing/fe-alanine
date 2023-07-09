import { useMemo, useEffect, useState } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
// react-table components
import { useTable, useGlobalFilter, useSortBy } from "react-table";

import { makeStyles } from "@mui/styles";
// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";

const useStyles = makeStyles({
  stickyHeader: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    backgroundColor: "#f9fafb",
  },
  columnHead: {
    color: "#000 !important",
    fontWeight: "bold",
    fontSize: "12px !important",
  },
});

function DataTable(props) {
  const classes = useStyles();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { isLoading, isSorted, noEndBorder, tableHead, tableData, tableFoot } = props;

  const columnData = useMemo(() => tableHead, [tableHead]);
  const rowData = useMemo(() => tableData, [tableData]);
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow, page } =
    useTable(
      {
        columns: columnData,
        data: rowData,
        initialState: { pageIndex: 0 },
      },
      useGlobalFilter,
      useSortBy
    );

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  return (
    <TableContainer sx={{ boxShadow: "none", maxHeight: 530 }}>
      {isLoading ? (
        <LoaderTable open={isLoading} />
      ) : (
        <Table {...getTableProps()}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup, key) => (
              <TableRow
                key={key}
                className={classes.stickyHeader}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, idx) => (
                  <DataTableHeadCell
                    key={idx}
                    {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                    className={darkMode ? classes.columnHead : null}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "left"}
                    sorted={setSortedValue(column)}
                  >
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, key) => {
              prepareRow(row);
              return (
                <TableRow key={key} {...row.getRowProps()}>
                  {row.cells.map((cell, idx) => (
                    <DataTableBodyCell
                      key={idx}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
          {tableFoot && (
            <MDBox component="tfoot">
              {footerGroups.map((footerGroup, key) => (
                <TableRow
                  key={key}
                  className={classes.stickyHeader}
                  {...footerGroup.getFooterGroupProps()}
                >
                  {footerGroup.headers.map((column, key) => (
                    <DataTableHeadCell
                      key={key}
                      {...column.getFooterProps()}
                      className={darkMode ? classes.columnHead : null}
                      width={column.width ? column.width : "auto"}
                      align={column.align ? column.align : "left"}
                    >
                      {column.render("Footer")}
                    </DataTableHeadCell>
                  ))}
                </TableRow>
              ))}
            </MDBox>
          )}
        </Table>
      )}
    </TableContainer>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  // canSearch: false,
  isSorted: true,
  noEndBorder: false,
};

DataTable.propTypes = {
  // onSearchPage: PropTypes.func,
  tableHead: PropTypes.array,
  tableData: PropTypes.array,
  tableFoot: PropTypes.bool,
  // canSearch: PropTypes.bool,
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default DataTable;

function LoaderTable({ color }) {
  return (
    <MDBox display="flex" justifyContent="center">
      <CircularProgress color="secondary" />
    </MDBox>
  );
}

LoaderTable.defaultProps = {
  color: "primary",
};

// Typechecking props of the Loader
LoaderTable.propTypes = {
  color: PropTypes.string,
};
