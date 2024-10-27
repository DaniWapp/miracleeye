import React, { useEffect, useState } from "react";
import "./Select.css";
import Functions from "../js/Functions.js";
import listaAcciones from "../js/listaAcciones.js";
export default function Select(props) {
  const [value, setValue] = useState("");
  const editCampo = async (valor) => {
    console.log("SELECT", props.campo, valor);
    if (!props.campo) return;
    const res = await Functions.setCampo(props.campo, valor);
    setValue(valor);
    props.setAccion(valor);
  };
  const ini = async () => {
    if (!props.campo) return;
    let res = await Functions.getCampo(props.campo);
    //console.log("props.campo desde Select.js", props.campo, ":", res);
    setValue(res);
  };
  useEffect(() => {
    ini();
  }, [props, props.campo]);

  return (
    <div className="divInput">
      <p>{props.title}</p>

      <select
        {...props}
        value={value}
        onChange={(e) => {
          editCampo(e.target.value);
        }}
      >
        {listaAcciones.map((e) => {
          const s = value + "" == e.value + "" ? true : false;
          return (
            <option value={e.value} selected={s}>
              {e.item}
            </option>
          );
        })}
      </select>
    </div>
  );
}
