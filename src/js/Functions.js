const BASE_API2 = "https://wapps.com.co/alarmas/api/apiApp/ajax.php";

class Functions {
  async sendMensajeMiracleEye(telefono, texto) {
    const accion = "sendMensajeMiracleEye";
    const datas = {
      accion,
      telefono,
      texto,
    };

    let data = await this.postW2(datas);
    console.log(accion, data);

    return data;
  }
  //drg
  async consentimiento(telefono) {
    const accion = "consentimiento";
    const datas = {
      accion,
      telefono,
    };

    let data = await this.postW2(datas);
    //console.log(accion, data);

    return data;
  }
  async postW2(datas, url = BASE_API2) {
    //console.log("postW log:",datas);
    try {
      const query = await fetch(url, {
        method: "POST", // or 'PUT'
        body: JSON.stringify(datas), // data can be `string` or {object}!

        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await query.json();
      return res;
    } catch (error) {
      //console.log("Error Fetch:", error);
      //alert(error);
      return false;
    }
  }
  async rememberData(telefono) {
    const accion = "rememberData";
    const datas = {
      accion,
      telefono,
    };

    let data = await this.postW(datas, BASE_API);
    //console.log(accion, data);

    return data;
  }
  async setCampo(campo, valor) {
    if (campo == "") return false;
    //console.log("SETCAMPO:", campo, ":", valor);
    const res = localStorage.setItem(campo, JSON.stringify(valor));
    return res;
  }
  async getCampo(campo) {
    if (campo == "") return false;
    const res = JSON.parse(localStorage.getItem(campo));
    const rta = res ? true : false;
    //if (rta) console.log("GETCAMPO:", campo, rta);
    return res;
  }

  async isValidURL(string) {
    const res = await string.match(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
    );
    return res !== null;
  }
  async postW(url = "", method = "POST", datas = "") {
    //console.log("postW log:",datas);
    const res = "";
    let query = "";
    try {
      if (method == "GET") {
        query = await fetch(url);
      } else {
        query = await fetch(url, {
          method, // or 'PUT'
          body: JSON.stringify(datas), // data can be `string` or {object}!
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      res = await query.json();
      return res;
    } catch (error) {
      console.log("Error Fetch:", error);
      //alert(error);
      return false;
    }
  }
}
export default new Functions();
