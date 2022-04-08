"use strict";
const _CHAR_VAZIO = " ";
const _ESTADO_MANAGER_ON = 0;
const _ESTADO_MANAGER_OFF = 1;
function cria_manager(tam_palavra, limite_palpites) {
    console.assert(tam_palavra >= 1);
    console.assert(limite_palpites >= 1);
    let camadas = new Array(limite_palpites);
    for (let i = 0; i < limite_palpites; i++) {
        camadas[i] = {
            palavra: _repeat(_CHAR_VAZIO, tam_palavra),
            qtd_letras_usadas: 0,
            nodes: new Array(tam_palavra)
        };
    }
    return {
        tam_palavra: tam_palavra,
        limite_palpites: limite_palpites,
        qtd_palpites_usados: 0,
        camadas: camadas,
        camada_ativa: camadas[0],
        estado: _ESTADO_MANAGER_ON,
        nodes_linhas: new Array(limite_palpites)
    };
}
function append_dom_nodes_letras(manager, dom_nodes) {
    console.assert(dom_nodes.length == manager.limite_palpites);
    for (var i = 0; i < manager.limite_palpites; i++) {
        console.assert(dom_nodes[i].length == manager.tam_palavra);
    }
    for (var i = 0; i < manager.limite_palpites; i++) {
        for (var j = 0; j < manager.tam_palavra; j++) {
            manager.camadas[i].nodes[j] = dom_nodes[i][j];
        }
    }
}
function append_dom_nodes_linhas(manager, dom_nodes) {
    console.assert(dom_nodes.length == manager.limite_palpites);
    for (var i = 0; i < manager.limite_palpites; i++) {
        manager.nodes_linhas[i] = dom_nodes[i];
    }
    manager.nodes_linhas[0].classList.add("linha-ativa");
}
function get_palavra_ativa(manager) {
    if (!camada_is_cheia(manager.camada_ativa)) {
        return "";
    }
    return manager.camada_ativa.palavra.join("");
}
function avanca_uma_camada(manager) {
    if (!camada_is_cheia(manager.camada_ativa)) {
        return false;
    }
    manager.nodes_linhas[manager.qtd_palpites_usados].classList.remove("linha-ativa");
    manager.qtd_palpites_usados += 1;
    if (manager.qtd_palpites_usados < manager.limite_palpites) {
        manager.camada_ativa = manager.camadas[manager.qtd_palpites_usados];
        manager.nodes_linhas[manager.qtd_palpites_usados].classList.add("linha-ativa");
        return true;
    }
    else {
        manager.estado = _ESTADO_MANAGER_OFF;
        return false;
    }
}
function escreve_letra(manager, letra) {
    console.assert(letra.length == 1);
    if (manager.estado == _ESTADO_MANAGER_OFF) {
        return false;
    }
    if (camada_is_cheia(manager.camada_ativa)) {
        return false;
    }
    escreve_letra_na_camada(manager.camada_ativa, letra);
    return true;
}
function apaga_letra(manager) {
    if (manager.estado == _ESTADO_MANAGER_OFF) {
        return false;
    }
    if (camada_is_vazia(manager.camada_ativa)) {
        return false;
    }
    let c = manager.camada_ativa;
    c.palavra[c.qtd_letras_usadas - 1] = _CHAR_VAZIO;
    c.nodes[c.qtd_letras_usadas - 1].textContent = _CHAR_VAZIO;
    c.qtd_letras_usadas -= 1;
    return true;
}
function escreve_letra_na_camada(c, letra) {
    console.assert(letra.length == 1);
    if (camada_is_cheia(c)) {
        return false;
    }
    c.palavra[c.qtd_letras_usadas] = letra;
    c.nodes[c.qtd_letras_usadas].textContent = letra;
    c.qtd_letras_usadas += 1;
    return true;
}
function camada_is_cheia(c) {
    return c.qtd_letras_usadas == (c.palavra.length);
}
function camada_is_vazia(c) {
    return c.qtd_letras_usadas == 0;
}
function _repeat(c, count) {
    console.assert(c.length == 1);
    let v = new Array(count);
    for (let i = 0; i < count; i++) {
        v[i] = c;
    }
    return v;
}
