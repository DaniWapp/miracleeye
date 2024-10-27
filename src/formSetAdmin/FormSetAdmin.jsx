import React, { useEffect } from "react";
import "../formSet/FormSet.css";
import Input from "../input/Input";
import Functions from "../js/Functions.js";
import Imagen from "../imagen/Imagen.jsx";
export default function FormSetAdmin() {
  return (
    <div className="containerFormSet">
      ADMIN<br></br>
      <br></br>
      <div className="formset">
        <Input
          type="text"
          campo="nombre"
          title="Nombre del Paciente:"
          placeholder="Nombre del Paciente..."
        />
        <Input
          type="text"
          campo="nombreCuidador"
          title="Nombre del Cuidador:"
          placeholder="Nombre del Cuidador..."
        />
        <Input
          type="phone"
          campo="telefono"
          title="Teléfono Cuidador:"
          placeholder="Teléfono Cuidador... 57XXXXXXXXXX"
        />
        <Input
          type="password"
          campo="ifttt"
          title="Código IFTTT:"
          placeholder="Código IFTTT..."
        />
      </div>
    </div>
  );
}
