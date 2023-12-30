import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/pages/Home/Home';
import Company from './components/pages/Company/Company';
import Contact from './components/pages/Contact/Contact';
import NewProject from './components/pages/NewProject/NewProject';
import Projects from './components/pages/Projects/Projects';

import Container from './components/layout/Container/Container';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Project from './components/pages/Project/Project';

function App() {
  return (

    <Router>

      {/* Navegação */}
      <Navbar />

      {/* Rotas */}
      <Container customClass="min-height">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </Container>
      <Footer />
    </Router>

  );
}

export default App;
