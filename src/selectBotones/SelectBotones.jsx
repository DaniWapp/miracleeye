import React, { useEffect, useState } from "react";
let OPCION_BOTTON = 10;
import "./selectBotones.css";
import Functions from "../js/Functions";
export default function Botones(props) {
  const ini = async () => {
    let res = await Functions.getCampo(props.dataEscena.escena + "botones");
    if (!res) res = 6;
    OPCION_BOTTON = res;
    let data = "";
    for (let i = 6; i <= 20; i = i + 2) {
      data += `<option value="${i}" ${
        i == OPCION_BOTTON ? "selected" : ""
      }>${i} Botones</option>`;
    }
    //setOpciones(data);
    document.querySelector("#sBotones").innerHTML = data;
  };
  useEffect(() => {
    ini();
  }, []);
  useEffect(() => {
    ini();
  }, [props.dataEscena]);
  async function changeBotones(v) {
    const res = await Functions.setCampo(
      props.dataEscena.escena + "botones",
      v
    );
    props.setBotones(v);
  }
  return (
    <div id="selectbotones">
      <select
        value={props.botones}
        onChange={(e) => changeBotones(e.target.value)}
        id="sBotones"
      ></select>
    </div>
  );
}
