"use strict";
function cria_tabuleiro(tam_palavra, limite_palpites, id_node_tabuleiro) {
    let node_tabuleiro = document.getElementById(id_node_tabuleiro);
    console.assert(node_tabuleiro != null);
    for (let i = 0; i < limite_palpites; i++) {
        adiciona_linha_tabuleiro(node_tabuleiro, tam_palavra);
    }
}
function adiciona_linha_tabuleiro(parent_node, tam_palavra) {
    let node_linha = document.createElement("div");
    node_linha.classList.add("linha-tabuleiro");
    for (let i = 0; i < tam_palavra; i++) {
        adiciona_node_letra(node_linha);
    }
    parent_node.appendChild(node_linha);
}
function adiciona_node_letra(parent_node) {
    let node_letra = document.createElement("div");
    node_letra.classList.add("letra-tabuleiro");
    parent_node.appendChild(node_letra);
}
function pendura_tabuleiro_no_gerenciador(manager, id_node_tabuleiro) {
    let node_tabuleiro = document.getElementById(id_node_tabuleiro);
    console.assert(node_tabuleiro != null);
    let linhas = node_tabuleiro.getElementsByClassName("linha-tabuleiro");
    console.assert(linhas.length > 0);
    append_dom_nodes_linhas(manager, linhas);
    let dom_nodes_letras = new Array(linhas.length);
    for (let i = 0; i < dom_nodes_letras.length; i++) {
        dom_nodes_letras[i] = linhas[i].getElementsByClassName("letra-tabuleiro");
    }
    append_dom_nodes_letras(manager, dom_nodes_letras);
}
