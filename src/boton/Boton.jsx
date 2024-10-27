import React, { useEffect, useState } from "react";
import "./Boton.css";
import Settings from "../settings/Settings";
import Functions from "../js/Functions";
import Iconos from "../iconos/Iconos";
import candado from "../assets/candado.png";
import back from "../assets/back.png";
export default function Boton(props) {
  const [pos, setPos] = useState(0);
  const [habil, setHabil] = useState(true);
  const [accion, setAccion] = useState(0);
  const [data, setData] = useState({
    titulo: "",
    imagen: "",
    accion: 0,
  });
  const config = (id) => {
    const obj = document.querySelector("#set" + id);
    obj.style.display = "flex";
    props.changeStop(true);
    console.log("DRG", id);
  };
  async function ini() {
    let d = (props.id + "").split("b");
    const dd = "b" + d[d.length - 1];
    setPos(dd);

    let res = await Functions.getCampo(props.id + "_accion");
    setAccion(res);
    let datos = {
      titulo: "",
      imagen: "",
      accion: 0,
    };
    let habilx = true;
    let accion = "";
    let titulo = "";
    if (props.id + "" == props.bLocked + "") {
      datos = { titulo: "", imagen: candado, accion: "-1", accionifttt: "" };
    } else {
      if (props.id != dd && dd == "b1") {
        datos = {
          titulo: "Atrás",
          imagen: back,
          accion: "-2",
          accionifttt: "",
        };
        accion = "-2";
      } else {
        let accionifttt = await Functions.getCampo(props.id + "_accionifttt");
        if (!accionifttt) accionifttt = "";
        accion = await Functions.getCampo(props.id + "_accion");
        if (!accion) accion = 0;
        titulo = await Functions.getCampo(props.id);
        if (!titulo) titulo = "";
        let imagen = await Functions.getCampo(props.id + "_img");
        datos = { titulo, imagen, accion, accionifttt };
      }
    }
    let aux = "",
      aux2 = "";
    switch (accion + "") {
      case "-2":
        habilx = true;
        titulo = "Atrás";
        break;
      case "6":
        aux = await Functions.getCampo(props.id + "_textospeech");
        if (!aux) habilx = false;

        break;
      case "1":
        aux = await Functions.getCampo(props.id + "_phone");
        if (!aux) {
          aux = await Functions.getCampo("telefono");
        }
        aux2 = await Functions.getCampo(props.id + "_textosms");
        if (!aux || !aux2) habilx = false;

        break;
      case "2":
        aux = await Functions.getCampo(props.id + "_usertelegram");
        aux2 = await Functions.getCampo(props.id + "_textocall");
        if (!aux || !aux2) habilx = false;

        break;
      case "3":
        aux = await Functions.getCampo(props.id + "_accionifttt");
        if (!aux) habilx = false;
        break;

      case "4":
        aux = await Functions.getCampo(props.id + "_url");
        if (!aux) habilx = false;
        break;

      default:
        break;
    }
    if (titulo == "" && props.id + "" != props.bLocked + "") habilx = false;
    setHabil(habilx);

    setData(datos);
    //console.log("INI Boton", props.id, props.bLocked, datos);
  }
  useEffect(() => {
    ini();
  }, []);
  useEffect(() => {
    ini();
  }, [props.bLocked, props.dataEscena]);
  return (
    <div
      id={props.id}
      pos={pos}
      className={`boton ${
        props.locked && props.bLocked != props.id ? "locked" : ""
      }`}
      style={{ minWidth: `${props.w}px`, height: `${props.h}px` }}
    >
      <button onClick={() => config(props.id)} className="config"></button>
      {habil && (
        <>
          <div className="botonTag">
            {data.imagen && (
              <div>
                <img
                  title={props.id + ":" + data.accion}
                  onClick={() =>
                    parseInt(data.accion + "") < 0 &&
                    props.ejecutar(props.id, data.accion)
                  }
                  src={data.imagen}
                  height={data.accion + "" == "-1" ? 200 : 150}
                />
              </div>
            )}
            <div>
              <p className="titulo">{data.titulo ?? ""}</p>
            </div>
          </div>
        </>
      )}

      <div id={"tanque" + props.id} className="tanque">
        <div className="porciento"></div>
      </div>
      {accion && (
        <Iconos
          accion={data.accion}
          ejecutar={props.ejecutar}
          idBoton={props.id}
        />
      )}
      <div className="settings" id={"set" + props.id}>
        <Settings
          id={props.id}
          changeStop={props.changeStop}
          bLocked={props.bLocked}
          ini={ini}
        />
      </div>
    </div>
  );
}
