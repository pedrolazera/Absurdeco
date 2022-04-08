"use strict";
const _NULL_ID = -1;
function create_layer(max_size, qtd_colors, map_i_to_j) {
    let head = 0;
    let nexts = new Array(max_size);
    for (let i = 0; i < max_size - 1; i++) {
        nexts[i] = i + 1;
    }
    nexts[max_size - 1] = _NULL_ID;
    let seens = new Array(qtd_colors);
    let p_ids = new Array(max_size);
    seens.fill(0);
    p_ids.fill(0);
    return {
        head: 0,
        len: max_size,
        nexts: nexts,
        qtd_partitions: 0,
        partitions: new Array(qtd_colors),
        seens: seens,
        p_sizes: new Array(qtd_colors),
        p_heads: new Array(qtd_colors),
        p_ids: p_ids,
        curr_id: 0,
        map_i_to_j: map_i_to_j
    };
}
function update_layer(C, cor) {
    _update_layer(C, C.p_heads[cor], C.p_sizes[cor]);
}
function update_layer_from_array(C, v) {
    console.assert(Math.min(...v) >= 0, "Math.min(...v) >= 0");
    console.assert(Math.max(...v) <= C.nexts.length, "Math.max(...v) <= C.nexts.length");
    C.head = v[0];
    for (let i = 0; i < v.length - 1; i++) {
        C.nexts[v[i]] = v[i + 1];
    }
    C.nexts[v[v.length - 1]] = _NULL_ID;
    C.curr_id += 1;
    for (let vi of v) {
        C.p_ids[vi] = C.curr_id;
    }
    C.len = v.length;
}
function _update_layer(C, new_head, new_len) {
    C.head = new_head;
    C.len = new_len;
}
function create_partition(C1, C2, colors, i) {
    let color, old_id, curr_id, _j, head_j, _i;
    old_id = C2.curr_id;
    curr_id = old_id;
    C2.qtd_partitions = 0;
    _i = C1.map_i_to_j[i];
    _j = C1.head;
    while (_j != _NULL_ID) {
        if (_i == _j) {
            _j = C1.nexts[_j];
            continue;
        }
        color = colors[i][_j];
        if (C2.seens[color] <= old_id) {
            curr_id += 1;
            C2.nexts[_j] = _NULL_ID;
            C2.seens[color] = curr_id;
            C2.p_heads[color] = _j;
            C2.p_sizes[color] = 1;
            C2.p_ids[_j] = curr_id;
            C2.partitions[C2.qtd_partitions] = color;
            C2.qtd_partitions += 1;
        }
        else {
            head_j = C2.p_heads[color];
            C2.nexts[_j] = head_j;
            C2.p_heads[color] = _j;
            C2.p_sizes[color] += 1;
            C2.p_ids[_j] = C2.p_ids[head_j];
        }
        _j = C1.nexts[_j];
    }
    C2.curr_id = curr_id;
}
function is_in(i, C) {
    let _i = C.map_i_to_j[i];
    return (_i >= 0) && (C.p_ids[C.head] == C.p_ids[_i]);
}
function create_layers(qtd_layers, max_size, qtd_colors, map_i_to_j) {
    let layers = new Array(qtd_layers);
    for (let i = 0; i < qtd_layers; i++) {
        layers[i] = create_layer(max_size, qtd_colors, map_i_to_j);
    }
    return layers;
}
function create_map_i_to_j(N, G_ids) {
    let M = G_ids.length;
    let map_i_to_j = new Array(N);
    let i, _j;
    map_i_to_j.fill(_NULL_ID);
    for (_j = 0; _j < M; _j++) {
        i = G_ids[_j];
        map_i_to_j[i] = _j;
    }
    return map_i_to_j;
}
function _layer_vectorize(C) {
    let v = new Array();
    let _j = C.head;
    while (_j != _NULL_ID) {
        v.push(_j);
        _j = C.nexts[_j];
    }
    return v;
}
function _layer_printa(C) {
    let v = _layer_vectorize(C);
    let str_v = v.join(",");
    console.log(str_v);
}
