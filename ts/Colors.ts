const _A_NUM = 'a'.charCodeAt(0);
const _ALPHABET_SIZE = 26;
const _TERNARIO = [3 ** 4, 3 ** 3, 3 ** 2, 3 ** 1, 3 ** 0];
const _GREEN = 2;
const _YELLOW = 1;
const _RED = 0;
const _IS_GREEN = [0, 0, 0, 0, 0];

function compute_colors(lexicon: string[], G_ids: number[]) {
	console.assert(lexicon.length >= 1);

	let N = lexicon.length;

	let colors = new Array(N);
	let lexicon_rel = new Array(N);
	let frequencies = new Array(N);

	for(let i = 0; i < N; i++) {
		lexicon_rel[i] = char_to_nums(lexicon[i]);
		frequencies[i] = get_frequency(lexicon_rel[i]);
	}

	let _word_size = lexicon[1].length;
	let _freq_j: number[] = new Array(_ALPHABET_SIZE);

	for(let i = 0; i<N; i++) {
		colors[i] = new Array(N);
		//colors[i] = new Object();
		for(let j of G_ids) {
			copy_to(frequencies[j], _freq_j);
			colors[i][j] = _compute_color(
				lexicon_rel[i],
				lexicon_rel[j],
				_freq_j
			);
		}
	}

	return colors;
}

function compute_colors2(lexicon: string[], G_ids: number[]) {
	console.assert(lexicon.length >= 1);

	let N = lexicon.length;
	let M = G_ids.length;

	let colors = new Array(N);
	let lexicon_rel = new Array(N);
	let frequencies = new Array(M);
	let bit_masks = new Array(N);

	for(let i = 0; i < N; i++) {
		lexicon_rel[i] = char_to_nums(lexicon[i]);
		bit_masks[i] = get_bit_mask(lexicon_rel[i]);
	}

	for(let j = 0; j < M; j++) {
		frequencies[j] = get_frequency(lexicon_rel[G_ids[j]]);
	}

	let _freq_j: number[] = new Array(_ALPHABET_SIZE);
	let cnt = 0;
	for(let i = 0; i<N; i++) {
		colors[i] = new Array(M);
		for(let j = 0; j < M; j++) {
			
			if( (bit_masks[i] & bit_masks[G_ids[j]]) == 0) {
				colors[i][j] = 0;
				cnt += 1;
				continue;
			}

			copy_to(frequencies[j], _freq_j);
			colors[i][j] = _compute_color(
				lexicon_rel[i],
				lexicon_rel[G_ids[j]],
				_freq_j
			);
		}
	}

	return colors;
}

function compute_colors3(lexicon: string[], G_ids: number[]) {
	console.assert(lexicon.length >= 1);

	let N = lexicon.length;
	let M = G_ids.length;

	let colors = new Array(N);
	let lexicon_rel = new Array(N);
	let frequencies = new Array(M);
	let is_in_G_ids = new Array(N);

	let i, j, _i, _j;
	let j1, j2, _j1, _j2;

	for(i = 0; i < N; i++) {
		lexicon_rel[i] = char_to_nums(lexicon[i]);
	}

	for(_j = 0; _j < M; _j++) {
		j = G_ids[_j]
		frequencies[_j] = get_frequency(lexicon_rel[j]);
	}
	
	////// compute is_in_G_ids
	is_in_G_ids.fill(0);
	for(j of G_ids) {
		is_in_G_ids[j] = 1;
	}

	let _word_size = lexicon[1].length;
	let _freq_j: number[] = new Array(_ALPHABET_SIZE);
	let _freq_j1: number[] = new Array(_ALPHABET_SIZE);
	let _freq_j2: number[] = new Array(_ALPHABET_SIZE);

	// allocate space for colors
	for(i = 0; i<N; i++) {
		colors[i] = new Array(M);
	}

	// compute colors of S
	let _aux = [0,0];
	for(_j1 = 0; _j1 < M; _j1++) {
		j1 = G_ids[_j1]
		colors[j1][_j1] = 242;

		for(_j2 = _j1+1; _j2 < M; _j2++) {
			copy_to(frequencies[_j1], _freq_j1);
			copy_to(frequencies[_j2], _freq_j2);
			
			j2 = G_ids[_j2]

			_compute_both_colors(
				lexicon_rel[j1], lexicon_rel[j2],
				_freq_j1, _freq_j2, _aux);
			
			colors[j1][_j2] = _aux[0];
			colors[j2][_j1] = _aux[1];
		}
	}

	// compute colors of P-S
	for(i = 0; i<N; i++) {
		if(is_in_G_ids[i]) { continue; }
		for(let _j = 0; _j < M; _j++) {
			j = G_ids[_j]
			copy_to(frequencies[_j], _freq_j);
			colors[i][_j] = _compute_color(lexicon_rel[i],
				lexicon_rel[j], _freq_j);
		}
	}

	return colors;
}

function compute_colors4(lexicon: string[], G_ids: number[]) {
	console.assert(lexicon.length >= 1);

	let N = lexicon.length;
	let M = G_ids.length;

	let colors = new Array(N);
	let lexicon_rel = new Array(N);
	let frequencies = new Array(M);
	let bit_masks = new Array(N);

	for(let i = 0; i < N; i++) {
		lexicon_rel[i] = char_to_nums(lexicon[i]);
		bit_masks[i] = get_bit_mask(lexicon_rel[i]);
	}

	for(let j = 0; j < M; j++) {
		frequencies[j] = get_frequency(lexicon_rel[G_ids[j]]);
	}

	let _freq_j: number[] = new Array(_ALPHABET_SIZE);
	let cnt = 0;
	let guess, target, color;
	for(let i = 0; i<N; i++) {
		colors[i] = new Array(M);
		for(let j = 0; j < M; j++) {
			
			if( (bit_masks[i] & bit_masks[G_ids[j]]) == 0) {
				colors[i][j] = 0;
				cnt += 1;
				continue;
			}

			copy_to(frequencies[j], _freq_j);
			/////////////////////////////
			guess = lexicon_rel[i];
			target = lexicon_rel[G_ids[j]];
			color = 0;

			// GREEN
			for(let k = 0; k < guess.length; k++) {
				if(guess[k] == target[k]) {
					color += _GREEN * _TERNARIO[k];
					_freq_j[target[k]] -= 1;
					_IS_GREEN[k] = 1;
				}
			}

			// YELLOW, RED
			for(let k = 0; k < guess.length; k++) {
				if(_IS_GREEN[k]) {
					_IS_GREEN[k] = 0;
					continue;
				}

				if(_freq_j[guess[k]] > 0) {
					color += _YELLOW * _TERNARIO[k];
					_freq_j[guess[k]] -= 1;
				}
			}

			colors[i][j] = color;
			/////////////////////////////
		}
	}

	return colors;
}

function compute_colors5(lexicon: string[], G_ids: number[]) {
	console.assert(lexicon.length >= 1);

	let N = lexicon.length;
	let M = G_ids.length;

	let colors = new Array(N);
	let lexicon_rel = new Array(N);
	let frequencies = new Array(M); // this one has size MMMM!
	let bit_masks = new Array(N);

	let _freq_j: number[] = new Array(_ALPHABET_SIZE);
	let s_rel_j, bit_mask_j;

	let i, j;

	for(i = 0; i < N; i++) {
		lexicon_rel[i] = char_to_nums(lexicon[i]);
		bit_masks[i] = get_bit_mask(lexicon_rel[i]);
		colors[i] = new Array(M);
	}

	for(j = 0; j < M; j++) {
		frequencies[j] = get_frequency(lexicon_rel[G_ids[j]]);
	}

	_freq_j.fill(0);

	let chr0, chr1, chr2, chr3, chr4;
	let fj0, fj1, fj2, fj3, fj4;

	for(j = 0; j < M; j++) {
		s_rel_j = lexicon_rel[G_ids[j]];
		bit_mask_j = bit_masks[G_ids[j]];

		// ugly, but faster...
		chr0 = s_rel_j[0];
		chr1 = s_rel_j[1];
		chr2 = s_rel_j[2];
		chr3 = s_rel_j[3];
		chr4 = s_rel_j[4];

		fj0 = frequencies[j][chr0];
		fj1 = frequencies[j][chr1];
		fj2 = frequencies[j][chr2];
		fj3 = frequencies[j][chr3];
		fj4 = frequencies[j][chr4];

		for(i = 0; i < N; i++) {
			if( (bit_masks[i] & bit_mask_j) == 0) {
				colors[i][j] = 0;
				continue;
			}

			// ugly, but faster...
			_freq_j[chr0] = fj0;
			_freq_j[chr1] = fj1;
			_freq_j[chr2] = fj2;
			_freq_j[chr3] = fj3;
			_freq_j[chr4] = fj4;

			colors[i][j] = _compute_color(
				lexicon_rel[i],
				s_rel_j,
				_freq_j,
			);			
		}

		// ugly, but faster...
		_freq_j[chr0] = 0;
		_freq_j[chr1] = 0;
		_freq_j[chr2] = 0;
		_freq_j[chr3] = 0;
		_freq_j[chr4] = 0;
	}

	return colors;
}

function copy_to(src: number[], dst: number[]): void {
	for(let i = 0; i < src.length; i++) {
		dst[i] = src[i];
	}
}

function _compute_color(guess: number[], target: number[],
	freq_g: number[]): number {
	let color = 0;

	// GREEN
	for(let i = 0; i < guess.length; i++) {
		if(guess[i] == target[i]) {
			color += _GREEN * _TERNARIO[i];
			freq_g[target[i]] -= 1;
			_IS_GREEN[i] = 1;
		}
	}

	// YELLOW, RED
	for(let i = 0; i < guess.length; i++) {
		if(_IS_GREEN[i]) {
			_IS_GREEN[i] = 0;
			continue;
		}

		if(freq_g[guess[i]] > 0) {
			color += _YELLOW * _TERNARIO[i];
			freq_g[guess[i]] -= 1;
		}
	}

	return color;
}

function _compute_both_colors(w1: number[], w2: number[],
	freq_w1: number[], freq_w2: number[],
	resp: number[]): void {
	let color_12 = 0;
	let color_21 = 0;

	// GREEN
	for(let i = 0; i < w1.length; i++) {
		if(w1[i] == w2[i]) {
			color_12 += _GREEN * _TERNARIO[i];
			color_21 += _GREEN * _TERNARIO[i];
			freq_w2[w2[i]] -= 1;
			freq_w1[w1[i]] -= 1;
			_IS_GREEN[i] = 1;
		}
	}

	// YELLOW, RED
	for(let i = 0; i < w1.length; i++) {
		if(_IS_GREEN[i]) {
			_IS_GREEN[i] = 0;
			continue;
		}

		if(freq_w2[w1[i]] > 0) {
			color_12 += _YELLOW * _TERNARIO[i];
			freq_w2[w1[i]] -= 1;
		}

		if(freq_w1[w2[i]] > 0) {
			color_21 += _YELLOW * _TERNARIO[i];
			freq_w1[w2[i]] -= 1;
		}
	}

	resp[0] = color_12;
	resp[1] = color_21;
}

function char_to_nums(s: string): number[] {
	var v: number[] = new Array(s.length);
	for(var i = 0; i < v.length; i++) {
		v[i] = s[i].charCodeAt(0) - _A_NUM;
	}

	return v;
}

function get_frequency(s_rel: number[]): number[] {
	let frequency: number[] = new Array(_ALPHABET_SIZE);
	frequency.fill(0);
	for(let letra_rel of s_rel) {
		frequency[letra_rel] += 1;
	}

	return frequency;
}

function get_bit_mask(s_rel: number[]): number {
	let mask = 0;
	for(let chr_rel of s_rel) {
		mask = mask | (1<<chr_rel);
	}

	return mask;
}


