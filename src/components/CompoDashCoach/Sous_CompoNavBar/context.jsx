// Le fichier Context (creation de mon Context)

import { createContext } from "react";

const NavBarContext = createContext({ visible: false, handleChange: () => {} });

export default NavBarContext;
