import React from 'react';
import '../../../assets/css/single-program.css'; // This is where you'd put your CSS

const SpecificPro = () => {
  return (
    <div className="main-container">
      <section className="header-section d-flex align-items-center flex-column flex-lg-row gap-4 gap-lg-0">
        <div className="">
          <h1>Pourquoi le developpement Web ?!</h1>
          <p>
            Le développement web est un domaine dynamique et en constante
            évolution, offrant de nombreuses opportunités de carrière, une
            flexibilité professionnelle, et la satisfaction de créer des
            produits utilisés par des millions de personnes.
          </p>
          <h5 className="mb-3">Ajouter des cours</h5>
          <div className="d-flex gap-2">
            <input
              type="text"
              name="coursAjout"
              id="coursAjout"
              placeholder="Le lien des cours"
            />
            <button className="learn-more-btn">Ajouter</button>
          </div>
        </div>
        <div>
          <img
            src="https://cdn.arstechnica.net/wp-content/uploads/2019/03/codersTOP-800x534.jpg"
            alt="#"
            className="img-fluid img-centered"
          />
        </div>
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
