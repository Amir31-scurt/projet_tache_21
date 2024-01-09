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
    // Vérifier si la valeur sélectionnée est déjà présente dans personName
     if (typeof value === "string") {
    // Si la valeur sélectionnée est déjà dans personName, la désélectionner
    if (personName.includes(value)) {
      setPersonName([]);
    } else {
      // Sinon, sélectionner la nouvelle valeur
      setPersonName([value]);
    }
  } else {
    // Pour la sélection multiple, basculez la sélection de l'étudiant cliqué
    setPersonName((prevPersonName) => {
      const index = prevPersonName.indexOf(value);
      if (index === -1) {
        return [...prevPersonName, value];
      } else {
        const updatedPersonName = [...prevPersonName];
        updatedPersonName.splice(index, 1);
        return updatedPersonName;
      }
    })};
    
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
          shrink={personName.length > 0}
        >
          {personName.length > 0 ? "" : "Sélectionnez par étudiant"}
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple={false}
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {selected && <Chip key={selected} label={selected} />}
            </Box>
            // <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            //   {selected.map((value) => (
            //     <Chip key={value} label={value} />
            //   ))}
            // </Box>
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
