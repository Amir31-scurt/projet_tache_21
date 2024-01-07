import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../config/firebase-config';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP =8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function FilterStudents() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [students, setStudents] = useState([]);

  const loadStudents = useCallback(() => {
    const unsubscribe = onSnapshot(collection(db, 'utilisateurs'), (snapshot) => {
      const updatedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(updatedUsers);
    });

    return () => {
      // Nettoyez le listener lors du démontage du composant
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <div className="d-flex flex-wrap justify-content-end mx-2 mt-5">
      <FormControl
        sx={{ m: 1, width: 300 }}
        className="filterStudent  border-0"
      >
        <InputLabel
          id="demo-multiple-chip-label"
          className="text-white norder-0"
        >
          Filtrer par étudiant
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {students.filter((user) => user.role === "Étudiant").map((name) => (
            <MenuItem
              key={name}
              value={name.name}
              style={getStyles(name.name, personName, theme)}
            >
              {name.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
