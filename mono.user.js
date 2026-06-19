// ==UserScript==
// @name         Hola Mundo - Prueba
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script de prueba que hace console.log en todas las páginas
// @author       Tu Nombre
// @match        *://*/*
// @updateURL    https://github.com/atrDaw/tampermono/raw/refs/heads/main/mono.user.js
// @downloadURL  https://github.com/atrDaw/tampermono/raw/refs/heads/main/mono.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('hola mundo');
    console.log(4+2)
})();
