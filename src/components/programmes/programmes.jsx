import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

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
    <div className="course-card">
      <div className="category-tag" style={{ backgroundColor: category.color }}>
        {category.name}
      </div>
      <h3 className="course-title">{title}</h3>
      <div className="course-meta">
        <p className="course-author">Author: {author}</p>
        <div
          className="course-progress"
          style={{ '--progress-color': progressColor }}
        >
          <span style={{ width: `${progress}%` }}></span>
        </div>
      </div>
    </div>
  );
};

// Main component that uses ProgramCard to display a list of programs
const ProgramList = () => {
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
      progress: 48,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'UX & Web Design Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 48,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'UX & Web Design Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 48,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
    },
    {
      category: { name: 'UX Design', color: '#FFB572' },
      title: 'UX & Web Design Master Course A-Z',
      author: 'Sheikh Ali',
      progress: 48,
      progressColor: '#6c5ce7', // Use a color that matches the progress bar color
    },
    // ... other courses
  ];

  return (
    <div>
      <div className="program-list">
        {programs.map((program, index) => (
          <ProgramCard
            key={index}
            title={program.title}
            description={program.description}
            imageUrl={program.imageUrl}
            buttonText={program.buttonText}
          />
        ))}
      </div>
      <div className="running-courses d-flex flex-wrap justify-content-center">
        {coursesData.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
