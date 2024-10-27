import React, { useEffect, useState } from "react";
import "./Alerta.css";
import IconosMsg from "../iconos/IconosMsg";
export default function Alerta(props) {
  const [titulo, setTitulo] = useState("Mensaje");
  useEffect(() => {
    let t = "Mensaje de Miracle-Eye";
    switch (props.accion + "") {
      case "1":
        t = "Mensaje de texto - SMS";
        break;
      case "2":
        t = "Llamada Telefónica";
        break;
      case "3":
        t = "Domótica";
        break;
      case "4":
        t = "Navegación";
        break;
      case "5":
        t = "Nueva Interfaz";
        break;
      case "6":
        t = "Reproducir Texto";
        break;
      case "7":
        t = "Mensaje de Whatsapp";
        break;

      default:
        break;
    }
    setTitulo(t);
  }, []);
  return (
    <div className="alerta">
      <div className="marco">
        <p>
          <div className="tablero">
            <IconosMsg accion={props.accion} />{" "}
            <div className="tituloMsg">{titulo}</div>
          </div>

          {props.mensaje}
        </p>
      </div>
    </div>
  );
}
