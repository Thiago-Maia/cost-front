import { useNavigate } from "react-router-dom";

import ProjectForm from "../../Project/ProjectForm/ProjectForm";
import style from "./NewProject.module.css";

function NewProject() {
  const navigate = useNavigate();
  let url = "https://localhost:7128/api/";

  function createProject(project) {
    // project.cost = 0;
    // project.service = [];
    project.budget = parseFloat(project.budget);

    fetch(url + "project/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project)
    })
      .then((resp) =>  resp.json())
      .then((data) => {
        if(data.message){
          navigate("/projects", {state: { message: data.message}});
        }
        else
          navigate("/projects", {state: { message: "Projeto criado com sucesso!"}});
      })
      .catch((err) => console.log("Erro é esse: " + err));
  }

  return (
    <div className={style.newproject_container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubimit={createProject} btnText="Criar Projeto" />
    </div>
  );
}

export default NewProject;
