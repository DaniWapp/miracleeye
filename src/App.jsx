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
let escenas = "";
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
    escenas = dataEscena.escena;
    inicial();
    console.log("Menszje rfac", dataEscena.escena);
  }, [dataEscena.escena]);

  useEffect(() => {
    r = renglones;
    wB = wBoton;
    hB = hBoton;
    bLocked = dataEscena.escena + "b" + botones;
  }, [renglones, wBoton, hBoton]);

  async function inicial() {
    await getBotones();
    await wg();
  }

  //Fin Refactorización
  function tanque(id, tiempo) {
    //console.log("Tanque:", id, tiempo, "#tanque" + id);
    resetTanque();
    const obj = document.querySelector("#tanque" + id);
    if (obj) {
      const por = tiempo * (100 / repeticiones) + "%";
      obj.style.height = por;
      const obj2 = obj.querySelector(".porciento");
      if (obj2) obj2.innerHTML = por;
    }
  }
  function resetTanque() {
    const objs = document.querySelectorAll(".tanque");
    for (let i = 0; i < objs.length; i++) {
      const obj = objs[i];
      if (obj) obj.style.height = "0px";
    }
  }

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
  const wg = async () => {
    if (ini != 0) return;
    const w = document.getElementById("webgazerVideoContainer");
    if (w) webgazer.end();
    //webgazer = wg;
    console.log("WG", webgazer);
    webgazer.params.videoViewerHeight = 200;
    webgazer.params.videoViewerWidth = 270;
    webgazer
      .setGazeListener(function (data, elapsedTime) {
        if (data == null) {
          return;
        }
        x = data.x; //these x coordinates are relative to the viewport
        y = data.y; //these y coordinates are relative to the viewport
        putFoco(x, y, b, r);
        //console.log(elapsedTime); //elapsed time is based on time since begin was called
      })
      .begin();
    ini++;
  };
  async function getBotones() {
    // console.log("DTES" + dataEscena.escena + "botones");
    let res = await Functions.getCampo(dataEscena.escena + "botones");
    if (!res) res = 6;
    b = res;
    setBotones(res);
    bLocked = dataEscena.escena + "b" + res;
    setCandado(bLocked);
  }
  async function openWindow(url, boton = "") {
    if (ventana + "" == "1") {
      const config = await getDataConfig();
      console.log("Ventana abierta", config);
      let mensaje1 = `*Cerrar Ventana Web: ${boton}, por favor | Gracias ${config.nombreCuidador} | Att: ${config.nombre} | Mensaje enviado desde Miracle-Eye.`;
      let res = sendIFTTT(
        "sms",
        config.telefono,
        mensaje1,
        config.nombreCuidador
      );
      ventana = null;
      msg(
        "Hemos avisado a " +
          config.nombreCuidador +
          " para que te ayude a cerrar la ventana web: " +
          boton
      );
      return;
    }
    const popup = window.open(url, "WME", "width=640, height=360");
    if (!popup || popup.closed || typeof popup.closed == "undefined") {
      alert(
        "Popup window was blocked by the browser. Please allow popups for this site."
      );
    }

    window["popupWin"] = popup;
    console.log("VentanaA", window["popupWin"]);
    ventana = 1;
    setVentana_(1);
    return;
  }
  function changeStop(v) {
    stop = v;
    console.log("Stop ha cambiado", stop);
  }
  async function ejecutar(idBoton, _accion = "") {
    const obj = document.querySelector("#" + idBoton);
    if (escenas != "") {
      if (obj.getAttribute("pos") == "b1") {
        back();
        return;
      }
    }

    //return;
    bloquear();
    resetTanque();
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

      case "7": //llamada telegram
        let userws = await Functions.getCampo(idBoton + "_userws");
        if (!userws) userws = "";
        let textows = await Functions.getCampo(idBoton + "_textows");
        if (!textows) textows = "Mensaje de Prueba.";
        let texto = `*${boton}:* ${textows} Atentamente: ${nombre}. _Mensaje enviado desde Miracle-Eye_.`;

        res = await Functions.sendMensajeMiracleEye(userws, texto);
        ejecutado = boton;
        break;

      case "6": //SMS
        let speech = await Functions.getCampo(idBoton + "_textospeech");
        if (!speech) speech = "Mensaje de Prueba.";
        speak(speech);

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
        let sms1 = await Functions.getCampo(idBoton + "_textosms");
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
          `callPhone`,
          "57" + usertelegram,
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

        let de = await Functions.getCampo("dataEscena");
        console.log("Escena Actual", de);
        if (de + "" == "null")
          de = {
            escena: "b1",
          };

        let dt = (de + "").split("b");
        console.log("DE:", de);

        const escOld = de.escena;
        const esc = idBoton;
        const ne = "name" + esc;
        const d = {
          escena: esc,
          nombreEscena: ne,
          escenaOld: escOld,
        };
        finWG();
        await Functions.setCampo("dataEscena", d);
        setDataEscena(d);

        console.log("Reconfigurando escena", d);
        // stop = true;
        webgazer.begin();
        ejecutado = boton;
        break;

      default:
        break;
    }
    if (ejecutado) {
      msg(ejecutado);
    }
  }
  function bloquear() {
    //console.log("Bloquear:", bloqueado, !bloqueado);
    bloqueado = !bloqueado;
    setLocked(bloqueado);
    tiempos = [];
    //alert(9);
  }
  const putFoco = async (x, y) => {
    if (stop) return;
    const botones = b;
    const renglones = r;
    const bx = botones;

    let botonesPorFila = botones / renglones;
    if (parseInt(botonesPorFila + "") < botonesPorFila)
      botonesPorFila = parseInt(botonesPorFila + "") + 1;

    let posX = parseInt(x / wB + "") + 1;
    if (posX > botonesPorFila) posX = botonesPorFila;
    if (posX < 1) posX = 1;
    let posY = parseInt(y / hB + "") + 1;
    if (posY > renglones) posY = renglones;

    let bFoco = escenas + "b" + (posX + (posY - 1) * botonesPorFila);

    //console.log(bFoco, escenas);

    const idBoton = bFoco;

    const btns = document.querySelectorAll(".foco");
    let bl = 0;
    for (let i = 0; i < btns.length; i++) {
      const e = btns[i];
      e.classList.remove("foco");
    }

    const btn = document.querySelector("#" + idBoton);

    if (btn) {
      btn.classList.add("foco");
      //console.log(idBoton, bLocked);
      if (bloqueado && idBoton != bLocked) {
        //return;
        return;
      }

      let tiempo = tiempos[idBoton] ?? -5;
      tiempos[idBoton] = tiempo + 1;
      //console.log("Call Tanque", idBoton, ": ", tiempo);

      tanque(idBoton, tiempo);

      if (tiempo * 1 == repeticiones) {
        ejecutar(idBoton);
      }
    }
  };
  function msg(txt) {
    setMsgAlert(txt);
    setTimeout(() => {
      setMsgAlert("");
    }, 6000);
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
  const [isOnWg, setIsOnWg] = useState(true);
  function onOffWg(e) {
    setIsOnWg(e.target.checked);
    if (e.target.checked) webgazer.begin();
    else {
      finWG();
    }
  }
  function finWG() {
    const obj = document.querySelector("#webgazerVideoContainer");
    if (!obj) return;
    obj.remove();
    webgazer.end();
  }
  async function sendIFTTT(hook, value1 = "", value2 = "", value3 = "") {
    try {
      const ifttt = await Functions.getCampo("ifttt");
      if (!ifttt) {
        mensaje("No ha configurado el código IFTTT");
        return;
      }
      value1 = encodeURI(value1);
      value2 = encodeURI(value2);
      let url = `https://maker.ifttt.com/trigger/${hook}/with/key/${ifttt}?value1=${value1}&value2=${value2}&value3=${value3}`;

      console.log("ifttt", url);
      const data1 = {};
      const res1 = await Functions.postW(url, "GET", data1);
      console.log("ifttt", res1);
    } catch (error) {
      console.log(error);
    }
  }
  function speak(txt) {
    console.log("Speak");
    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(txt);

    // Select a voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Choose a specific voice

    // Speak the text
    speechSynthesis.speak(utterance);
  }
  return (
    <div>
      {msgAlert != "" && <Alerta mensaje={msgAlert} accion={configAccion} />}

      <Nav
        botones={botones}
        dataEscena={dataEscena}
        setBotones={setBotones}
        openWindow={openWindow}
        onClick={onOffWg}
        isOnWg={isOnWg}
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
