"use strict";
const _NULL_SOL = -1;
const _INF = 1000000;
function create_solver(max_depth) {
    return {
        opt: _NULL_SOL,
        i: _NULL_SOL,
        color: _NULL_SOL,
        max_depth: max_depth
    };
}
function _g_max(solver, W, alpha, beta, depth) {
    let color, Sj, val_color;
    Sj = W.layers[depth + 1];
    insertion_sort_indirect(Sj.partitions, Sj.qtd_partitions, Sj.p_sizes, true);
    for (let k = 0; k < Sj.qtd_partitions; k++) {
        color = Sj.partitions[k];
        update_layer(Sj, color);
        if (Sj.p_sizes[color] <= alpha) {
            break;
        }
        val_color = _f_min(solver, W, alpha, beta, depth + 1);
        if (val_color > alpha) {
            alpha = val_color;
            if (depth == 0) {
                solver.color = color;
            }
        }
        if (alpha >= beta) {
            break;
        }
    }
    return alpha;
}
function _f_min(solver, W, alpha, beta, depth) {
    let opt, S, Sj, i, val_i;
    if (depth > W.guesses_limit) {
        return _INF;
    }
    S = W.layers[depth];
    opt = f_min_terminal(solver, W, depth);
    if (opt != _NULL_SOL) {
        return opt;
    }
    if (depth >= solver.max_depth) {
        return S.len;
    }
    opt = f_min_special(solver, W, alpha, beta, depth);
    if (opt != _NULL_SOL) {
        return opt;
    }
    Sj = W.layers[depth + 1];
    alpha = Math.max(alpha, get_lb(solver, S.len));
    for (i of get_moves(solver, W, depth)) {
        if (beta <= alpha) {
            break;
        }
        create_partition(S, Sj, W.colors, i);
        if ((Sj.qtd_partitions == 1) && (Sj.p_sizes[Sj.partitions[0]] == S.len)) {
            continue;
        }
        val_i = 1 + _g_max(solver, W, alpha - 1, beta - 1, depth);
        if (val_i < beta) {
            beta = val_i;
            if (depth == 0) {
                solver.i = i;
            }
        }
    }
    return beta;
}
function f_min_terminal(solver, W, depth) {
    let S = W.layers[depth];
    if (S.len == 1) {
        return 1;
    }
    else if (S.len == 2) {
        return 2;
    }
    else {
        return _NULL_SOL;
    }
}
function get_moves(solver, W, depth) {
    return W.ids;
}
function get_lb(solver, S_len) {
    return 0;
}
function f_min_special(solver, W, alpha, beta, depth) {
    return _NULL_SOL;
}
