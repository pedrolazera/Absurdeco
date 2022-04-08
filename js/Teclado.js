"use strict";
function preenhce_linha_teclado(id_node_linha, letras) {
    console.assert(id_node_linha != null);
    console.assert(typeof (letras) == "string");
    let node_linha = document.getElementById(id_node_linha);
    console.assert(node_linha != null);
    for (let letra of letras) {
        let node_tecla = _cria_node_tecla(letra);
        node_linha.appendChild(node_tecla);
    }
}
function _cria_node_tecla(letra) {
    console.assert(typeof (letra) == "string");
    console.assert(letra.length == 1);
    let node_tecla = document.createElement("div");
    let content = document.createTextNode(letra);
    node_tecla.appendChild(content);
    node_tecla.classList.add("tecla-virtual");
    return node_tecla;
}
function add_back_space_and_enter(parent_node, backspace_fun, enter_fun) {
    let node_backspace = document.createElement("div");
    node_backspace.textContent = "\u232b";
    node_backspace.classList.add("tecla-virtual");
    node_backspace.classList.add("tecla-backspace");
    node_backspace.addEventListener("click", backspace_fun, false);
    parent_node.prepend(node_backspace);
    let node_enter = document.createElement("div");
    node_enter.textContent = "\u23ce";
    node_enter.classList.add("tecla-virtual");
    node_enter.classList.add("tecla-enter");
    node_enter.addEventListener("click", enter_fun, false);
    parent_node.append(node_enter);
}
function colore_teclas(nodes, letras, cores) {
    console.assert(letras.length == cores.length);
    console.assert(nodes.length >= 26);
    for (let i = 0; i < letras.length; i++) {
        for (let n of nodes) {
            if (n.textContent == letras[i]) {
                colore_node(n, cores[i]);
            }
        }
    }
}
function colore_node(node, cor) {
    if (cor == _GREEN) {
        node.classList.remove("vermelho");
        node.classList.remove("amarelo");
        node.classList.add("verde");
    }
    else if (cor == _YELLOW) {
        if (!node.classList.contains("verde")) {
            node.classList.remove("vermelho");
            node.classList.add("amarelo");
        }
    }
    else if (cor == _RED) {
        if ((!node.classList.contains("verde")) &&
            (!node.classList.contains("amarelo"))) {
            node.classList.add("vermelho");
        }
    }
}
function ativa_teclado_fisico(M, W, escreve_fun, apaga_fun, enter_fun) {
    document.addEventListener('keydown', function (event) {
        if (M.estado == _ESTADO_MANAGER_OFF) {
            return null;
        }
        let n = event.key.charCodeAt(0);
        if ((n >= 97) && (n < 123) && (event.key.length == 1)) {
            escreve_fun(M, event.key);
        }
        if (event.key == "Backspace") {
            apaga_fun(M);
        }
        if (event.key == "Enter") {
            enter_fun();
        }
    });
}
