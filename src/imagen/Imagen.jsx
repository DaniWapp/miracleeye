import React, { useEffect, useState } from "react";
import drg from "./drg.png";
import picture from "../assets/picture.png";
import Functions from "../js/Functions";
const ancho = 50;
const alto = 50;
export default function Imagen(props) {
  const [img, setImg] = useState(drg);
  async function ini() {
    let imgx = await Functions.getCampo(props.id + "_img");
    if (!imgx) imgx = picture;
    let imagen = document.querySelector("#imagen");
    setImg(imgx);
  }
  useEffect(() => {
    ini();
  }, [props]);
  const cargarImagen = async (event) => {
    let reader = new FileReader();

    reader.onload = async () => {
      let imagen = document.querySelector("#imagen");
      //imagen.src = reader.result;
      setImg(reader.result);
      //await props.changeImg(imagen);
      Functions.setCampo(props.id + "_img", reader.result);
      console.log("Cambió img en IMAGEN", imagen);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const clickFile = () => {
    document.querySelector("#file_" + props.id).click();
  };
  return (
    <div id="visor" className="visor">
      <img
        onClick={() => clickFile()}
        id="imagen"
        src={img}
        style={{ width: "auto", height: alto, borderRadius: "50%" }}
        title={props.id + "_img"}
      />
      <input
        type="file"
        id={"file_" + props.id}
        onChange={(event) => cargarImagen(event)}
        style={{ display: "none" }}
      />
    </div>
  );
}
