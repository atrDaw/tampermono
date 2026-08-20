// ==UserScript==
// @name         registro paciente
// @namespace    http://tampermonkey.net/
// @version      2026-08-14
// @description  try to take over the world!
// @author       You
// @match        https://mplus.rahhal.com/mplus/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rahhal.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("click", (e) => {
        const boton = e.target.closest("button");
        console.log(boton);
        if (boton && boton.textContent.includes("Guardar")) {
            console.log("Guardando paciente en base de datos:", document.querySelector("#patient-profile").dataset.label);
        const tituloOriginal = document.title;

            // Cambiar el título a "ok"
            document.title += " ok";

            // Restaurar el título original después de 0.5 segundos (500 ms)
            setTimeout(() => {
                document.title = tituloOriginal;
            }, 500);
        }


    });

})();
