import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Message from "../../layout/Message/Message";
import Container from "../../layout/Container/Container";
import LinkButton from "../../layout/LinkButton/LinkButton";
import ProjectCard from "../../Project/ProjectCard/ProjectCard";
import Loading from "../../layout/Loading/Loading";

import style from "./Projects.module.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");

  const location = useLocation();
  let message = "";
  let type = "";

  if (location.state) {
    message = location.state.message;
    type =  message.includes("sucesso") ? "success" : "error"
  }

  useEffect(() => {
    fetch("https://localhost:7128/api/project", {
      method: "GET",
      headers: {
        "Contet-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(data);
        setRemoveLoading(true);
      })
      .catch((err) => console.log(err));
  }, []);

  function removeProject(id) {
    fetch(`https://localhost:7128/api/project/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Contet-Type": "application/json",
      }
    })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id))
        setProjectMessage("Projeto removido com sucesso!")
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={style.project_container}>
      <div className={style.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>

      {message && <Message msg={message} type={type}></Message>}
      {projectMessage && <Message msg={projectMessage} type="success"></Message>}

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
                handleRemove={removeProject}
              />
            );
          })}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>Não há projetos por aqui..</p>
        )}
      </Container>
    </div>
  );
}

export default Projects;
