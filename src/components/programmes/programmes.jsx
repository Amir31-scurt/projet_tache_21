import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CategoryList from './Domaines';

// Define a reusable ProgramCard component
const ProgramCard = ({ title, description, imageUrl, buttonText }) => {
  return (
    <div className="program-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button>{buttonText}</button>
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
    <div className="card course-card m-2" style={{ width: '19rem' }}>
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
      buttonText: 'Start Learning',
    },
    {
      title: 'UX/UI Design',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Start Learning',
    },
    {
      title: 'UX/UI Design',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Start Learning',
    },
    {
      title: 'UX/UI Design',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Start Learning',
    },
    // ...other programs
  ];
  const coursesData = [
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'UX & Web Design Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 88,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'Programmation Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 18,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
      imageUrl:
        'https://cdn4.iconfinder.com/data/icons/apply-pixels-glyphs/40/Code_Tag-512.png',
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'Marketing Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 88,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0070/7032/files/Introduction_To_Marketing.jpg?v=1648057035',
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'Project gestion Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 48,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
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
    <div className="containerProgramme d-flex flex-column justify-content-center align-items-center m-0 p-0">
      <div className="d-flex flex-wrap justify-content-center">
        {programs.map((program, index) => (
          <div className="col" key={index}>
            <ProgramCard
              title={program.title}
              description={program.description}
              imageUrl={program.imageUrl}
              buttonText={program.buttonText}
            />
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap justify-content-center flex-column mx-5">
        <h2>Choice </h2>
        <div className="d-flex flex-wrap">
          {coursesData.map((course, index) => (
            <div className="col-3" key={index}>
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
      <div className="m-5 px-5">
        <h2>Choice favourite course from top category</h2>
        <CategoryList />
        {/* ... other components */}
      </div>
    </div>
  );
};

export default ProgramList;
