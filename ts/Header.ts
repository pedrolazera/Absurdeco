function adiciona_on_clicks_no_cabecalho(container_node: any,
	open_modal: any, close_node: any) {
	// fecha modal
	console.assert(container_node != null)
	console.assert(close_node != null)
	console.assert(open_modal != null)

	close_node.addEventListener("click",
									() => container_node.classList.remove("show"),
									false);

	open_modal.addEventListener("click",
									() => container_node.classList.add("show"),
									false);
}