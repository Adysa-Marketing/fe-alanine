import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Material Dashboard 2 PRO React examples
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function CTable(props) {
  const renderRows = () => {
    const textAlignColumns = props.textAlignColumns;
    const tableData = props.tableData;

    return tableData.map((item, key) => (
      <TableRow key={key}>
        {props.tableHead.map((column, idx) => {
          const row = item[idx];
          return (
            <DataTableBodyCell
              key={idx}
              width={column.width ? column.width : "auto"}
              align={textAlignColumns[idx]}
            >
              <MDTypography variant="body">{row}</MDTypography>
            </DataTableBodyCell>
          );
        })}
      </TableRow>
    ));
  };

  const tableHead = props.tableHead;
  const textAlignColumns = props.textAlignColumns;
  const height = props.height;
  const maxHeight = props.maxHeight ? props.maxHeight : 530;

  return (
    <TableContainer sx={{ boxShadow: "none", height, maxHeight }}>
      <Table>
        <MDBox component="thead">
          <TableRow sx={{ backgroundColor: "#f9fafb" }}>
            {tableHead.map((item, key) => (
              <DataTableBodyCell
                key={key}
                width={item.width ? item.width : "auto"}
                align={textAlignColumns[key]}
              >
                <MDTypography variant="caption" fontWeight="medium" textTransform="uppercase">
                  {item.name}
                </MDTypography>
              </DataTableBodyCell>
            ))}
          </TableRow>
        </MDBox>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </TableContainer>
  );
}

CTable.defaultProp = {
  tableHead: [],
  maxHeight: 530,
};

CTable.propTypes = {
  tableHead: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  textAlignColumns: PropTypes.array,
  maxHeight: PropTypes.number,
  height: PropTypes.number,
};

export default CTable;
