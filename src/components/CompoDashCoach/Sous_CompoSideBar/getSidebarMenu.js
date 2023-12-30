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
import { fetchAdminEmails } from '../../../utils/fetchAdminEmails';
import React, { useContext, useState, useEffect } from 'react';
import { EmailContext } from '../../../contexte/EmailContexte';
import { fetchCoachEmails } from '../../../utils/fetchCoachEmails';
import { fetchStudentEmails } from '../../../utils/fetchStudentEmails';
import SidebarCompo from './SidebarCompo';
import { Placeholder } from 'rsuite';
import { width } from '@mui/system';
import { BsFillSignIntersectionFill } from 'react-icons/bs';

export const GetSidebarMenu = () => {
  const { email } = useContext(EmailContext);
  const [adminEmails, setAdminEmails] = useState([]);
  const [coachEmails, setCoachEmails] = useState([]);
  const [studentEmails, setStudentEmails] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getEmails = async () => {
      const admins = await fetchAdminEmails();
      const coaches = await fetchCoachEmails();
      const students = await fetchStudentEmails();
      setAdminEmails(admins);
      setCoachEmails(coaches);
      setStudentEmails(students);
      setIsReady(true);
    };

    getEmails();
  }, []);

  const isAdmin = adminEmails.includes(email);
  const isCoach = coachEmails.includes(email);
  const isStudent = studentEmails.includes(email);

  const getMenuItems = () => {
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
          title: 'Domaines',
          id: 'admin-link5',
          icon: <GrDomain />,
          link: '/dashboard/createDomaine',
        },
        {
          title: 'Utilisateurs',
          id: 'admin-link3',
          icon: <PiStudent />,
          link: '/dashboard/etudiants',
        },
        {
          title: 'Inscription',
          id: 'admin-link7',
          icon: <BsFillSignIntersectionFill />,
          link: '/dashboard/inscription',
        },
        // {
        //   title: 'Assignation',
        //   icon: <RiMiniProgramFill />,
        //   id: 'admin-link2',
        //   link: '/dashboard/table',
        // },
        {
          title: 'Certificats',
          id: 'admin-link6',
          icon: <PiCertificateDuotone />,
          link: '/dashboard/admin',
        },
        // ... other admin specific items
      ];
    } else if (isCoach) {
      return [
        {
          title: 'Dashboard',
          icon: <MdOutlineSpaceDashboard />,
          id: 'link1',
          link: '/dashboard/coach',
        },
        {
          title: 'Programme',
          icon: <MdOutlineLibraryBooks />,
          id: 'link2',
          link: '/dashboard/programme',
        },
        {
          title: 'Livrable',
          icon: <PiFilesBold />,
          id: 'link3',
          link: '/dashboard/livrable',
        },
        {
          title: 'Assignation',
          icon: <MdOutlineAssignment />,
          id: 'link4',
          link: '/dashboard/assignation',
        },
        {
          title: 'Etudiants',
          icon: <PiStudentBold />,
          id: 'link5',
          link: '/dashboard/coach',
        },
        {
          title: 'Certificats',
          icon: <TbCertificate />,
          id: 'link6',
          link: '/dashboard/certificat',
        },
        {
          title: 'Parametre',
          icon: <LuSettings />,
          id: 'link7',
          link: '/dashboard/coach',
        },
      ];
    } else if (isStudent) {
      // Return regular user menu items
      return [
        {
          title: 'Dashboard',
          icon: <MdOutlineSpaceDashboard />,
          id: 'link1',
          link: '/dashboard',
        },
        {
          title: 'Programme',
          icon: <MdOutlineLibraryBooks />,
          id: 'link1',
          link: 'programme-apprenant',
        },
        {
          title: 'Livrable',
          icon: <PiFilesBold />,
          id: 'link2',
          link: 'livrable',
        },
        {
          title: 'Certificats',
          icon: <TbCertificate />,
          id: 'link5',
          link: 'certificat',
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
  const menuItems = getMenuItems();
  return isReady ? (
    <div id="contentSidebar">
      {menuItems.map((item, index) => (
        <SidebarCompo key={index} {...item} />
      ))}
    </div>
  ) : (
    <div className="mx-4 d-flex gap-3 flex-column">
      <Placeholder.Paragraph
        style={{ marginTop: 30 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30 }}
        rows={1}
        graph="square"
        active
      />
    </div>
  );
};
