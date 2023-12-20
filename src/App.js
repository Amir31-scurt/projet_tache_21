import './App.css';
import SideBar from './components/CompoDashCoach/Sous_CompoSideBar/SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Template from './layout/template';
import 'rsuite/dist/rsuite.min.css';

function App() {
  return (
    <div className="">
      <SideBar />
      {/*====== Le Template Debut======*/}
      <Template />
      {/*====== Le Template Fin======*/}
    </div>
  );
}

export default App;
