/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { Box, InputAdornment, TextField } from "@mui/material";

// Configuration du tableau
const CustomDataTable = ({ data }) => {
   // eslint-disable-next-line
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const columns = [
    {
      name: "Nom",
      selector: "role",
      sortable: true,
    },
    {
      name: "Domaine",
      selector: "domain",
      sortable: true,
    },
    {
      name: "Mention",
      selector: "mention",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
      width: "100px",
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        background: "#3084b5",
        color: "#FFFFFF",
        textAlign: "center",
      },
    },
  };

  const dataToDisplay = data.filter((item) =>
    item.role.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <TextField
          id="input-with-icon-textfield"
          label="Rechercher"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchSharpIcon />
              </InputAdornment>
            ),
          }}
          variant="filled"
        />
      </Box>
      <DataTable
        title="Liste des utilisateurs"
        columns={columns}
        data={dataToDisplay}
        customStyles={customStyles}
        pagination
        selectableRowsHighlight
        selectableRowsVisibleOnly
        onSelectedRowsChange={({ selectedRows }) =>
          setSelectedRows(selectedRows)
        }
        highlightOnHover
        responsive
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
          noRowsPerPage: false,
          selectAllRowsItem: false,
        }}
        striped
        bordered
        fixedHeader
        noHeader
      />
    </div>
  );
};

export default CustomDataTable;
