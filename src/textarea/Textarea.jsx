import React, { useEffect, useState } from "react";
import "./Textarea.css";
import Functions from "../js/Functions.js";
export default function Textarea(props) {
  const [value, setValue] = useState("");
  const editCampo = async (valor) => {
    console.log("textarea", props.campo, valor);
    if (!props.campo) return;
    const res = await Functions.setCampo(props.campo, valor);
    setValue(valor);
  };

  useEffect(() => {
    const ini = async () => {
      if (!props.campo) return;
      let res = await Functions.getCampo(props.campo);

      setValue(res);
    };
    ini();
  }, []);
  return (
    <div className="divInput">
      <p>{props.title}</p>
      <textarea
        {...props}
        onChange={(e) => {
          editCampo(e.target.value);
        }}
        value={value}
      ></textarea>
    </div>
  );
}
