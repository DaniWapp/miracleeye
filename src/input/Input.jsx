import React, { useEffect, useState } from "react";
import "./Input.css";
import Functions from "../js/Functions.js";
export default function Input(props) {
  const [value, setValue] = useState("");
  const editCampo = async (valor) => {
    if (!props.campo) return;
    const v = !props.may ? valor : valor.toUpperCase();
    const res = await Functions.setCampo(props.campo, v);
    setValue(valor);
  };
  const ini = async () => {
    if (!props.campo) return;
    let res = await Functions.getCampo(props.campo);
    //console.log("props.campo desde Input.js", props.campo, ":", res);
    if (!res) res = props.alternativo;
    setValue(res);
  };
  useEffect(() => {
    ini();
  }, [props, props.campo]);
  return (
    <div className="divInput">
      <p>{props.title}</p>
      <input
        {...props}
        value={value}
        onChange={(e) => {
          editCampo(e.target.value);
        }}
      />
    </div>
  );
}
