import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Message from "../../layout/Message/Message";
import Container from "../../layout/Container/Container";
import LinkButton from "../../layout/LinkButton/LinkButton";
import ProjectCard from "../../Project/ProjectCard/ProjectCard";

import style from "./Projects.module.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  let message = "";

  if (location.state) {
    message = location.state.message;
  }

  useEffect(() => {
    fetch("https://localhost:7128/api/project", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={style.project_container}>
      <div className={style.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>

      {message && <Message msg={message} type="success"></Message>}

      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => {
            return (
              <ProjectCard
                id={project.id}
                key={project.id}
                name={project.name}
                budget={project.budget}
                category={project.category.name}
              />
            );
          })}
      </Container>
    </div>
  );
}

export default Projects;
