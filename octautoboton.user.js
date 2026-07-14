// ==UserScript==
// @name         autoExportOct_mono (Botón Inteligente)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Exporta automáticamente las capturas de oct mediante un botón flotante que solo es visible en /exam (compatible con SPA)
// @author       You
// @match        http://localhost:8082/IMAGEnet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50.212
// @updateURL    https://raw.githubusercontent.com/atrDaw/tampermono/main/octauto.user.js
// @downloadURL  https://raw.githubusercontent.com/atrDaw/tampermono/main/octauto.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const ID_BOTON = "tm-boton-exportar-oct";
  const TEXTO_BOTON = "🟠 Exportar OCT";
  const URL_PERMITIDA = "http://localhost:8082/IMAGEnet/exam";
  const EXPIRATION = new Date("2027-07-01T00:00:00");

  if (new Date() >= EXPIRATION) {
    console.warn("Script expired.");
    return;
  }

  // --- Funciones de simulación y lógica ---
  function delay(ms = 1000) { return new Promise((r) => setTimeout(r, ms)); }

  async function simularDobleClick(elemento) {
    if (!elemento) return;
    let ev = new MouseEvent("dblclick", { bubbles: true, cancelable: true, view: window, button: 0, buttons: 1, clientX: 100, clientY: 100 });
    elemento.dispatchEvent(ev);
  }

  async function clickMacular(resultados) {
    for (let r of resultados) {
      if (r.textContent.includes("Radial") || r.textContent.includes("Macula")) {
        await simularDobleClick(r);
        await delay(1000);
        try {
            document.querySelector("#buttonMultiScan_12")?.click(); await delay(500);
            document.querySelector("#buttonExport")?.click(); await delay(500);
            document.querySelector("#buttonExportScreenShot")?.click(); await delay(500);
            document.querySelector("#buttonExport")?.click(); await delay(500);
            document.querySelector("#buttonExportFunduscolor")?.click(); await delay();
        } catch (e) { console.error(e); }
      }
    }
  }

  async function clickPapilar(resultados) {
    let pap = false;
    resultados.forEach((r) => { if (r.textContent.includes("Disc")) { r.click(); pap = true; } });
    if (pap) {
      await delay(); document.querySelector("#buttonOUView")?.click();
      await delay(); document.querySelector("#buttonReport")?.click();
      await delay(); document.querySelector("#buttonExport")?.click();
    }
  }

  async function clickMacPap(resultados) {
    await clickMacular(resultados);
    resultados = document.querySelectorAll("#thumbnailListSlide li");
    await clickPapilar(resultados);
  }

  async function iniciarProcesoExportacion() {
    const btn = document.getElementById(ID_BOTON);
    if (btn) { btn.textContent = "⌛ Procesando..."; btn.style.backgroundColor = "#d35400"; }
    const primerElemento = document.querySelector("#dataList ul li");
    if (primerElemento) {
      await simularDobleClick(primerElemento);
      await delay(1500);
      let resultados = document.querySelectorAll("#thumbnailListSlide li");
      if (resultados.length > 0) { await clickMacPap(resultados); }
    }
    if (btn) { btn.textContent = TEXTO_BOTON; btn.style.backgroundColor = "#e67e22"; }
  }

  // --- CONTROL DEL BOTÓN EN TIEMPO REAL ---

  function crearBotonFlotante() {
    const btn = document.createElement("button");
    btn.id = ID_BOTON;
    btn.textContent = TEXTO_BOTON;
    btn.style.cssText = `
        position: fixed;
        bottom: 25px;
        left: 25px;
        z-index: 99999;
        padding: 12px 22px;
        background-color: #e67e22;
        color: white;
        border: 2px solid #d35400;
        border-radius: 8px;
        cursor: pointer;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
        transition: all 0.2s ease-in-out;
        display: none; /* Empezamos ocultos */
    `;

    btn.addEventListener("mouseover", () => {
      btn.style.backgroundColor = "#f39c12"; 
      btn.style.borderColor = "#e67e22";
      btn.style.transform = "translateY(-2px)";
      btn.style.boxShadow = "0 6px 16px rgba(243, 156, 18, 0.5)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.backgroundColor = "#e67e22";
      btn.style.borderColor = "#d35400";
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "0 4px 12px rgba(230, 126, 34, 0.4)";
    });

    btn.addEventListener("mousedown", () => { btn.style.transform = "scale(0.95) translateY(0)"; });
    btn.addEventListener("mouseup", () => { btn.style.transform = "translateY(-2px)"; });
    btn.addEventListener("click", iniciarProcesoExportacion);

    document.body.appendChild(btn);
  }

  function chequearRutaYMostrarBoton() {
    let btn = document.getElementById(ID_BOTON);
    
    if (!btn) {
      crearBotonFlotante();
      btn = document.getElementById(ID_BOTON);
    }

    if (window.location.href === URL_PERMITIDA) {
      if (btn && btn.style.display === "none") {
        btn.style.display = "block";
        console.log("Mostrando botón de exportación en /exam");
      }
    } else {
      if (btn && btn.style.display !== "none") {
        btn.style.display = "none";
        console.log("Ocultando botón de exportación fuera de /exam");
      }
    }
  }

  setInterval(chequearRutaYMostrarBoton, 500);

})();
