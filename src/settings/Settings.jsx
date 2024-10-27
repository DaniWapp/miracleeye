import React, { useEffect, useState } from "react";
import "./Settings.css";
import FormSet from "../formSet/FormSet";
import FormSetAdmin from "../formSetAdmin/FormSetAdmin";
import FormSetLocked from "../formSetLocked/FormSetLocked";
export default function Settings(props) {
  const [pos, setPos] = useState(0);
  const close = () => {
    // console.log("EEE");
    const obj = document.querySelector("#set" + props.id);
    obj.style.display = "none";
    props.changeStop(false);
    props.ini();
  };
  useEffect(() => {
    let d = (props.id + "").split("b");
    const dd = "b" + d[d.length - 1];

    setPos(dd);
    //  console.log("Buscando boton:", dd, "PI", props.id);
  }, []);
  return (
    <div className="set">
      <button onClick={() => close()} className="close"></button>
      Configuración
      {pos + "" == "b1" ? (
        <FormSetAdmin />
      ) : props.id == props.bLocked ? (
        <FormSetLocked />
      ) : (
        <FormSet id={props.id} pos={pos} dataEscena={props.dataEscena} />
      )}
    </div>
  );
}
