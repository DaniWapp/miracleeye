import React, { useEffect, useState } from "react";
import sms from "../assets/sms.png";
import call from "../assets/call.png";
import domo from "../assets/domo.png";
import www from "../assets/www.png";
import "./IconosMsg.css";
import listaAcciones from "../js/listaAcciones.js";

export default function IconosMsg(props) {
  const [imagen, setImagen] = useState("");

  return (
    <div className="iconosMsg" title={props.accion}>
      <img
        src={
          props.accion + "" == "1"
            ? sms
            : props.accion + "" == "2"
            ? call
            : props.accion + "" == "3"
            ? domo
            : props.accion + "" == "4"
            ? www
            : ""
        }
        height={50}
      />
    </div>
  );
}
