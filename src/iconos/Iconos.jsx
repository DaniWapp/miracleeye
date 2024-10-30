import React, { useEffect, useState } from "react";
import "./Iconos.css";
import listaAcciones from "../js/listaAcciones";
export default function Iconos(props) {
  const [imagen, setImagen] = useState("");
  useEffect(() => {
    async function ini() {
      if (props.accion + "" == "0") return;
      const pick = (obj, arr) =>
        Object.fromEntries(
          Object.entries(obj).filter(([k]) => arr.includes(k))
        );

      const obj = listaAcciones;
      const res = pick(obj, [props.accion + ""]);

      let r = await JSON.stringify(res[props.accion]);
      r = r ? JSON.parse(r) : null;
      if (!r) return;
      const serv = "http://wapps.com.co/miracle-eye/assets/";
      const img = r.img ? serv + r.img : "";
      setImagen(img);
    }
    ini();
  }, [props.accion]);
  return (
    <div className="iconos" title={props.accion}>
      {imagen && (
        <img
          src={imagen}
          height={35}
          onClick={() => props.ejecutar(props.idBoton)}
        />
      )}
    </div>
  );
}
