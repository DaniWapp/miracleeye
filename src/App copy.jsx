import { useEffect, useState } from "react";
import "./App.css";
import Nav from "./nav/Nav";
import Botones from "./botones/Botones";
import Functions from "./js/Functions";
import Alerta from "./alerta/Alerta";
//import wgr from "webgazer";
//let webgazer = {};
let x, y;
let ini = 0;
var ventana = null;
const container = document.querySelector("#root");
let width = container.offsetWidth;
let height = container.offsetHeight - 200;
let b = 1;
let r = 1;
let wB = 200;
let hB = 200;
let bLocked = "";
let bloqueado = true;
let tiempos = [];
const repeticiones = 20;
let stop = false;
function App() {
  const [dataEscena, setDataEscena] = useState({
    escena: "",
    nombreEscena: "Miracle-Eye",
    escenaOld: "",
  });

  const [botones, setBotones] = useState(10);
  const [renglones, setRenglones] = useState(2);
  const [wBoton, setWBoton] = useState(1);
  const [hBoton, setHBoton] = useState(1);
  const [locked, setLocked] = useState(true);
  const [candado, setCandado] = useState("b4");
  const [msgAlert, setMsgAlert] = useState("");
  const [ventana_, setVentana_] = useState(0);
  const [configAccion, setConfigAccion] = useState(0);

  //Refactorización

  useEffect(() => {
    console.log("Menszje rfac", dataEscena.escena);
  }, [dataEscena.escena]);

  //Fin Refactorización

  const putFoco = (x, y) => {
    if (stop) return;
    const botones = b;
    const renglones = r;
    const bx = botones;
    console.log("PUTFOCO:", dataEscena.escena, b, botones, renglones, x, y);
    let botonesPorFila = botones / renglones;
    if (parseInt(botonesPorFila + "") < botonesPorFila)
      botonesPorFila = parseInt(botonesPorFila + "") + 1;

    let posX = parseInt(x / wB + "") + 1;
    if (posX > botonesPorFila) posX = botonesPorFila;
    if (posX < 1) posX = 1;
    let posY = parseInt(y / hB + "") + 1;
    if (posY > renglones) posY = renglones;

    let bFoco = posX + (posY - 1) * botonesPorFila;

    //console.log("B" + bFoco);
    // console.log("POSX", posX, posY, botonesPorFila);
    const idBoton = dataEscena.escena ?? "" + "b" + bFoco;
    const btns = document.querySelectorAll(".foco");
    for (let i = 0; i < btns.length; i++) {
      const e = btns[i];
      e.classList.remove("foco");
    }
    const btn = document.querySelector("#" + idBoton);
    if (btn) {
      btn.classList.add("foco");

      if (bloqueado && btn.id != bLocked) {
        return;
      }
      let tiempo = tiempos[idBoton] ?? -5;
      tiempos[idBoton] = tiempo + 1;
      //console.log(idBoton, ": ", tiempo);

      tanque(idBoton, tiempo);

      if (tiempo * 1 == repeticiones) {
        ejecutar(idBoton);
      }
    }
  };

  useEffect(() => {
    async function ini2() {
      const w = document.getElementById("webgazerVideoContainer");
      if (w) webgazer.end();
      console.log("Nivel", nivel);
      wg();
      const de = await Functions.getCampo("dataEscena");
      console.log("DEEEE", de === dataEscena);
      if (de !== dataEscena) {
        setDataEscena(de);
      } else interfaz();
    }
    ini2();
  }, []);

  async function interfaz() {
    // if (de!=) setDataEscena(de);
    const botones = await getBotones();
    console.log("BR", botones, renglones);
    b = botones;
    r = renglones;
    wB = wBoton;
    hB = hBoton;
    let bxr = botones / renglones;
    if (parseInt(bxr + "") < bxr) bxr = parseInt(bxr + "") + 1;
    const bLockedOld = bLocked;
    bLocked = dataEscena.escena + "b" + botones;
    console.log("Blocked", bLocked);
    setCandado(bLocked);
  }
  useEffect(() => {
    interfaz();
  }, [renglones, wBoton, hBoton, dataEscena]);
  function bloquear() {
    //console.log("Bloquear:", bloqueado, !bloqueado);
    bloqueado = !bloqueado;
    setLocked(bloqueado);
    tiempos = [];
    //alert(9);
  }

  async function getDataConfig() {
    const nombre = await Functions.getCampo("nombre");
    const nombreCuidador = await Functions.getCampo("nombreCuidador");
    const telefono = await Functions.getCampo("telefono");
    const data = {
      nombre,
      nombreCuidador,
      telefono,
    };
    return data;
  }
  async function back() {
    const de = await Functions.getCampo("dataEscena");
    let newData = {
      escena: "",
      nombreEscena: "",
      escenaOld: "",
    };
    let BackEscena = "";
    const d = (de.escena + "").split("b");
    console.log("LArgo escena", d.length);
    const largoEscena = d.length - 1;
    if (largoEscena > 2) {
      for (let i = 1; i < d.length - 1; i++) {
        BackEscena += "b" + d[i];
      }
      console.log("BackEscena:", BackEscena);
      newData = {
        escena: BackEscena,
        nombreEscena: "name" + BackEscena,
        escenaOld: "",
      };

      // console.log("Atrás", res, de);
    } else {
      if (largoEscena == 2) {
        newData = {
          escena: "b" + d[1],
          nombreEscena: "name" + "b" + d[1],
          escenaOld: "",
        };
      } else {
        newData = {
          escena: "",
          nombreEscena: "name",
          escenaOld: "",
        };
      }
    }

    const res = await Functions.setCampo("dataEscena", newData);
    setDataEscena(newData);
    console.log("Actual:", de, "Nueva:", newData);
  }
  async function ejecutar(idBoton, _accion = "") {
    const dte = await Functions.getCampo("dataEscena");
    console.log("LOG", idBoton, dte);
    //return;
    if (_accion + "" == "-2") {
      back();
      return;
    }
    //return;
    bloquear();
    resetTanque();
    //Settings
    const config = await getDataConfig();
    const nombre = config.nombre;
    const nombreCuidador = config.nombreCuidador;
    const telefono = config.telefono;
    // end settings

    const boton = await Functions.getCampo(idBoton);
    const accion = await Functions.getCampo(idBoton + "_accion");
    setConfigAccion(accion);
    console.log("Ejecutar", idBoton, bLocked, accion);
    let ejecutado = false;
    let res = false;
    if (idBoton + "" == bLocked + "") return;
    if (!accion) return false;
    switch (accion + "") {
      case "-2":
        alert(8);
        break;
      case "1": //SMS
        let tel = await Functions.getCampo(idBoton + "_phone");
        const isCuidador = tel ? false : true;
        if (!tel) tel = telefono;
        if (!tel) {
          mensaje(
            "No ha configurado el Teléfono del cuidador o del receptor del mensaje."
          );
          console.log("No ifttt");
          return;
        }
        const sms1 = await Functions.getCampo(idBoton + "_textosms");
        if (!sms1) sms1 = "Mensaje de Prueba.";

        let mensaje1 = `*${boton}* | Hola ${
          isCuidador ? nombreCuidador : ""
        } | ${sms1} | Att: ${nombre} | Mensaje enviado desde Miracle-Eye.`;
        res = sendIFTTT("sms", tel, mensaje1, nombreCuidador);
        ejecutado = boton;
        break;
      case "2": //llamada telegram
        let usertelegram = await Functions.getCampo(idBoton + "_usertelegram");
        if (!usertelegram) usertelegram = "";
        let sms = await Functions.getCampo(idBoton + "_textocall");
        if (!sms) sms = "Mensaje de Prueba.";
        let mensaje = `${boton}: ${sms} Atentamente: ${nombre}. Mensaje enviado desde Miracle-Eye.`;

        res = sendIFTTT(
          `calltelegram${usertelegram}`,
          usertelegram,
          mensaje,
          nombreCuidador
        );
        ejecutado = boton;
        break;
      case "3": //domótica
        let accionifttt = await Functions.getCampo(idBoton + "_accionifttt");
        sendIFTTT(accionifttt);
        ejecutado = boton;
        break;
      case "4": // abrir url
        let url_btn = await Functions.getCampo(idBoton + "_url");
        if (url_btn) {
          const r = openWindow(url_btn, boton);
          ejecutado = boton;
          if (!ventana) {
            msg(ejecutado);
            return;
          }
        }

        break;
      case "5":
        //setBotones(6);

        const de = await Functions.getCampo("dataEscena");
        console.log("Escena Actual", de);
        let dt = (de + "").split("b");
        const escOld = de.escena;
        const esc = idBoton;
        const ne = "name" + esc;
        const d = {
          escena: esc,
          nombreEscena: ne,
          escenaOld: escOld,
        };
        await Functions.setCampo("dataEscena", d);
        setDataEscena(d);

        console.log("Reconfigurando escena", d);
        stop = true;
        break;

      default:
        break;
    }
    if (ejecutado) {
      msg(ejecutado);
    }
  }
  function msg(txt) {
    setMsgAlert(txt);
    setTimeout(() => {
      setMsgAlert("");
    }, 6000);
  }

  function speak() {
    console.log("Speak");
    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance("Welcome to this tutorial!");

    // Select a voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Choose a specific voice

    // Speak the text
    speechSynthesis.speak(utterance);
  }

  return (
    <div>
      {msgAlert != "" && <Alerta mensaje={msgAlert} accion={configAccion} />}
      <h1>Hola Mundo</h1>
      <Nav
        botones={botones}
        dataEscena={dataEscena}
        setBotones={setBotones}
        openWindow={openWindow}
        speak={speak}
      />

      <Botones
        bLocked={candado}
        locked={locked}
        botones={botones}
        setBotones={setBotones}
        setRenglones={setRenglones}
        setWBoton={setWBoton}
        setHBoton={setHBoton}
        changeStop={changeStop}
        ejecutar={ejecutar}
        dataEscena={dataEscena}
      />
    </div>
  );
}

export default App;
