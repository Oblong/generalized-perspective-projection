const assert = require('assert');

const dot = function(a, b) {
    'use strict';
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

const cross = function(u, v) {
    'use strict';
    return [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0],
    ];
};

const sub = function(a, b) {
    'use strict';
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
};

const length = function(a) {
    'use strict';
    return Math.sqrt(dot(a, a));
};

const normalize = function(a) {
    'use strict';
    const s = 1.0 / length(a);
    return [s * a[0], s * a[1], s * a[2]];
};

const matmul = function(a, b) {
    'use strict';
    let c = [];
    c.length = 16;
    let i;
    let j;
    let k;
    let l;
    for (l = 0; l < 16; l += 1) {
        c[l] = 0.0;
    }
    for (i = 0; i < 4; i += 1) {
        for (j = 0; j < 4; j += 1) {
            for (k = 0; k < 4; k += 1) {
                const aidx = i + 4.0 * k;
                const bidx = k + 4.0 * j;
                const cidx = i + 4.0 * j;
                const aval = a[aidx];
                const bval = b[bidx];
                c[cidx] += aval * bval;
            }
        }
    }
    return c;
};

// Calculate the generalized perspective projection matrix
// given the positions of 3 screen corners, the camera position,
// and the near and far plane
// See http://csc.lsu.edu/~kooima/pdfs/gen-perspective.pdf
module.exports = function(pa, pb, pc, pe, n, f) {
    'use strict';
    assert(pa.length === 3);
    assert(pb.length === 3);
    assert(pc.length === 3);
    assert(pe.length === 3);

    // screen-space over, up, and normal
    const vr = normalize(sub(pb, pa));
    const vu = normalize(sub(pc, pa));
    const vn = normalize(cross(vr, vu));

    // vectors from the screen-space corners
    // to the eye
    const va = sub(pa, pe);
    const vb = sub(pb, pe);
    const vc = sub(pc, pe);

    // distance from the eye to the screen plane
    const d = -dot(va, vn);
    const s = n / d;

    // left, right, bottom, and top parameters that
    // you would pass to glFrustum
    const l = s * dot(vr, va);
    const r = s * dot(vr, vb);
    const b = s * dot(vu, va);
    const t = s * dot(vu, vc);

    // P is the perspective matrix produced by calling glFrustum
    // https://www.opengl.org/sdk/docs/man2/xhtml/glFrustum.xml
    let P = [];
    P.length = 16;
    const x = 2 * n / (r - l);
    const y = 2 * n / (t - b);
    const A = (r + l) / (r - l);
    const B = (t + b) / (t - b);
    const C = -(f + n) / (f - n);
    const D = -2 * f * n / (f - n);
    P[0] = x; P[4] = 0; P[8] = A; P[12] = 0;
    P[1] = 0; P[5] = y; P[9] = B; P[13] = 0;
    P[2] = 0; P[6] = 0; P[10] = C; P[14] = D;
    P[3] = 0; P[7] = 0; P[11] = -1; P[15] = 0;

    // Take into account the coordinate system of the screen
    let Mt = [];
    Mt.length = 16;
    Mt[0] = vr[0]; Mt[4] = vr[1]; Mt[8] = vr[2]; Mt[12] = 0;
    Mt[1] = vu[0]; Mt[5] = vu[1]; Mt[9] = vu[2]; Mt[13] = 0;
    Mt[2] = vn[0]; Mt[6] = vn[1]; Mt[10] = vn[2]; Mt[14] = 0;
    Mt[3] = 0; Mt[7] = 0; Mt[11] = 0; Mt[15] = 1;

    // Translate the eye position
    let T = [];
    T.length = 16;
    T[0] = 1; T[4] = 0; T[8] = 0; T[12] = -pe[0];
    T[1] = 0; T[5] = 1; T[9] = 0; T[13] = -pe[1];
    T[2] = 0; T[6] = 0; T[10] = 1; T[14] = -pe[2];
    T[3] = 0; T[7] = 0; T[11] = 0; T[15] = 1;

    // P' = P * Mt * T;
    return matmul(P, matmul(Mt, T));
};
