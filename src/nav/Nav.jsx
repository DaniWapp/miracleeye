import React, { useEffect, useState } from "react";
import "./Nav.css";
import Logo from "../logo/Logo";
import SelectBotones from "../selectBotones/SelectBotones";
import Functions from "../js/Functions";
import ToggleSwitch from "../toggleSwitch/ToggleSwitch";
import face from "../assets/facial.png";
export default function Nav(props) {
  const [nombre, setNombre] = useState("");
  useEffect(() => {
    const ini = async () => {
      const res = await Functions.getCampo("nombre");
      if (!res) return;
      setNombre(res);
    };
    ini();
  }, []);

  return (
    <div id="menu">
      <div className="menuContainer">
        <Logo />
        <div className="grupoRenglon">
          <img src={face} height={35} />
          <ToggleSwitch onClick={props.onClick} isOnWg={props.isOnWg} />
        </div>
        <SelectBotones
          setBotones={props.setBotones}
          dataEscena={props.dataEscena}
        />
        <div id="divnombre">
          <p>{nombre}</p>
        </div>
      </div>
    </div>
  );
}
