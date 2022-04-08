/// <reference path="./../Utils.ts" />

function __test_utils() {
	console.log("\n\nTEST UTILS\n");
	let N = 10;
	let v = create_identity_array(N);
	console.assert(cmp_arrays(v, [0,1,2,3,4,5,6,7,8,9]));

	N = 50;
	v = create_identity_array(N); // v[i] = i
	let f_v = new Array(v.length); // f_v[i] = (i-5)*(20-i);
	for(let i = 0; i < v.length; i++)
		f_v[i] = (i-5)*(20-i);

	insertion_sort(f_v, 30);
	console.assert(cmp_arrays(f_v, [-216,-184,-154,-126,-100,-100,-76,-76,-54,-54,-34,-34,-16,-16,0,0,14,14,26,26,36,36,44,44,50,50,54,54,56,56,-250,-286,-324,-364,-406,-450,-496,-544,-594,-646,-700,-756,-814,-874,-936,-1000,-1066,-1134,-1204,-1276]));

	N = 50;
	v = create_identity_array(N); // v[i] = i
	f_v = new Array(v.length); // f_v[i] = (i-5)*(20-i);
	for(let i = 0; i < v.length; i++)
		f_v[i] = (i-5)*(20-i);

	insertion_sort_indirect(v, 30, f_v, false);
	console.assert(cmp_arrays(v, [29,28,27,26,0,25,1,24,2,23,3,22,4,21,5,20,6,19,7,18,8,17,9,16,10,15,11,14,12,13,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49]));
}