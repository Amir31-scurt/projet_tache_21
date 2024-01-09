import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useCallback, useEffect} from "react";
import Chip from "@mui/material/Chip";
  import { getFirestore, onSnapshot, collection} from "firebase/firestore";




const db = getFirestore();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FilterStudents() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [studentNames, setStudentNames] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

   const loadUsers = useCallback(() => {
     const unsubscribe = onSnapshot(collection(db, "utilisateurs"), (snapshot) => {
       const updatedUsers = snapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
       }));
       setStudentNames(updatedUsers);
     });

     return () => {
       // Nettoyez le listener lors du démontage du composant
       unsubscribe();
     };
   }, []);
   useEffect(() => {
     loadUsers();
   }, [loadUsers]);
  return (
    <div className="d-flex flex-wrap justify-content-end mx-2 mt-5">
      <FormControl sx={{ m: 1, width: 300 }} className="filterStudent border-0">
        <InputLabel
          id="demo-multiple-chip-label"
          className="text-white border-0"
          shrink={personName.length > 0}
        >
          {personName.length > 0 ? "" : "Filtrez par étudiant"}
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          
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
          {studentNames
            .filter((user) => user.role === "Étudiant")
            .map((name) => (
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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
