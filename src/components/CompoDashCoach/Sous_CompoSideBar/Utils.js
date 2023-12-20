import { MdOutlineLibraryBooks } from "react-icons/md";
import { PiFilesBold } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
import { PiStudentBold } from "react-icons/pi";
import { LuSettings } from "react-icons/lu";
export const menuSidebar = [
  {
    title: "Programme",
    icon: <MdOutlineLibraryBooks />,
    id: "link1",
  },
  {
    title: "Livrable",
    icon: <PiFilesBold />,
    id: "link2",
  },
  {
    title: "Assignation",
    icon: <MdOutlineAssignment />,
    id: "link3",
  },
  {
    title: "Etudiants",
    icon: <PiStudentBold />,
    id: "link4",
  },
  {
    title: "Certificats",
    icon: <TbCertificate />,
    id: "link5",
  },
  {
    title: "Parametre",
    icon: <LuSettings />,
    id: "link6",
  },
];