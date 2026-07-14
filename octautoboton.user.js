// ==UserScript==
// @name         autoExportOct_mono (Botón Cálido Inferior)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Exporta automáticamente las capturas de oct mediante un botón flotante cálido abajo a la izquierda
// @author       You
// @match        http://localhost:8082/IMAGEnet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50.212
// @updateURL    https://raw.githubusercontent.com/atrDaw/tampermono/main/octauto.user.js
// @downloadURL  https://raw.githubusercontent.com/atrDaw/tampermono/main/octauto.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // --- Configuración ---
  const ID_BOTON = "tm-boton-exportar-oct";
  const TEXTO_BOTON = "🟠 Exportar OCT";
  const EXPIRATION = new Date("2027-07-01T00:00:00");

  // Comprobación de expiración
  if (new Date() >= EXPIRATION) {
    console.warn("Script expired.");
    return;
  }

  // --- Funciones de Utilidad ---
  function delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function simularDobleClick(elemento) {
    if (!elemento) return;
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

  // --- Lógica de Negocio ---
  async function clickMacular(resultados) {
    for (let resultado of resultados) {
      if (
        resultado.textContent.includes("Radial") ||
        resultado.textContent.includes("Macula")
      ) {
        console.log(resultado.textContent.trim() + " es macular");
        await simularDobleClick(resultado);
        await delay(1000);

        try {
            document.querySelector("#buttonMultiScan_12")?.click();
            console.log("clico en multi12");
            await delay(500);
            document.querySelector("#buttonExport")?.click();
            console.log("clico en export");
            await delay(500);
            document.querySelector("#buttonExportScreenShot")?.click();
            console.log("clico en screenshot");
            await delay(500);
            document.querySelector("#buttonExport")?.click();
            console.log("clico en export");
            await delay(500);
            document.querySelector("#buttonExportFunduscolor")?.click();
            console.log("clico en color");
            await delay();
        } catch (error) {
            console.error("Error durante la secuencia de clicks macular:", error);
        }

      } else {
        console.log(resultado.textContent.trim() + " no es macular");
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
      console.log("Secuencia papilar completada");
    } else {
      console.log("No hay papilar");
    }
  }

  async function clickMacPap(resultados) {
    await clickMacular(resultados);
    console.log("Terminé con clickMacular, ahora ejecuto clickPapilar.");
    resultados = document.querySelectorAll("#thumbnailListSlide li");
    await clickPapilar(resultados);
    console.log("Terminé con clickPapilar.");
  }

  // --- Función Principal de Ejecución ---
  async function iniciarProcesoExportacion() {
    const btn = document.getElementById(ID_BOTON);
    if (btn) {
      btn.textContent = "⌛ Procesando...";
      btn.style.backgroundColor = "#d35400"; // Naranja más oscuro durante el proceso
    }

    console.log("Iniciando proceso de exportación...");
    
    const primerElemento = document.querySelector("#dataList ul li");
    if (primerElemento) {
      console.log("clicado datalist ul li (inicio)");
      await simularDobleClick(primerElemento);
      
      await delay(1500);

      let resultados = document.querySelectorAll("#thumbnailListSlide li");
      if(resultados.length > 0) {
          console.log(`Encontradas ${resultados.length} miniaturas.`);
          await clickMacPap(resultados);
      } else {
          console.warn("No se encontraron miniaturas en #thumbnailListSlide.");
      }
    } else {
        alert("No se encontró el elemento inicial (#dataList ul li).");
    }
    
    if (btn) {
      btn.textContent = TEXTO_BOTON;
      btn.style.backgroundColor = "#e67e22"; // Volver al color original
    }
  }

  // --- Creación del Botón Flotante (Abajo a la Izquierda y Cálido) ---
  function crearBotonFlotante() {
    if (document.getElementById(ID_BOTON)) return;

    const btn = document.createElement("button");
    btn.id = ID_BOTON;
    btn.textContent = TEXTO_BOTON;

    // Estilos CSS: Ubicación abajo a la izquierda y paleta de colores cálidos
    btn.style.cssText = `
        position: fixed;
        bottom: 25px;         /* Posición inferior */
        left: 25px;           /* Posición izquierda */
        z-index: 99999;       /* Por encima de todo */
        padding: 12px 22px;
        background-color: #e67e22; /* Color principal: Naranja cálido / Terracota suave */
        color: white;
        border: 2px solid #d35400; /* Borde ligeramente más oscuro */
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4); /* Sombra difuminada cálida */
        transition: all 0.2s ease-in-out;
    `;

    // Comportamiento al pasar el ratón (Hover) - Tono ámbar/dorado cálido
    btn.addEventListener("mouseover", () => {
      btn.style.backgroundColor = "#f39c12"; 
      btn.style.borderColor = "#e67e22";
      btn.style.transform = "translateY(-2px)"; /* Pequeña elevación */
      btn.style.boxShadow = "0 6px 16px rgba(243, 156, 18, 0.5)";
    });

    // Restaurar estilos al quitar el ratón
    btn.addEventListener("mouseout", () => {
      btn.style.backgroundColor = "#e67e22";
      btn.style.borderColor = "#d35400";
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "0 4px 12px rgba(230, 126, 34, 0.4)";
    });

    // Efecto de pulsación (Active)
    btn.addEventListener("mousedown", () => {
        btn.style.transform = "scale(0.95) translateY(0)";
    });
    btn.addEventListener("mouseup", () => {
        btn.style.transform = "translateY(-2px)";
    });

    // Evento Click
    btn.addEventListener("click", iniciarProcesoExportacion);

    // Añadir al body
    document.body.appendChild(btn);
    console.log("Botón de exportación cálido creado abajo a la izquierda.");
  }

  // --- Inicialización ---
  if (document.readyState === "complete" || document.readyState === "interactive") {
    crearBotonFlotante();
  } else {
    window.addEventListener("DOMContentLoaded", crearBotonFlotante);
  }
})();
