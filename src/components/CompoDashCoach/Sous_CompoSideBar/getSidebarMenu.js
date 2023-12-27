import { PiFilesBold, PiStudentBold } from 'react-icons/pi';
import {
  MdOutlineAssignment,
  MdOutlineSpaceDashboard,
  MdOutlineLibraryBooks,
  MdTask,
} from 'react-icons/md';
import { TbCertificate } from 'react-icons/tb';
import { LuSettings } from 'react-icons/lu';
import { RiMiniProgramFill } from 'react-icons/ri';
import { PiStudent } from 'react-icons/pi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { GrDomain } from 'react-icons/gr';
import { PiCertificateDuotone } from 'react-icons/pi';

export const getSidebarMenu = (email) => {
  const adminEmails = ['admin1@gmail.com'];
  const coachEmails = ['coach1@gmail.com']; // Example coach emails
  const isAdmin = adminEmails.includes(email);
  const isCoach = coachEmails.includes(email);

  if (isAdmin) {
    // Return admin specific menu items
    return [
      // Admin specific menu items here
      {
        title: 'Dashboard',
        icon: <MdOutlineSpaceDashboard />,
        id: 'admin-link1',
        link: '/dashboard/admin',
      },
      {
        title: 'Programmes',
        icon: <RiMiniProgramFill />,
        id: 'admin-link1',
        link: '/dashboard/table',
      },
      {
        title: 'Tab. Etudiants',
        id: 'admin-link1',
        icon: <PiStudent />,
        link: '/dashboard/etudiants',
      },
      {
        title: 'Tab. Coachs',
        id: 'admin-link1',
        icon: <FaChalkboardTeacher />,
        link: '/dashboard/coachs',
      },
      {
        title: 'Domaines',
        id: 'admin-link1',
        icon: <GrDomain />,
        link: '/dashboard/table',
      },
      {
        title: 'Certificats',
        id: 'admin-link1',
        icon: <PiCertificateDuotone />,
        link: '/dashboard/admin',
      },
      // ... other admin specific items
    ];
  } else if (isCoach) {
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
