/// <reference path="./../Layer.ts" />
/// <reference path="./../Utils.ts" />

function __test_layer() {
	console.log("\n\nTEST LAYER\n");
	let colors = [
		// 0   1   2   3   4   5   6   7   8   9  10  11  12
		[242,  1,  1,  1,  1,  1,  6,  6,  7,  7,  8,  8,  9], // A (0)
		[  6,242,  1,  2,  3,  4,  6,  6,  6,  7,  7,  7,  7], // B (1)
		[  6,  1,242,  2,  3,  4,  6,  6,  6,  7,  7,  7,  7], // C (2)
		[  6,  1,  2,242,  3,  4,  6,  6,  6,  7,  7,  7,  7], // D (3)
		[  6,  1,  2,  3,242,  4,  6,  6,  6,  7,  7,  7,  7], // E (4)
		[  6,  1,  2,  3,  4,242,  6,  6,  6,  7,  7,  7,  7], // F (5)
		[  6,  1,  2,  3,  4,  5,242,  6,  6,  7,  7,  7,  7], // G (6)
		[  6,  1,  2,  3,  4,  5,  6,242,  6,  7,  7,  7,  7], // H (7)
		[  6,  1,  2,  3,  4,  5,  6,  6,242,  7,  7,  7,  7], // I (8)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,242,  7,  7,  7], // J (9)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,  7,242,  7,  7], // K (10)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,  7,  7,242,  7], // L (11)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,  7,  7,  7,242]  // M (12)
	];

	// this time map_i_to_j is an identity
	let map_i_to_j = new Array(colors.length);
	for(let i = 0; i < map_i_to_j.length; i++) {
		map_i_to_j[i] = i;
	}

	let max_size = colors.length;
	let qtd_colors = 243;

	let L_1 = create_layer(max_size, qtd_colors, map_i_to_j);
	let L_2 = create_layer(max_size, qtd_colors, map_i_to_j);
	let L_3 = create_layer(max_size, qtd_colors, map_i_to_j);

	
	create_partition(L_1, L_2, colors, 0);

	console.assert(L_2.qtd_partitions == 5);

	console.assert(L_2.p_sizes[1] == 5);
	console.assert(L_2.p_sizes[6] == 2);
	console.assert(L_2.p_sizes[7] == 2);
	console.assert(L_2.p_sizes[8] == 2);
	console.assert(L_2.p_sizes[9] == 1);

	console.assert(L_2.p_heads[1] == 5);
	console.assert(L_2.p_heads[6] == 7);
	console.assert(L_2.p_heads[7] == 9);
	console.assert(L_2.p_heads[8] == 11);
	console.assert(L_2.p_heads[9] == 12);

	let cor = L_2.partitions[0]; // cor = 1
	update_layer(L_2, cor);
	console.assert(L_2.len == 5);
	console.assert(cmp_arrays([5,4,3,2,1], _layer_vectorize(L_2)));

	cor = L_2.partitions[1] // cor = 6
	update_layer(L_2, cor);
	console.assert(L_2.len == 2, "L_2.len == 2");
	console.assert(cmp_arrays([7,6], _layer_vectorize(L_2)));

	cor = L_2.partitions[0] // cor = 1
	update_layer(L_2, cor);
	create_partition(L_2, L_3, colors, 0);
	console.assert(L_3.qtd_partitions == 1, "L_3.len == 1");

	create_partition(L_2, L_3, colors, 1);
	console.assert(L_3.qtd_partitions == 4, "L_3.qtd_partitions == 4");
	update_layer(L_3, L_3.partitions[1]);
	console.assert(cmp_arrays([4], _layer_vectorize(L_3)));

	create_partition(L_2, L_3, colors, 7);
	console.assert(L_3.qtd_partitions == 5, "L_3.qtd_partitions == 5");


	///////////////////////////////////////
	//// change parition with a vector ////
	///////////////////////////////////////
	let v = [6,1,2,7,5];
	let layer = create_layer(10, 8, [0,1,2,3,4,5,5,6,7,8,9]);
	update_layer_from_array(layer, v);

	console.assert(layer.head == v[0]);
	console.assert(layer.len == v.length);
	console.assert(cmp_arrays(_layer_vectorize(layer), v));


	///////////////////////////////////////
	//// test p_ids ////
	///////////////////////////////////////
	colors = [
		//  0  1   2   3   4   5   6   7   8   9  10  11  12
		[242,  1,  1,  1,  1,  1,  6,  6,  7,  7,  8,  8,  9], // A (0)
		[  6,242,  1,  2,  3,  4,  6,  6,  6,  7,  7,  7,  7], // B (1)
		[  6,  1,242,  2,  3,  4,  6,  6,  6,  7,  7,  7,  7], // C (2)
		[  6,  1,  2,242,  3,  4,  6,  6,  6,  7,  7,  7,  7], // D (3)
		[  6,  1,  2,  3,242,  4,  6,  6,  6,  7,  7,  7,  7], // E (4)
		[  6,  1,  2,  3,  4,242,  6,  6,  6,  7,  7,  7,  7], // F (5)
		[  6,  1,  2,  3,  4,  5,242,  6,  6,  7,  7,  7,  7], // G (6)
		[  6,  1,  2,  3,  4,  5,  6,242,  6,  7,  7,  7,  7], // H (7)
		[  6,  1,  2,  3,  4,  5,  6,  6,242,  7,  7,  7,  7], // I (8)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,242,  7,  7,  7], // J (9)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,  7,242,  7,  7], // K (10)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,  7,  7,242,  7], // L (11)
		[  6,  1,  2,  3,  4,  5,  6,  6,  6,  7,  7,  7,242]  // M (12)
	]

	let qtd_layers;
	let c0, c1;
	let i;
	let color;

	max_size = colors.length;
	qtd_colors = 243
	qtd_layers = 2

	map_i_to_j = new Array(colors.length);
	for(let i = 0; i < map_i_to_j.length; i++) {
		map_i_to_j[i] = i;
	}

	let layers = create_layers(qtd_layers, max_size,
		qtd_colors, map_i_to_j);

	c0 = layers[0];
	c1 = layers[1];

	// create partition from guess i=1
	i = 1
	create_partition(c0, c1, colors, i);
	console.assert(c1.qtd_partitions == 6, "c1.qtd_partitions == 6");
	console.assert(c1.p_ids[1] != c1.p_ids[2], "c1.p_ids[1] != c1.p_ids[2]");
	console.assert(c1.p_ids[6] == c1.p_ids[8], "c1.p_ids[6] == c1.p_ids[8]");

	// test "is in"
	color = 6;
	update_layer(c1, color);
	console.assert(!is_in(1, c1), "!is_in(1, c1)");
	console.assert(is_in(7, c1), "is_in(7, c1)");
	
	///////////////////////////////////////
	//// test colors with |S| < |P| ////
	///////////////////////////////////////

	let G_ids;

	colors = [
		[1	,1	,6],
		[1	,4	,6],
		[242,4	,6],
		[2	,4	,6],
		[2	,4	,6],
		[2	,242,6],
		[2	,5,242],
		[2	,5	,6],
		[2	,5	,6],
		[2	,5	,6],
		[2	,5	,6],
		[2	,5	,6],
		[2	,5	,6]
	]

	G_ids = [3, 6, 7];
	qtd_colors = 243;

	/// map_i_to_j
	map_i_to_j = create_map_i_to_j(colors.length, G_ids);

	L_1 = create_layer(colors.length, qtd_colors, map_i_to_j);
	update_layer_from_array(L_1, [0,1,2]);
	console.assert(cmp_arrays([0,1,2], _layer_vectorize(L_1)), "(cmp_arrays(G_ids, _layer_vectorize(L_1))");
	create_partition(L_1, L_2, colors, 0);
	console.assert(L_2.qtd_partitions == 2, "L_2.qtd_partitions == 2");
	update_layer(L_2, 1);
	console.assert(cmp_arrays([1,0], _layer_vectorize(L_2)));
}