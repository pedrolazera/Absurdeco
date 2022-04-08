// acoes
//// escrever uma letra
//// apagar uma letra
//// apagar uma letra sem existir letra
//// enviar palpite
//// enviar palpite sem existir palpite
"use strict";

const _CHAR_VAZIO = " "; // espaço vazio
const _ESTADO_MANAGER_ON = 0;
const _ESTADO_MANAGER_OFF = 1;

type T_Manager = {
	tam_palavra: number,
	limite_palpites: number,
	qtd_palpites_usados: number,
	camadas: T_Camada[],
	camada_ativa: T_Camada,
	estado: number,
	nodes_linhas: any[]
}

type T_Camada = {
	palavra: string[],
    qtd_letras_usadas: number,
    nodes: any[]
}

function cria_manager(tam_palavra: number,
	limite_palpites: number): T_Manager {
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
    }
}
function append_dom_nodes_letras(manager: T_Manager,
	dom_nodes: any): void {
    // asserts
    console.assert(dom_nodes.length == manager.limite_palpites);
    for (var i = 0; i < manager.limite_palpites; i++) {
        console.assert(dom_nodes[i].length == manager.tam_palavra);
    }

    // pendura cada no da arvore numa letra do gerenciador
    for (var i = 0; i < manager.limite_palpites; i++) {
        for (var j = 0; j < manager.tam_palavra; j++) {
            manager.camadas[i].nodes[j] = dom_nodes[i][j];
        }
    }
}
function append_dom_nodes_linhas(manager: T_Manager,
	dom_nodes: any): void {
    console.assert(dom_nodes.length == manager.limite_palpites);
    // pendura cada no da arvore numa linha (camada) do gerenciador
    for (var i = 0; i < manager.limite_palpites; i++) {
        manager.nodes_linhas[i] = dom_nodes[i];
    }
    // ativa linha zero
    manager.nodes_linhas[0].classList.add("linha-ativa");
}
function get_palavra_ativa(manager: T_Manager): string {
    if (!camada_is_cheia(manager.camada_ativa)) {
        return "";
    }
    return manager.camada_ativa.palavra.join("");
}
function avanca_uma_camada(manager: T_Manager): boolean {
    if (!camada_is_cheia(manager.camada_ativa)) {
        return false;
    }
    // muda classe (na arvore dom) da linha
    manager.nodes_linhas[manager.qtd_palpites_usados].classList.remove("linha-ativa");
    manager.qtd_palpites_usados += 1;
    // se possivel, avanca uma camada
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
function escreve_letra(manager: T_Manager, letra: string): boolean {
    console.assert(letra.length == 1);
    // casos em que a letra nao sera escrita
    if (manager.estado == _ESTADO_MANAGER_OFF) {
        return false;
    }
    if (camada_is_cheia(manager.camada_ativa)) {
        return false;
    }
    // escreve na camada ativa
    escreve_letra_na_camada(manager.camada_ativa, letra);
    return true;
}
function apaga_letra(manager: T_Manager): boolean {
    // casos em que nenhuma letra ser apagada
    //// 1. o jogo acabou
    if (manager.estado == _ESTADO_MANAGER_OFF) {
        return false;
    }
    //// 2. a camada atual nao tem nada escrito
    if (camada_is_vazia(manager.camada_ativa)) {
        return false;
    }
    // trocar letra mais à direita da camada ativa por _CHAR_VAZIO
    let c = manager.camada_ativa;
    c.palavra[c.qtd_letras_usadas - 1] = _CHAR_VAZIO;
    c.nodes[c.qtd_letras_usadas - 1].textContent = _CHAR_VAZIO;
    c.qtd_letras_usadas -= 1;
    return true;
}

function escreve_letra_na_camada(c: T_Camada, letra: string): boolean {
    console.assert(letra.length == 1);
    if (camada_is_cheia(c)) {
        return false;
    }
    c.palavra[c.qtd_letras_usadas] = letra;
    c.nodes[c.qtd_letras_usadas].textContent = letra;
    c.qtd_letras_usadas += 1;
    return true;
}

function camada_is_cheia(c: T_Camada): boolean {
    return c.qtd_letras_usadas == (c.palavra.length);
}

function camada_is_vazia(c: T_Camada): boolean {
    return c.qtd_letras_usadas == 0;
}

function _repeat(c: string, count: number): string[] {
    console.assert(c.length == 1);
    let v = new Array(count);
    for (let i = 0; i < count; i++) {
        v[i] = c;
    }
    return v;
}
