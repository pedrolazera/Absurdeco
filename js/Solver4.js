"use strict";
function create_solver4(max_depth, W, branch_size) {
    let caps = get_capacities4(W);
    let max_cap = Math.max(...caps);
    let N = W.lexicon_size;
    let new_P = new Array(max_depth);
    let LBs = new Array(max_depth);
    let cumLBs = new Array(max_depth);
    for (let i = 0; i < max_cap; i++) {
        new_P[i] = create_zero_array(branch_size);
        LBs[i] = create_zero_array(N);
        cumLBs[i] = create_zero_array(N);
    }
    return {
        opt: _NULL_SOL,
        i: _NULL_SOL,
        color: _NULL_SOL,
        max_depth: max_depth,
        min_depth: 0,
        curr_seen_id: 0,
        UBs: create_zero_array(N),
        seens: create_zero_array(W.qtd_colors),
        sizes: create_zero_array(W.qtd_colors),
        new_P: new_P,
        ix: create_zero_array(N),
        branch_size: branch_size,
        caps: caps,
        max_cap: max_cap,
        LBs: LBs,
        cumLBs: cumLBs
    };
}
function _g_max4(solver, W, alpha, beta, depth) {
    let color, Sj, val_color;
    Sj = W.layers[depth + 1];
    insertion_sort_indirect(Sj.partitions, Sj.qtd_partitions, Sj.p_sizes, true);
    for (let k = 0; k < Sj.qtd_partitions; k++) {
        color = Sj.partitions[k];
        update_layer(Sj, color);
        if (Sj.p_sizes[color] <= alpha) {
            break;
        }
        val_color = _f_min4(solver, W, alpha, beta, depth + 1);
        if (val_color > alpha) {
            alpha = val_color;
            if (depth == solver.min_depth) {
                solver.color = color;
            }
        }
        if (alpha >= beta) {
            break;
        }
    }
    return alpha;
}
function _f_min4(solver, W, alpha, beta, depth) {
    let opt, S, Sj, i, val_i;
    let new_P, LBs, cumLBs;
    if (depth > W.guesses_limit) {
        return _INF;
    }
    S = W.layers[depth];
    opt = f_min_terminal4(solver, W, depth);
    if (opt != _NULL_SOL) {
        return opt;
    }
    if (depth >= solver.max_depth) {
        return S.len;
    }
    opt = f_min_special4(solver, W, alpha, beta, depth);
    if (opt != _NULL_SOL) {
        return opt;
    }
    Sj = W.layers[depth + 1];
    alpha = Math.max(alpha, get_lb4(solver, S.len));
    if (beta <= alpha) {
        return beta;
    }
    set_moves_and_bounds(solver, W, alpha, beta, depth);
    new_P = solver.new_P[depth];
    LBs = solver.LBs[depth];
    cumLBs = solver.cumLBs[depth];
    for (i of new_P) {
        if (cumLBs[i] >= beta) {
            break;
        }
        if (LBs[i] >= beta) {
            continue;
        }
        create_partition(S, Sj, W.colors, i);
        if ((Sj.qtd_partitions == 1) && (Sj.p_sizes[Sj.partitions[0]] == S.len)) {
            continue;
        }
        val_i = 1 + _g_max4(solver, W, alpha - 1, beta - 1, depth);
        if (val_i < beta) {
            beta = val_i;
            if (depth == solver.min_depth) {
                solver.i = i;
            }
        }
    }
    return beta;
}
function f_min_terminal4(solver, W, depth) {
    let S = W.layers[depth];
    if (S.len == 1) {
        if (depth == solver.min_depth) {
            solver.i = S.head;
        }
        return 1;
    }
    else if (S.len == solver.min_depth) {
        if (depth == solver.min_depth) {
            solver.i = S.head;
        }
        return 2;
    }
    else {
        return _NULL_SOL;
    }
}
function f_min_special4(solver, W, alpha, beta, depth) {
    let S = W.layers[depth];
    if (S.len == 3) {
        return _F_3(solver, W.colors, W.ids, S, W.map_j_to_i, depth);
    }
    else {
        return _NULL_SOL;
    }
}
function _F_3(solver, colors, P, S, map_j_to_i, depth) {
    let _j1, _j2, _j3;
    let j1, j2, j3, i;
    _j1 = S.head;
    _j2 = S.nexts[_j1];
    _j3 = S.nexts[_j2];
    j1 = map_j_to_i[_j1];
    j2 = map_j_to_i[_j2];
    j3 = map_j_to_i[_j3];
    if (colors[j1][_j2] != colors[j1][_j3]) {
        if (depth == solver.min_depth) {
            solver.i = j1;
        }
        return 2;
    }
    else if (colors[j2][_j1] != colors[j2][_j3]) {
        if (depth == solver.min_depth) {
            solver.i = j2;
        }
        return 2;
    }
    else if (colors[j3][_j1] != colors[j3][_j2]) {
        if (depth == solver.min_depth) {
            solver.i = j3;
        }
        return 2;
    }
    for (i of P) {
        if ((colors[i][_j1] != colors[i][_j2])
            && (colors[i][_j1] != colors[i][_j3])
            && (colors[i][_j2] != colors[i][_j3])) {
            if (depth == solver.min_depth) {
                solver.i = i;
            }
            return 2;
        }
    }
    return 3;
}
function set_moves_and_bounds(solver, W, alpha, beta, depth) {
    let S = W.layers[depth];
    let P = W.ids;
    let UBs = solver.UBs;
    let sizes = solver.sizes;
    let seens = solver.seens;
    let new_P = solver.new_P[depth];
    let curr_seen_id = solver.curr_seen_id;
    let ix = solver.ix;
    let LBs = solver.LBs[depth];
    let cumLBs = solver.cumLBs[depth];
    let min_lb = _INF;
    let best_i = _NULL_SOL;
    let beta_in = beta;
    alpha = Math.max(alpha, get_lb(solver, S.len));
    let i, _j, _i, color, prev, curr;
    for (i of P) {
        if (beta <= alpha) {
            break;
        }
        _i = W.map_i_to_j[i];
        UBs[i] = 0;
        LBs[i] = _get_lb4(solver, S.len, i);
        curr_seen_id += 1;
        _j = S.head;
        while (_j != _NULL_ID) {
            if (_i == _j) {
                _j = S.nexts[_j];
                continue;
            }
            color = W.colors[i][_j];
            if (seens[color] != curr_seen_id) {
                sizes[color] = 0;
                seens[color] = curr_seen_id;
            }
            sizes[color] += 1;
            UBs[i] = Math.max(UBs[i], 1 + sizes[color]);
            LBs[i] = Math.max(LBs[i], 1 + get_lb4(solver, sizes[color]));
            if (LBs[i] >= beta) {
                UBs[i] = _INF;
                break;
            }
            _j = S.nexts[_j];
        }
        min_lb = Math.min(min_lb, LBs[i]);
        beta = Math.min(beta, UBs[i]);
        if ((best_i == _NULL_SOL) || (UBs[i] < UBs[best_i])) {
            best_i = i;
        }
    }
    solver.curr_seen_id = curr_seen_id;
    if ((beta_in <= alpha) || (min_lb >= beta_in)) {
        new_P[0] = 1;
        cumLBs[new_P[0]] = _INF;
    }
    else if (UBs[best_i] <= min_lb) {
        new_P[0] = best_i;
        new_P[1] = (best_i == 0 ? 1 : 0);
        cumLBs[new_P[0]] = LBs[new_P[0]];
        cumLBs[new_P[1]] = _INF;
        LBs[new_P[1]] = _INF;
    }
    else {
        set_identity(ix);
        ix.sort((a, b) => UBs[a] - UBs[b]);
        new_P[solver.branch_size - 1] = P[ix[solver.branch_size - 1]];
        prev = new_P[solver.branch_size - 1];
        cumLBs[prev] = LBs[prev];
        for (i = solver.branch_size - 2; i >= 0; i--) {
            new_P[i] = P[ix[i]];
            curr = new_P[i];
            cumLBs[curr] = Math.min(LBs[curr], cumLBs[prev]);
            prev = curr;
        }
    }
}
function get_capacities4(W) {
    let i, color, M, _j, _i;
    let caps = new Array(W.lexicon_size);
    let _v = new Array(W.qtd_colors);
    M = W.colors[0].length;
    for (i of W.ids) {
        _v.fill(0);
        _i = W.map_i_to_j[i];
        for (_j = 0; _j < M; _j++) {
            if (_i == _j) {
                continue;
            }
            color = W.colors[i][_j];
            _v[color] = 1;
        }
        caps[i] = array_sum(_v);
    }
    return caps;
}
function get_lb4(solver, len_S) {
    if (len_S == 1) {
        return 1;
    }
    else if (len_S - 1 <= solver.max_cap) {
        return 2;
    }
    else {
        return 3;
    }
}
function _get_lb4(solver, len_S, i) {
    if (len_S == 1) {
        return 1;
    }
    else if (len_S - 1 <= solver.caps[i]) {
        return 2;
    }
    else {
        return 3;
    }
}
