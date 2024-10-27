import React, { useEffect, useState } from "react";
import "./FormSet.css";
import Input from "../input/Input";
import Select from "../select/Select";
import Functions from "../js/Functions";
import Textarea from "../textarea/Textarea";
import Imagen from "../imagen/Imagen";
let vAccion = 0;
export default function Form(props) {
  const [accion, setAccion] = useState(0);
  const [telefono, setTelefono] = useState("");

  async function consentimiento() {
    let tel = await Functions.getCampo(props.id + "_userws");
    console.log("Consentimiento", tel);

    let res = await Functions.consentimiento(tel);
  }
  async function ini() {
    //Accion
    let res = await Functions.getCampo(props.id + "_accion");
    //console.log("Acción desde FormSet", res, props.id + "_accion");
    setAccion(res);
    res = await Functions.getCampo(props.id + "_telefono");
    if (!res) res = await Functions.getCampo("telefono");
    //console.log(props.id + "_telefono", res);
    setTelefono(res);
  }
  useEffect(() => {
    ini();
    //console.log("ini desde FormSet", props);
  }, [props, props.dataEscena]);
  return (
    <div className="containerFormSet">
      <div className="formset">
        <Imagen id={props.id} />
        <Input
          type="text"
          campo={props.id}
          title="Nombre del Botón:"
          placeholder="Nombre del Botón... (acción a realizar)"
          may={true}
          alternativo=""
        />
        <Select
          campo={props.id + "_accion"}
          title="Acción:"
          setAccion={setAccion}
        />
        {accion + "" == "1" && (
          <>
            <Input
              type="phone"
              campo={props.id + "_phone"}
              title="Teléfono:"
              placeholder="Teléfono..."
              alternativo={telefono}
            />
            <Textarea
              campo={props.id + "_textosms"}
              title="Mensaje SMS:"
              placeholder="Digite el mensaje SMS..."
            />
          </>
        )}

        {accion + "" == "2" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <Input
                type="text"
                campo={props.id + "_usertelegram"}
                title="Número Telefónico:"
                placeholder="Número Telefónico:..."
                alternativo={telefono}
              />
            </div>
            <Textarea
              campo={props.id + "_textocall"}
              title="Mensaje de voz:"
              placeholder="Digite el mensaje de voz..."
            />
          </>
        )}

        {accion + "" == "3" && (
          <>
            <Input
              type="text"
              campo={props.id + "_accionifttt"}
              title="Acción IFTTT:"
              placeholder="Acción IFTTT..."
            />
          </>
        )}
        {accion + "" == "4" && (
          <>
            <Input
              type="url"
              campo={props.id + "_url"}
              title="URL:"
              placeholder="Digite la URL..."
            />
          </>
        )}
        {accion + "" == "6" && (
          <>
            <Textarea
              campo={props.id + "_textospeech"}
              title="Texto a reproducir:"
              placeholder="Digite el mensaje a reproducir..."
            />
          </>
        )}

        {accion + "" == "7" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <Input
                type="text"
                campo={props.id + "_userws"}
                title="Número Telefónico:"
                placeholder="Número Telefónico:..."
              />
              <button
                onClick={consentimiento}
                className="consentimiento"
                title="Consentimiento"
              >
                Consentimiento
              </button>
            </div>
            <Textarea
              campo={props.id + "_textows"}
              title="Mensaje de whatsapp:"
              placeholder="Digite el mensaje de whatsapp..."
            />
          </>
        )}
      </div>
    </div>
  );
}
