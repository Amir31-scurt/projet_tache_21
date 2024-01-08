import { PiFilesBold, PiStudentBold } from 'react-icons/pi';
import {
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
  MdOutlineLibraryBooks,
  // MdTask,
} from 'react-icons/md';
import { TbCertificate } from 'react-icons/tb';
import { LuSettings } from 'react-icons/lu';

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
    link: '/dashboard/quizz',
  },
];

