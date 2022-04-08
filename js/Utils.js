"use strict";
function insertion_sort(v, size) {
    let key, j, k, tmp;
    for (j = 1; j < size; j++) {
        key = v[j];
        k = j - 1;
        while ((k >= 0) && (v[k] > key)) {
            v[k + 1] = v[k];
            k = k - 1;
        }
        v[k + 1] = key;
    }
}
function insertion_sort_indirect(v, size, values, rev) {
    let key, j, k, tmp;
    let val;
    let rev_mul = (rev ? -1 : 1);
    for (j = 1; j < size; j++) {
        key = v[j];
        val = values[key];
        k = j - 1;
        while ((k >= 0) && (values[v[k]] * rev_mul > val * rev_mul)) {
            v[k + 1] = v[k];
            k = k - 1;
        }
        v[k + 1] = key;
    }
}
function create_identity_array(size) {
    let v = new Array(size);
    set_identity(v);
    return v;
}
function set_identity(v) {
    for (let i = 0; i < v.length; i++) {
        v[i] = i;
    }
}
function cmp_arrays(v1, v2) {
    if (v1.length != v2.length) {
        return false;
    }
    for (let i = 0; i < v1.length; i++) {
        if (v1[i] != v2[i]) {
            return false;
        }
    }
    return true;
}
function create_zero_array(size) {
    let v = new Array(size);
    v.fill(0);
    return v;
}
function array_sum(v) {
    let s = 0;
    for (let i = 0; i < v.length; i++) {
        s += v[i];
    }
    return s;
}
function array_copy_to(src, dst) {
    for (let i = 0; i < src.length; i++) {
        dst[i] = src[i];
    }
}
function array_create_copy(v) {
    let v2 = new Array(v.length);
    array_copy_to(v, v2);
    return v2;
}
