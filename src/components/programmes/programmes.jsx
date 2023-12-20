import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CategoryList from './Domaines';
import { Link } from 'react-router-dom';
import {
  ButtonGroup,
  Button,
  Whisper,
  Popover,
  Dropdown,
  IconButton,
} from 'rsuite';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';

// Define a reusable ProgramCard component
const ProgramCard = ({ title, description, imageUrl, buttonText }) => {
  return (
    <div className="program-card bg-light">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button>
        <Link to="/specific-cour" className="text-light text-decoration-none">
          {buttonText}
        </Link>
      </button>
    </div>
  );
};
const CourseCard = ({
  category,
  title,
  author,
  progress,
  imageUrl,
  progressColor,
}) => {
  return (
    <div className="card course-card" style={{ width: '19rem' }}>
      <div className="img-container">
        <img src={imageUrl} alt={title} className="card-img-top" />
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="text-muted">{category.name}</h6>
        <p className="card-text">{author}</p>
        <div className="progress" style={{ height: '5px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%`, backgroundColor: progressColor }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  );
};
// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   return (
//     <div className="pagination d-flex gap-3 align-items-center">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage <= 1}
//         className="btn"
//       >
//         {'<'}
//       </button>
//       <span>
//         Page {currentPage} of {totalPages}
//       </span>
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage >= totalPages}
//         className="btn"
//       >
//         {'>'}
//       </button>
//     </div>
//   );
// };

// Main component that uses ProgramCard to display a list of programs
const ProgramList = () => {
  const [action, setAction] = React.useState(0);
  const options = [
    'Create a merge commit',
    'Squash and merge',
    'Rebase and merge',
  ];
  // const [currentPage, setCurrentPage] = useState(1);
  // const pageSize = 4; // Number of cards per page
  // Example data that would be fetched from an API or defined in your application
  const programs = [
    {
      title: 'UX/UI Design',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    {
      title: 'Bureautique',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    {
      title: 'Programmation',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    {
      title: 'Marketing Digital',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    // ...other programs
  ];
  const coursesData = [
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'UX & Web Design Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 88,
      progressColor: '#189AB4', // Use a color that matches the progress bar color
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'Programmation Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 18,
      progressColor: '#189AB4', // Use a color that matches the progress bar color
      imageUrl:
        'https://cdn4.iconfinder.com/data/icons/apply-pixels-glyphs/40/Code_Tag-512.png',
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'Digital marketing Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 88,
      progressColor: '#189AB4', // Use a color that matches the progress bar color
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0070/7032/files/Introduction_To_Marketing.jpg?v=1648057035',
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'Project gestion Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 48,
      progressColor: '#189AB4', // Use a color that matches the progress bar color
      imageUrl:
        'https://kiluz.com/wp-content/uploads/2021/05/bureautique-1.png',
    },
    // ... other courses
  ];
  // Pagination
  // const pageCount = Math.ceil(programs.length / pageSize);

  // Slice the array of programs based on pagination
  // const displayedPrograms = programs.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );

  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  return (
    <div className="containerProgramme d-flex flex-column justify-content-center align-items-center">
      <div className="contain1 bg-info bg-opacity-25 w-100 py-5">
        <h2 className="mb-5 text-center">Programmes</h2>
        <div className="d-flex flex-wrap justify-content-center">
          {programs.map((program, index) => (
            <div
              className="d-flex flex-wrap gap-2  justify-content-center"
              key={index}
            >
              <ProgramCard
                title={program.title}
                description={program.description}
                imageUrl={program.imageUrl}
                buttonText={program.buttonText}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-center flex-column align-items-center my-5">
        <h2 className="my-3">Choice </h2>
        <div className="d-flex flex-wrap gap-2  justify-content-center">
          {coursesData.map((course, index) => (
            <div className="" key={index}>
              <CourseCard {...course} />
            </div>
          ))}
        </div>
        {/* <div className="pagi d-flex justify-content-end w-100">
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={handlePageChange}
          />
        </div> */}
      </div>
      <div className="bg-info py-5 bg-opacity-25">
        <h2 className="text-center">
          Choice favourite course from top category
        </h2>
        <CategoryList />
        {/* ... other components */}
      </div>
      <ButtonGroup>
        <Button appearance="primary">{options[action]}</Button>
        <Whisper
          placement="bottomEnd"
          trigger="click"
          speaker={({ onClose, left, top, className }, ref) => {
            const handleSelect = (eventKey) => {
              onClose();
              setAction(eventKey);
              console.log(eventKey);
            };
            return (
              <Popover
                ref={ref}
                className={className}
                style={{ left, top }}
                full
              >
                <Dropdown.Menu onSelect={handleSelect}>
                  {options.map((item, index) => (
                    <Dropdown.Item key={index} eventKey={index}>
                      {item}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Popover>
            );
          }}
        >
          <IconButton appearance="primary" icon={<ArrowDownIcon />} />
        </Whisper>
      </ButtonGroup>
    </div>
  );
};

export default ProgramList;
