// ==UserScript==
// @name         autoExportOct3
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8082/IMAGEnet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50.212
// @updateURL    https://raw.githubusercontent.com/atrDaw/tampermono/main/octauto.user.js
// @downloadURL  https://raw.githubusercontent.com/atrDaw/tampermono/main/octauto.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  
  function delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  
  async function simularDobleClick(elemento) {
    let eventoDobleClick = new MouseEvent("dblclick", {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0,
      buttons: 1,
      clientX: 100,
      clientY: 100,
    });

    elemento.dispatchEvent(eventoDobleClick);
  }

  
  async function clickMacular(resultados) {
    for (let resultado of resultados) {
      if (
        resultado.textContent.includes("Radial") ||
        resultado.textContent.includes("Macula")
      ) {
        console.log(resultado + " es macular");
        await simularDobleClick(resultado);
        await delay(1000);
        document.querySelector("#buttonMultiScan_12").click();
        console.log("clico en multi12");
        await delay(500);
        document.querySelector("#buttonExport").click();
        console.log("clico en export");
        await delay(500);
        document.querySelector("#buttonExportScreenShot").click();
        console.log("clico en screenshot");
        await delay(500);
        document.querySelector("#buttonExport").click();
        console.log("clico en export");
        await delay(500);
        document.querySelector("#buttonExportFunduscolor").click();
        console.log("clico en color");
        await delay();
      } else {
        console.log(resultado + " no es macular");
      }
    }
  }

  
  async function clickPapilar(resultados) {
    
    let pap = false;
 
    resultados.forEach((resultado) => {
      if (resultado.textContent.includes("Disc")) {
        console.log("es papilar");
        resultado.click();
        pap = true;
      }
    });
    if (pap) {
      await delay();
      document.querySelector("#buttonOUView")?.click();
      await delay();
      document.querySelector("#buttonReport")?.click();
      await delay();
      document.querySelector("#buttonExport")?.click();
    } else {
      console.log("No hay papilar");
    }
  }

  
  async function clickMacPap(resultados) {
    await clickMacular(resultados);
    console.log("Terminé con clickMacular, ahora ejecuto clickPapilar.");
    await clickPapilar(resultados);
    console.log("Terminé con clickPapilar.");
  }

  
  async function ejecutar() {
    await delay(1000);
    let resultados = document.querySelectorAll("#thumbnailListSlide li");
    console.log(resultados);
    await clickMacPap(resultados);
  }

  
  document.addEventListener("keydown", (e) => {
    const key="F3"
    const alt=e.altKey
    console.log(e.key);
    if (e.key === key && alt) {
      const primerElemento = document.querySelector("#dataList ul li");
      if (primerElemento) {
        simularDobleClick(primerElemento);
        console.log("clicado datalist ul li");
        ejecutar();
      }
    }
  });
})();
