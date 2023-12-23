import React from 'react';
import '../../../assets/css/single-program.css'; // This is where you'd put your CSS
import { SelectPicker } from 'rsuite';

const SpecificPro = () => {
  const data = [
    'JavaScript', // Langage Front-End
    'Node Js', // Technologie Back-End
    'React Native', // Technologie Front-End
    'PHP', // Langage Back-End
    'Vue.js', // Technologie Front-End
    'Python', // Langage souvent utilisé en Back-End
    'Angular', // Framework Front-End
    'Java',
  ].map((item, index) => ({
    label: item,
    value: item,
    role: index % 2 === 0 ? 'Front-End' : 'Back-end',
  }));

  // Filtrer pour obtenir les 'Owner'
  const owners = data.filter((item) => item.role === 'Owner');

  // Filtrer pour obtenir les 'Guest'
  const guests = data.filter((item) => item.role === 'Guest');

  function compare(a, b) {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
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
          <hr />
          <h5 className="mb-3 text-center">Ajouter des cours</h5>
          <div className="d-flex flex-column flex-wrap gap-2 justify-content-center align-items-center col-6 mx-auto mx-lg-0">
            <>
              <SelectPicker
                data={data}
                groupBy="role"
                style={{ width: 224 }}
                className="w-100"
              />
            </>
            <input
              type="text"
              name="coursAjout"
              id="coursAjout"
              placeholder="Le lien des cours"
              className="w-100"
            />
            <button className="learn-more-btn">Ajouter</button>
          </div>
        </div>
      </section>

      <section className="reading-blog-list d-flex gap-1 flex-wrap w-100">
        <div className="blog-card col">
          <img
            src="https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg"
            alt="UX/UI"
          />
          <h2>UX/UI</h2>
        </div>
        <div className="blog-card col">
          <img
            src="https://raw.githubusercontent.com/llanojs/Readme_template/master/react-logo.jpg"
            alt="React"
          />
          <h2>React</h2>
        </div>
        <div className="blog-card col">
          <img src="https://www.php.net/images/meta-image.png" alt="PHP" />
          <h2>PHP</h2>
        </div>
        <div className="blog-card col">
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
