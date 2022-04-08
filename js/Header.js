"use strict";
function adiciona_on_clicks_no_cabecalho(container_node, open_modal, close_node) {
    console.assert(container_node != null);
    console.assert(close_node != null);
    console.assert(open_modal != null);
    close_node.addEventListener("click", () => container_node.classList.remove("show"), false);
    open_modal.addEventListener("click", () => container_node.classList.add("show"), false);
}
