import { PiFilesBold, PiStudentBold } from 'react-icons/pi';
import {
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
  MdOutlineLibraryBooks,
  MdTask,
} from 'react-icons/md';
import { TbCertificate } from 'react-icons/tb';
import { LuSettings } from 'react-icons/lu';
export const getSidebarMenu = (email) => {
  const adminEmails = ['admin1@gmail.com'];
  const isAdmin = adminEmails.includes(email);

  if (isAdmin) {
    // Return admin specific menu items
    return [
      // Admin specific menu items here
      {
        title: 'Admin Dashboard',
        id: 'admin-link1',
        link: '/dashboard/admin',
      },
      {
        title: 'Programmes',
        id: 'admin-link1',
        link: '/dashboard/table',
      },
      {
        title: 'Tableau des Etudiants',
        id: 'admin-link1',
        link: '/dashboard/etudiants',
      },
      {
        title: 'Tableau des Coachs',
        id: 'admin-link1',
        link: '/dashboard/coachs',
      },
      {
        title: 'Création des domaines',
        id: 'admin-link1',
        link: '/dashboard/table',
      },
      {
        title: 'Certificats',
        id: 'admin-link1',
        link: '/dashboard/admin',
      },
      // ... other admin specific items
    ];
  } else {
    // Return regular user menu items
    return [
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
      // ... other items for regular users
    ];
  }
};
