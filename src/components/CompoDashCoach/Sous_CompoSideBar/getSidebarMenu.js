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
import { MdAssignmentAdd } from 'react-icons/md';

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
          link: '/admin/dashboard',
        },
        {
          title: 'Domaines',
          id: 'admin-link5',
          icon: <GrDomain />,
          link: '/admin/createDomaine',
        },
        {
          title: 'Assignation',
          id: 'admin-link7',
          icon: <MdAssignmentAdd />,
          link: '/admin/assignation',
        },
        {
          title: 'Certificats',
          id: 'admin-link6',
          icon: <PiCertificateDuotone />,
          link: '/admin/certificats',
        },
        // ... other admin specific items
      ];
    } else if (isCoach) {
      return [
        {
          title: 'Dashboard',
          icon: <MdOutlineSpaceDashboard />,
          id: 'link1',
          link: '/coach/dashboard',
        },
        {
          title: 'Programme',
          icon: <MdOutlineLibraryBooks />,
          id: 'link2',
          link: '/coach/programme',
        },
        {
          title: 'Livraison',
          icon: <PiFilesBold />,
          id: 'link3',
          link: '/coach/livrable',
        },
        {
          title: 'Bulletin',
          icon: <TbCertificate />,
          id: 'link6',
          link: '/coach/certificat',
        },
      ];
    } else if (isStudent) {
      // Return regular user menu items
      return [
        {
          title: 'Dashboard',
          icon: <MdOutlineSpaceDashboard />,
          id: 'link1',
          link: 'etudiant/dashboard',
        },
        {
          title: 'Programme',
          icon: <MdOutlineLibraryBooks />,
          id: 'link1',
          link: 'etudiant/programme-apprenant',
        },
        {
          title: 'Livraison',
          icon: <PiFilesBold />,
          id: 'link2',
          link: 'etudiant/livrable',
        },
        {
          title: 'Certificats',
          icon: <TbCertificate />,
          id: 'link5',
          link: 'etudiant/certificat',
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
    <div className="mx-4 holder">
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
