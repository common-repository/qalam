!function (r, n) {
    "object" == typeof exports && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ? define(["exports"], n) : n((r = r || self).uuid = {})
}(this, (function (r) {
    "use strict";
    var n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto),
        e = new Uint8Array(16);

    function t() {
        if (!n) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
        return n(e)
    }

    for (var o, a, u = [], f = 0; f < 256; ++f) u.push((f + 256).toString(16).substr(1));

    function c(r, n) {
        var e = n || 0, t = u;
        return (t[r[e + 0]] + t[r[e + 1]] + t[r[e + 2]] + t[r[e + 3]] + "-" + t[r[e + 4]] + t[r[e + 5]] + "-" + t[r[e + 6]] + t[r[e + 7]] + "-" + t[r[e + 8]] + t[r[e + 9]] + "-" + t[r[e + 10]] + t[r[e + 11]] + t[r[e + 12]] + t[r[e + 13]] + t[r[e + 14]] + t[r[e + 15]]).toLowerCase()
    }

    var i = 0, s = 0;

    function v(r, n, e) {
        function t(r, t, o, a) {
            var u = o && a || 0;
            if ("string" == typeof r && (r = function (r) {
                r = unescape(encodeURIComponent(r));
                for (var n = [], e = 0; e < r.length; ++e) n.push(r.charCodeAt(e));
                return n
            }(r)), "string" == typeof t && (t = function (r) {
                var n = [];
                return r.replace(/[a-fA-F0-9]{2}/g, (function (r) {
                    n.push(parseInt(r, 16))
                })), n
            }(t)), !Array.isArray(r)) throw TypeError("value must be an array of bytes");
            if (!Array.isArray(t) || 16 !== t.length) throw TypeError("namespace must be uuid string or an Array of 16 byte values");
            var f = e(t.concat(r));
            if (f[6] = 15 & f[6] | n, f[8] = 63 & f[8] | 128, o) for (var i = 0; i < 16; ++i) o[u + i] = f[i];
            return o || c(f)
        }

        try {
            t.name = r
        } catch (r) {
        }
        return t.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", t.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8", t
    }

    function d(r) {
        return 14 + (r + 64 >>> 9 << 4) + 1
    }

    function p(r, n) {
        var e = (65535 & r) + (65535 & n);
        return (r >> 16) + (n >> 16) + (e >> 16) << 16 | 65535 & e
    }

    function l(r, n, e, t, o, a) {
        return p((u = p(p(n, r), p(t, a))) << (f = o) | u >>> 32 - f, e);
        var u, f
    }

    function y(r, n, e, t, o, a, u) {
        return l(n & e | ~n & t, r, n, o, a, u)
    }

    function h(r, n, e, t, o, a, u) {
        return l(n & t | e & ~t, r, n, o, a, u)
    }

    function g(r, n, e, t, o, a, u) {
        return l(n ^ e ^ t, r, n, o, a, u)
    }

    function m(r, n, e, t, o, a, u) {
        return l(e ^ (n | ~t), r, n, o, a, u)
    }

    var b = v("v3", 48, (function (r) {
        if ("string" == typeof r) {
            var n = unescape(encodeURIComponent(r));
            r = new Uint8Array(n.length);
            for (var e = 0; e < n.length; ++e) r[e] = n.charCodeAt(e)
        }
        return function (r) {
            for (var n = [], e = 32 * r.length, t = 0; t < e; t += 8) {
                var o = r[t >> 5] >>> t % 32 & 255,
                    a = parseInt("0123456789abcdef".charAt(o >>> 4 & 15) + "0123456789abcdef".charAt(15 & o), 16);
                n.push(a)
            }
            return n
        }(function (r, n) {
            r[n >> 5] |= 128 << n % 32, r[d(n) - 1] = n;
            for (var e = 1732584193, t = -271733879, o = -1732584194, a = 271733878, u = 0; u < r.length; u += 16) {
                var f = e, c = t, i = o, s = a;
                e = y(e, t, o, a, r[u], 7, -680876936), a = y(a, e, t, o, r[u + 1], 12, -389564586), o = y(o, a, e, t, r[u + 2], 17, 606105819), t = y(t, o, a, e, r[u + 3], 22, -1044525330), e = y(e, t, o, a, r[u + 4], 7, -176418897), a = y(a, e, t, o, r[u + 5], 12, 1200080426), o = y(o, a, e, t, r[u + 6], 17, -1473231341), t = y(t, o, a, e, r[u + 7], 22, -45705983), e = y(e, t, o, a, r[u + 8], 7, 1770035416), a = y(a, e, t, o, r[u + 9], 12, -1958414417), o = y(o, a, e, t, r[u + 10], 17, -42063), t = y(t, o, a, e, r[u + 11], 22, -1990404162), e = y(e, t, o, a, r[u + 12], 7, 1804603682), a = y(a, e, t, o, r[u + 13], 12, -40341101), o = y(o, a, e, t, r[u + 14], 17, -1502002290), t = y(t, o, a, e, r[u + 15], 22, 1236535329), e = h(e, t, o, a, r[u + 1], 5, -165796510), a = h(a, e, t, o, r[u + 6], 9, -1069501632), o = h(o, a, e, t, r[u + 11], 14, 643717713), t = h(t, o, a, e, r[u], 20, -373897302), e = h(e, t, o, a, r[u + 5], 5, -701558691), a = h(a, e, t, o, r[u + 10], 9, 38016083), o = h(o, a, e, t, r[u + 15], 14, -660478335), t = h(t, o, a, e, r[u + 4], 20, -405537848), e = h(e, t, o, a, r[u + 9], 5, 568446438), a = h(a, e, t, o, r[u + 14], 9, -1019803690), o = h(o, a, e, t, r[u + 3], 14, -187363961), t = h(t, o, a, e, r[u + 8], 20, 1163531501), e = h(e, t, o, a, r[u + 13], 5, -1444681467), a = h(a, e, t, o, r[u + 2], 9, -51403784), o = h(o, a, e, t, r[u + 7], 14, 1735328473), t = h(t, o, a, e, r[u + 12], 20, -1926607734), e = g(e, t, o, a, r[u + 5], 4, -378558), a = g(a, e, t, o, r[u + 8], 11, -2022574463), o = g(o, a, e, t, r[u + 11], 16, 1839030562), t = g(t, o, a, e, r[u + 14], 23, -35309556), e = g(e, t, o, a, r[u + 1], 4, -1530992060), a = g(a, e, t, o, r[u + 4], 11, 1272893353), o = g(o, a, e, t, r[u + 7], 16, -155497632), t = g(t, o, a, e, r[u + 10], 23, -1094730640), e = g(e, t, o, a, r[u + 13], 4, 681279174), a = g(a, e, t, o, r[u], 11, -358537222), o = g(o, a, e, t, r[u + 3], 16, -722521979), t = g(t, o, a, e, r[u + 6], 23, 76029189), e = g(e, t, o, a, r[u + 9], 4, -640364487), a = g(a, e, t, o, r[u + 12], 11, -421815835), o = g(o, a, e, t, r[u + 15], 16, 530742520), t = g(t, o, a, e, r[u + 2], 23, -995338651), e = m(e, t, o, a, r[u], 6, -198630844), a = m(a, e, t, o, r[u + 7], 10, 1126891415), o = m(o, a, e, t, r[u + 14], 15, -1416354905), t = m(t, o, a, e, r[u + 5], 21, -57434055), e = m(e, t, o, a, r[u + 12], 6, 1700485571), a = m(a, e, t, o, r[u + 3], 10, -1894986606), o = m(o, a, e, t, r[u + 10], 15, -1051523), t = m(t, o, a, e, r[u + 1], 21, -2054922799), e = m(e, t, o, a, r[u + 8], 6, 1873313359), a = m(a, e, t, o, r[u + 15], 10, -30611744), o = m(o, a, e, t, r[u + 6], 15, -1560198380), t = m(t, o, a, e, r[u + 13], 21, 1309151649), e = m(e, t, o, a, r[u + 4], 6, -145523070), a = m(a, e, t, o, r[u + 11], 10, -1120210379), o = m(o, a, e, t, r[u + 2], 15, 718787259), t = m(t, o, a, e, r[u + 9], 21, -343485551), e = p(e, f), t = p(t, c), o = p(o, i), a = p(a, s)
            }
            return [e, t, o, a]
        }(function (r) {
            if (0 === r.length) return [];
            for (var n = 8 * r.length, e = new Uint32Array(d(n)), t = 0; t < n; t += 8) e[t >> 5] |= (255 & r[t / 8]) << t % 32;
            return e
        }(r), 8 * r.length))
    }));

    function A(r, n, e, t) {
        switch (r) {
            case 0:
                return n & e ^ ~n & t;
            case 1:
                return n ^ e ^ t;
            case 2:
                return n & e ^ n & t ^ e & t;
            case 3:
                return n ^ e ^ t
        }
    }

    function w(r, n) {
        return r << n | r >>> 32 - n
    }

    var C = v("v5", 80, (function (r) {
        var n = [1518500249, 1859775393, 2400959708, 3395469782],
            e = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
        if ("string" == typeof r) {
            var t = unescape(encodeURIComponent(r));
            r = [];
            for (var o = 0; o < t.length; ++o) r.push(t.charCodeAt(o))
        }
        r.push(128);
        for (var a = r.length / 4 + 2, u = Math.ceil(a / 16), f = new Array(u), c = 0; c < u; ++c) {
            for (var i = new Uint32Array(16), s = 0; s < 16; ++s) i[s] = r[64 * c + 4 * s] << 24 | r[64 * c + 4 * s + 1] << 16 | r[64 * c + 4 * s + 2] << 8 | r[64 * c + 4 * s + 3];
            f[c] = i
        }
        f[u - 1][14] = 8 * (r.length - 1) / Math.pow(2, 32), f[u - 1][14] = Math.floor(f[u - 1][14]), f[u - 1][15] = 8 * (r.length - 1) & 4294967295;
        for (var v = 0; v < u; ++v) {
            for (var d = new Uint32Array(80), p = 0; p < 16; ++p) d[p] = f[v][p];
            for (var l = 16; l < 80; ++l) d[l] = w(d[l - 3] ^ d[l - 8] ^ d[l - 14] ^ d[l - 16], 1);
            for (var y = e[0], h = e[1], g = e[2], m = e[3], b = e[4], C = 0; C < 80; ++C) {
                var U = Math.floor(C / 20), R = w(y, 5) + A(U, h, g, m) + b + n[U] + d[C] >>> 0;
                b = m, m = g, g = w(h, 30) >>> 0, h = y, y = R
            }
            e[0] = e[0] + y >>> 0, e[1] = e[1] + h >>> 0, e[2] = e[2] + g >>> 0, e[3] = e[3] + m >>> 0, e[4] = e[4] + b >>> 0
        }
        return [e[0] >> 24 & 255, e[0] >> 16 & 255, e[0] >> 8 & 255, 255 & e[0], e[1] >> 24 & 255, e[1] >> 16 & 255, e[1] >> 8 & 255, 255 & e[1], e[2] >> 24 & 255, e[2] >> 16 & 255, e[2] >> 8 & 255, 255 & e[2], e[3] >> 24 & 255, e[3] >> 16 & 255, e[3] >> 8 & 255, 255 & e[3], e[4] >> 24 & 255, e[4] >> 16 & 255, e[4] >> 8 & 255, 255 & e[4]]
    }));
    r.v1 = function (r, n, e) {
        var u = n && e || 0, f = n || [], v = (r = r || {}).node || o, d = void 0 !== r.clockseq ? r.clockseq : a;
        if (null == v || null == d) {
            var p = r.random || (r.rng || t)();
            null == v && (v = o = [1 | p[0], p[1], p[2], p[3], p[4], p[5]]), null == d && (d = a = 16383 & (p[6] << 8 | p[7]))
        }
        var l = void 0 !== r.msecs ? r.msecs : Date.now(), y = void 0 !== r.nsecs ? r.nsecs : s + 1,
            h = l - i + (y - s) / 1e4;
        if (h < 0 && void 0 === r.clockseq && (d = d + 1 & 16383), (h < 0 || l > i) && void 0 === r.nsecs && (y = 0), y >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
        i = l, s = y, a = d;
        var g = (1e4 * (268435455 & (l += 122192928e5)) + y) % 4294967296;
        f[u++] = g >>> 24 & 255, f[u++] = g >>> 16 & 255, f[u++] = g >>> 8 & 255, f[u++] = 255 & g;
        var m = l / 4294967296 * 1e4 & 268435455;
        f[u++] = m >>> 8 & 255, f[u++] = 255 & m, f[u++] = m >>> 24 & 15 | 16, f[u++] = m >>> 16 & 255, f[u++] = d >>> 8 | 128, f[u++] = 255 & d;
        for (var b = 0; b < 6; ++b) f[u + b] = v[b];
        return n || c(f)
    }, r.v3 = b, r.v4 = function (r, n, e) {
        "string" == typeof r && (n = "binary" === r ? new Uint8Array(16) : null, r = null);
        var o = (r = r || {}).random || (r.rng || t)();
        if (o[6] = 15 & o[6] | 64, o[8] = 63 & o[8] | 128, n) {
            for (var a = e || 0, u = 0; u < 16; ++u) n[a + u] = o[u];
            return n
        }
        return c(o)
    }, r.v5 = C, Object.defineProperty(r, "__esModule", {value: !0})
}));