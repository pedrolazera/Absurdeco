/// <reference path="./../Wordle.ts" />
/// <reference path="./../Layer.ts" />
/// <reference path="./../Utils.ts" />

function __test_wordle() {
	let W = create_wordle_PT();
	let i = 38;
	create_partition(W.layers[0], W.layers[1], W.colors, i);

	let Sj = W.layers[1];
	
	insertion_sort_indirect(Sj.partitions, Sj.qtd_partitions, Sj.p_sizes, false);
	let tmp_sizes = new Array(Sj.qtd_partitions);
	for(let k = 0; k < tmp_sizes.length; k++) { tmp_sizes[k] = Sj.p_sizes[Sj.partitions[k]]; }
	console.assert(cmp_arrays(tmp_sizes, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,6,6,7,7,7,7,8,8,9,9,10,10,10,13,14,15,15,16,17,17,18,20,20,22,23,24,24,29,32,33,36,39,51,73,75,76,85,108,116,211]))
}