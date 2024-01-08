// import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import Chip from '@mui/material/Chip';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP =8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// const names = [
//   'Serigne Mourtalla Syll',
//   'Oliver Hansen',
//   'Van Henry',
//   'April Tucker',
//   'Ralph Hubbard',
//   'Omar Alexander',
//   'Carlos Abbott',
//   'Miriam Wagner',
//   'Bradley Wilkerson',
//   'Virginia Andrews',
//   'Kelly Snyder',
// ];

// function getStyles(name, personName, theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

// export default function FilterStudents() {
//   const theme = useTheme();
//   const [personName, setPersonName] = React.useState([]);

//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setPersonName(
//       // On autofill we get a stringified value.
//       typeof value === 'string' ? value.split(',') : value
//     );
//   };

//   return (
//     <div className="d-flex flex-wrap justify-content-end mx-2 mt-5">
//       <FormControl
//         sx={{ m: 1, width: 300 }}
//         className="filterStudent  border-0"
//       >
//         <InputLabel
//           id="demo-multiple-chip-label"
//           className="text-white norder-0"
//         >
//           Selectionnez par étudiant
//         </InputLabel>
//         <Select
//           labelId="demo-multiple-chip-label"
//           id="demo-multiple-chip"
//           multiple
//           value={personName}
//           onChange={handleChange}
//           input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
//           renderValue={(selected) => (
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               {selected.map((value) => (
//                 <Chip key={value} label={value} />
//               ))}
//             </Box>
//           )}
//           MenuProps={MenuProps}
//         >
//           {names.map((name) => (
//             <MenuItem
//               key={name}
//               value={name}
//               style={getStyles(name, personName, theme)}
//             >
//               {name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useCallback, useState, useEffect} from "react";
import Chip from "@mui/material/Chip";
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection, getDocs } from "firebase/firestore";
import { log } from "util";



const firebaseConfig = {
  apiKey: "AIzaSyCCtNZzWXbYO14laq7FpInNfK5Y8Oslqw4",
  authDomain: "tache21-c134b.firebaseapp.com",
  projectId: "tache21-c134b",
  storageBucket: "tache21-c134b.appspot.com",
  messagingSenderId: "325530473681",
  appId: "1:325530473681:web:9096dc86660f089e0a21f0",
  measurementId: "G-4T02XMFXF2",
};

const app = initializeApp(firebaseConfig);
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
console.log(studentNames.filter((user) => user.role === "Étudiant"));
  return (
    <div className="d-flex flex-wrap justify-content-end mx-2 mt-5">
      <FormControl sx={{ m: 1, width: 300 }} className="filterStudent border-0">
        <InputLabel
          id="demo-multiple-chip-label"
          className="text-white border-0"
        >
          Sélectionnez par étudiant
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
          {studentNames.filter((user) => user.role === 'Étudiant').map((name) => (
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
