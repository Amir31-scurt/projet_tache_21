import React from 'react';
import '../../../assets/css/single-program.css'; // This is where you'd put your CSS

const SpecificPro = () => {
  return (
    <div className="main-container">
      <section className="header-section">
        <h1>Why Swift UI Should Be on the Radar of Every Mobile Developer</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        <button className="learn-more-btn">Start Learning Now</button>
      </section>

      <section className="reading-blog-list d-flex flex-wrap">
        <div className="blog-card">
          <img
            src="https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg"
            alt="UX/UI"
          />
          <h2>UX/UI</h2>
        </div>
        <div className="blog-card">
          <img
            src="https://raw.githubusercontent.com/llanojs/Readme_template/master/react-logo.jpg"
            alt="React"
          />
          <h2>React</h2>
        </div>
        <div className="blog-card">
          <img src="https://www.php.net/images/meta-image.png" alt="PHP" />
          <h2>PHP</h2>
        </div>
        <div className="blog-card">
          <img
            src="https://www.orientsoftware.com/Themes/OrientSoftwareTheme/Content/Images/blog/2021-12-16/what-can-you-do-with-javascript-thumb.jpg"
            alt="JavaScript"
          />
          <h2>JavaScript</h2>
        </div>
      </section>
    </div>
  );
};

export default SpecificPro;
