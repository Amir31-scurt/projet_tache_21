/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ModeEditSharpIcon from '@mui/icons-material/ModeSharp';
import ArchiveSharpIcon from '@mui/icons-material/ArchiveSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import { Box, InputAdornment, TextField } from '@mui/material';

const CustomDataTable = ({ data }) => {
   // eslint-disable-next-line
  const [selectedRows, setSelectedRows] = useState([]);
  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'Nom',
      selector: 'nom',
      sortable: true,
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
    },
    {
      name: 'Domaine',
      selector: 'domaine',
      sortable: true,
    },
    {
      name: 'Mot de passe',
      selector: 'mot de passe',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: () => (
        <>
          <button
            className="btn btn-outline-info mx-1"
            onClick={() => console.log('Modifier')}
          >
            <VisibilitySharpIcon />
          </button>
          <button
            className="btn btn-outline-success mx-1"
            onClick={() => console.log('Supprimer')}
          >
            <ModeEditSharpIcon />
          </button>
          <button
            className="btn btn-outline-warning mx-1"
            onClick={() => console.log('Supprimer')}
          >
            <ArchiveSharpIcon />
          </button>
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        background: '#f1f1f1',
      },
    },
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <TextField
          id="input-with-icon-textfield"
          label="Rechercher"
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
        data={data}
        pagination
        selectableRows
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
          rowsPerPageText: 'Rows per page:',
          rangeSeparatorText: 'of',
          noRowsPerPage: false,
          selectAllRowsItem: false,
        }}
        customStyles={customStyles}
        striped
        bordered
        fixedHeader
        noHeader
      />
    </div>
  );
};

export default CustomDataTable;
