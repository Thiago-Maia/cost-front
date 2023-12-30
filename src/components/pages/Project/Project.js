import style from "./Project.module.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Container from "../../layout/Container/Container";
import ProjectForm from "../../Project/ProjectForm/ProjectForm";
import ServiceForm from "../../Project/ServiceForm/ServiceForm";
import ServiceCard from "../../Project/ServiceCard/ServiceCard";
import Loading from "../../layout/Loading/Loading";
import Message from "../../layout/Message/Message";

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [services, setServices] = useState({});
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    let url = "https://localhost:7128/api/";
    fetch(`${url}project/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setServices(data.services);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function editPost(project) {
    let url = "https://localhost:7128/api/";
    setShowMessage(false);
    if (project.budget < project.cost) {
      setMessage("O orçamento não pode ser maior que o custo do projeto!");
      setType("error");
      setShowMessage(true);
      return false;
    }

    fetch(`${url}project/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        setMessage("Projeto atualizado!");
        setType("success");
        setShowMessage(true);
      })
      .catch((err) => console.log(err));
  }

  function createService(project) {
    let url = "https://localhost:7128/api/";
    setShowMessage(false);
    const lastService = project.services[project.services.length - 1];

    const newCost = parseFloat(project.cost) + parseFloat(lastService.cost);

    if (newCost > parseFloat(project.budget)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço");
      setType("error");
      setShowMessage(true);
      project.services.pop();
      return false;
    }

    project.cost = newCost;

    fetch(`${url}project/service/add?projectId=${project.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lastService),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services);
        setShowServiceForm(false);
      })
      .catch((err) => console.log(err));
  }

  function removeService(serviceId) {
    let url = "https://localhost:7128/api/";
    setShowMessage(false);

    fetch(
      `${url}project/service/remove?projectId=${project.id}&serviceId=${serviceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services);
        setShowServiceForm(false);
        setMessage("Serviço removido com sucesso!");
        setType("success");
        setShowMessage(true);
      })
      .catch((err) => console.log(err));
  }

  function toogleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toogleServiceForm() {
    console.log("toogleServiceForm");
    setShowServiceForm(!showServiceForm);
  }

  return (
    <>
      {project.name ? (
        <div className={style.project_details}>
          <Container customClass="column">
            {showMessage && <Message type={type} msg={message} />}
            <div className={style.project_container}>
              <h1>{project.name}</h1>
              <button className={style.btn} onClick={toogleProjectForm}>
                {!showProjectForm ? "Editar projeto" : "Fechar"}
              </button>
              {!showProjectForm ? (
                <div className={style.project_info}>
                  <p>
                    <span>Categoria:</span> {project.category.name}
                  </p>
                  <p>
                    <span>Total de Orçamento:</span> R${project.budget}
                  </p>
                  <p>
                    <span>Total Utilizado:</span> R${project.cost}
                  </p>
                </div>
              ) : (
                <div className={style.project_info}>
                  <ProjectForm
                    handleSubimit={editPost}
                    btnText="Concluir edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={style.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button className={style.btn} onClick={toogleServiceForm}>
                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
              </button>
              <div className={style.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar serviço"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {project.services.length > 0 &&
                project.services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))}
              {project.services.length === 0 && (
                <p>Não há serviços cadastrados.</p>
              )}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
