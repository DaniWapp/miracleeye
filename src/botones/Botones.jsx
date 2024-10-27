import React, { useEffect, useState } from "react";
import Boton from "../boton/Boton";
import "./Botones.css";
export default function Botones(props) {
  const [botonesConfig, setBotonesConfig] = useState(2);
  const [widthButton, setWidthButton] = useState(200);
  const [heightButton, setHeightButton] = useState(0);
  const [grilla, setGrilla] = useState([]);
  useEffect(() => {
    let calculado = false;
    let botonesWidth = 0;
    let botones = 2;
    let renglones = props.botones > 2 ? 2 : 1;
    const container = document.querySelector("#root");
    let width = container.offsetWidth;
    let height = container.offsetHeight - 52;
    let bxr = 0;

    while (!calculado) {
      //calculado = true;
      bxr = props.botones / renglones;
      botonesWidth = width / bxr;
      botones = props.botones / renglones;
      if (botones > parseInt(botones + ""))
        botones = parseInt(botones + "") + 1;
      // console.log(
      //   "Recalcular Botones:",
      //   botones,
      //   ", Renglones:",
      //   renglones,
      //   ", WidthBoton:",
      //   botonesWidth,
      //   width
      // );

      if (botonesWidth > minW) {
        calculado = true;
      } else {
        renglones++;
      }
    }
    const wb = width / botones - 4;
    const hb = height / renglones;
    //console.log("W:", wb, "HB:", hb);
    setBotonesConfig(botones);
    setWidthButton(wb);
    setHeightButton(hb);
    let grillaArray = [];
    let maxB = props.botones;
    //if (props.botones / renglones != parseInt(props.botones / renglones + ""))maxB++;

    const bLocked = props.dataEscena.escena + "b" + maxB;

    for (let i = 1; i <= maxB; i++) {
      const obj = (
        <Boton
          id={props.dataEscena.escena + "b" + i}
          w={wb}
          h={hb}
          bLocked={bLocked}
          locked={props.locked}
          changeStop={props.changeStop}
          ejecutar={props.ejecutar}
          dataEscena={props.dataEscena}
        />
      );
      grillaArray.push(obj);
    }
    setGrilla(grillaArray);
    // props.setBotones(botones);
    console.log("RNGLS:", renglones);
    props.setRenglones(renglones);
    props.setWBoton(wb);
    props.setHBoton(hb);
  }, [props.botones, props.locked]);
  return <div id="botones">{grilla.map((e) => e)}</div>;
}
