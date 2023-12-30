import { PiFilesBold, PiStudentBold } from 'react-icons/pi';
import {
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
  MdOutlineLibraryBooks,
  MdTask,
} from 'react-icons/md';
import { TbCertificate } from 'react-icons/tb';
import { LuSettings } from 'react-icons/lu';
import { FaUsers } from 'react-icons/fa';
import { PiUsersFourFill } from "react-icons/pi";
export const menuSidebar = [
  {
    title: 'Dashboard',
    icon: <MdOutlineSpaceDashboard />,
    id: 'link1',
  },
  {
    title: 'Programme',
    icon: <MdOutlineLibraryBooks />,
    id: 'link1',
    link: '/dashboard/programme',
  },
  {
    title: 'Livraison',
    icon: <PiFilesBold />,
    id: 'link2',
    link: '/dashboard/livrable',
  },
  {
    title: 'Assignation',
    icon: <MdOutlineAssignment />,
    id: 'link3',
    link: '/dashboard/assignation',
  },
  {
    title: 'Etudiants',
    icon: <PiStudentBold />,
    id: 'link4',
  },
  {
    title: 'Certificats',
    icon: <TbCertificate />,
    id: 'link5',
    link: '/dashboard/certificat',
  },
  {
    title: 'Parametre',
    icon: <LuSettings />,
    id: 'link6',
    link : '/dashboard/quizz'
  },
];

export const ContenuCardDsb = [
  {
    ChiffreCardDsb: '26',
    IconeCardDsb: (
      <FaUsers style={{ fontSize: "68px", opacity: "1", color: "#fff" }} />
    ),
    TextCardDsb: 'Professeurs',
    couleurCarte: 'CouleurA',
  },
  {
    ChiffreCardDsb: '134',
    IconeCardDsb: (
      <PiUsersFourFill  style={{ fontSize: '56px', opacity: '1', color: '#fff' }} />

    ),
    TextCardDsb: 'Etudiants',
    couleurCarte: 'CouleurB',
  },
  {
    ChiffreCardDsb: '32',
    IconeCardDsb: (
      <MdTask style={{ fontSize: '72px', opacity: '1', color: '#fff' }} />
    ),
    TextCardDsb: 'Taches',
    couleurCarte: 'CouleurC',
  },
];
