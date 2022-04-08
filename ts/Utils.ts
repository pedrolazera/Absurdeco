function insertion_sort(v: number[], size: number) {
	let key, j, k, tmp;

	for(j = 1; j < size; j++) {
		key = v[j];
		// insert key in the correct position in array v[ini...j]
		/// right-shift everyone > key
		k = j-1;
		while( (k >= 0) && (v[k]>key) ) {
			v[k+1] = v[k];
			k = k-1;
		}

		v[k+1] = key;
	}
}

function insertion_sort_indirect(v: number[], size: number, values: number[],
	rev: boolean) {
	let key, j, k, tmp;
	let val;
	let rev_mul = (rev ? -1 : 1);

	for(j = 1; j < size; j++) {
		key = v[j];
		val = values[key]

		// insert key in the correct position in array v[ini...j]
		/// right-shift everyone > key
		k = j-1;
		while( (k >= 0) && (values[v[k]]*rev_mul>val*rev_mul) ) {
			v[k+1] = v[k];
			k = k-1;
		}

		v[k+1] = key;
	}
}

function create_identity_array(size: number): number[] {
	let v = new Array(size);
	set_identity(v);
	return v;
}

function set_identity(v: number[]): void {
	for(let i = 0; i < v.length; i++) {
		v[i] = i;
	}
}

function cmp_arrays(v1: number[], v2: number[]): boolean {
	if(v1.length != v2.length) {
		return false;
	}

	for(let i = 0; i < v1.length; i++) {
		if(v1[i] != v2[i]) {
			return false
		}
	}

	return true;
}

function create_zero_array(size: number): number[] {
	let v = new Array(size);
	v.fill(0);
	return v;
}

function array_sum(v: number[]) {
	let s = 0;
	for(let i = 0; i < v.length; i++) {
		s += v[i];
	}

	return s;
}

function array_copy_to(src: number[], dst: number[]): void {
	for(let i = 0; i < src.length; i++) {
		dst[i] = src[i];
	}
}

function array_create_copy(v: number[]): number[] {
	let v2 = new Array(v.length);
	array_copy_to(v, v2);
	return v2;
}