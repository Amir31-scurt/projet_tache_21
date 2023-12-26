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
import { LiaUsersSolid } from 'react-icons/lia';
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
    title: 'Livrable',
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
  },
];

export const ContenuCardDsb = [
  {
    ChiffreCardDsb: '26',
    IconeCardDsb: (
      <FaUsers style={{ fontSize: '68px', opacity: '0.6', color: '#432705' }} />
    ),
    TextCardDsb: 'Professeurs',
    couleurCarte: 'CouleurA',
  },
  {
    ChiffreCardDsb: '134',
    IconeCardDsb: (
      <LiaUsersSolid
        style={{ fontSize: '56px', opacity: '0.6', color: '#432705' }}
      />
    ),
    TextCardDsb: 'Etudiants',
    couleurCarte: 'CouleurB',
  },
  {
    ChiffreCardDsb: '32',
    IconeCardDsb: (
      <MdTask style={{ fontSize: '72px', opacity: '0.6', color: '#432705' }} />
    ),
    TextCardDsb: 'Taches',
    couleurCarte: 'CouleurC',
  },
];
