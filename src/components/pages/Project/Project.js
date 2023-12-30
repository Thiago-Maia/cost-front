import style from "./Project.module.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState({});

  let url = "https://localhost:7128/api/";
  useEffect(()=>{
    fetch(`${url}project/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }  
    })
    .then((res) => res.json())
    .then((data) => setProject(data))
    .catch((err) => console.log(err))
  }, [id])

  return <h1>Projeto = {project.name}</h1>;
}

export default Project;
