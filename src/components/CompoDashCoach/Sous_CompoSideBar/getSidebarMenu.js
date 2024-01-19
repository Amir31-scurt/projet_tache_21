import { PiFilesBold } from 'react-icons/pi';
import { MdOutlineSpaceDashboard, MdOutlineLibraryBooks } from 'react-icons/md';
import { TbCertificate } from 'react-icons/tb';
import { GrDomain } from 'react-icons/gr';
import { PiCertificateDuotone } from 'react-icons/pi';
import { fetchAdminEmails } from '../../../utils/fetchAdminEmails';
import React, { useContext, useState, useEffect } from 'react';
import { EmailContext } from '../../../contexte/EmailContexte';
import { fetchCoachEmails } from '../../../utils/fetchCoachEmails';
import { fetchStudentEmails } from '../../../utils/fetchStudentEmails';
import SidebarCompo from './SidebarCompo';
import { Placeholder } from 'rsuite';
import { MdAssignmentAdd } from 'react-icons/md';
import { db } from '../../../config/firebase-config'; // Update this path according to your project structure
import { collection, query, where, getDocs } from 'firebase/firestore';

export const GetSidebarMenu = () => {
  const { email } = useContext(EmailContext);
  const [adminEmails, setAdminEmails] = useState([]);
  const [coachEmails, setCoachEmails] = useState([]);
  const [studentEmails, setStudentEmails] = useState([]);
  const [studentDomaine, setStudentDomaine] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getEmails = async () => {
      // Fetch emails
      const admins = await fetchAdminEmails();
      const coaches = await fetchCoachEmails();
      const students = await fetchStudentEmails();
      setAdminEmails(admins);
      setCoachEmails(coaches);
      setStudentEmails(students);
    };
    getEmails();
    const fetchStudentDomaine = async () => {
      if (studentEmails.includes(email)) {
        const q = query(
          collection(db, 'utilisateurs'),
          where('email', '==', email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setStudentDomaine(data.domaine); // Assuming 'domaine' is the field name
        }
      }
      setIsReady(true);
    };

    fetchStudentDomaine();
  }, [studentEmails, email]);

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
          title: 'Certificat',
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
      const studentMenu = [
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
          title: 'Bulletin',
          icon: <TbCertificate />,
          id: 'link5',
          link: 'etudiant/certificat',
        },
        // ... other items for regular users
      ];
      // Dynamically add quiz link based on studentDomaine
      let quizTitle = '';
      let quizLink = '';

      switch (studentDomaine) {
        case 'Marketing':
          quizTitle = 'Quiz Marketing';
          quizLink = 'etudiant/programme-apprenant/quizmarketing';
          break;
        case 'Gestion Internationale':
          quizTitle = 'Quiz Gestion Internationale';
          quizLink = 'etudiant/programme-apprenant/quizgestioninternationale';
          break;
        case `Gestion d'entreprise`:
          quizTitle = "Quiz Gestion d'Entreprise";
          quizLink = 'etudiant/programme-apprenant/quizgestionentreprise';
          break;
        case 'Finance':
          quizTitle = 'Quiz Finance';
          quizLink = 'etudiant/programme-apprenant/quizfinance';
          break;
      }

      if (quizTitle && quizLink) {
        studentMenu.push({
          title: quizTitle,
          icon: <MdOutlineLibraryBooks />, // Use an appropriate icon
          id: 'link6',
          link: quizLink,
        });
      }

      return studentMenu;
    }
  };
  const menuItems = getMenuItems() || [];
  return isReady ? (
    <div id="contentSidebar">
      {menuItems.map((item, index) => (
        <SidebarCompo key={index} {...item} />
      ))}
    </div>
  ) : (
    <div className="mx-4 holder">
      <Placeholder.Paragraph
        style={{ marginTop: 30, opacity: 0.4 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30, opacity: 0.4 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30, opacity: 0.4 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30, opacity: 0.4 }}
        rows={1}
        graph="square"
        active
      />
      <Placeholder.Paragraph
        style={{ marginTop: 30, opacity: 0.4 }}
        rows={1}
        graph="square"
        active
      />
    </div>
  );
};
