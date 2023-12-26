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

export default CourseCard;
