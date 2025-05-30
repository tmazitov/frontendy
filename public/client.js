var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// (disabled):node_modules/buffer/index.js
var require_buffer = __commonJS({
  "(disabled):node_modules/buffer/index.js"() {
  }
});

// node_modules/js-sha256/src/sha256.js
var require_sha256 = __commonJS({
  "node_modules/js-sha256/src/sha256.js"(exports, module) {
    (function() {
      "use strict";
      var ERROR = "input is invalid type";
      var WINDOW = typeof window === "object";
      var root = WINDOW ? window : {};
      if (root.JS_SHA256_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
      if (NODE_JS) {
        root = global;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === "object" && module.exports;
      var AMD = typeof define === "function" && define.amd;
      var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [-2147483648, 8388608, 32768, 128];
      var SHIFT = [24, 16, 8, 0];
      var K = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ];
      var OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"];
      var blocks = [];
      if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var createOutputMethod = function(outputType, is224) {
        return function(message) {
          return new Sha256(is224, true).update(message)[outputType]();
        };
      };
      var createMethod = function(is224) {
        var method = createOutputMethod("hex", is224);
        if (NODE_JS) {
          method = nodeWrap(method, is224);
        }
        method.create = function() {
          return new Sha256(is224);
        };
        method.update = function(message) {
          return method.create().update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type, is224);
        }
        return method;
      };
      var nodeWrap = function(method, is224) {
        var crypto = require_crypto();
        var Buffer2 = require_buffer().Buffer;
        var algorithm = is224 ? "sha224" : "sha256";
        var bufferFrom;
        if (Buffer2.from && !root.JS_SHA256_NO_BUFFER_FROM) {
          bufferFrom = Buffer2.from;
        } else {
          bufferFrom = function(message) {
            return new Buffer2(message);
          };
        }
        var nodeMethod = function(message) {
          if (typeof message === "string") {
            return crypto.createHash(algorithm).update(message, "utf8").digest("hex");
          } else {
            if (message === null || message === void 0) {
              throw new Error(ERROR);
            } else if (message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            }
          }
          if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer2) {
            return crypto.createHash(algorithm).update(bufferFrom(message)).digest("hex");
          } else {
            return method(message);
          }
        };
        return nodeMethod;
      };
      var createHmacOutputMethod = function(outputType, is224) {
        return function(key, message) {
          return new HmacSha256(key, is224, true).update(message)[outputType]();
        };
      };
      var createHmacMethod = function(is224) {
        var method = createHmacOutputMethod("hex", is224);
        method.create = function(key) {
          return new HmacSha256(key, is224);
        };
        method.update = function(key, message) {
          return method.create(key).update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type, is224);
        }
        return method;
      };
      function Sha256(is224, sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        if (is224) {
          this.h0 = 3238371032;
          this.h1 = 914150663;
          this.h2 = 812702999;
          this.h3 = 4144912697;
          this.h4 = 4290775857;
          this.h5 = 1750603025;
          this.h6 = 1694076839;
          this.h7 = 3204075428;
        } else {
          this.h0 = 1779033703;
          this.h1 = 3144134277;
          this.h2 = 1013904242;
          this.h3 = 2773480762;
          this.h4 = 1359893119;
          this.h5 = 2600822924;
          this.h6 = 528734635;
          this.h7 = 1541459225;
        }
        this.block = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
        this.is224 = is224;
      }
      Sha256.prototype.update = function(message) {
        if (this.finalized) {
          return;
        }
        var notString, type = typeof message;
        if (type !== "string") {
          if (type === "object") {
            if (message === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            } else if (!Array.isArray(message)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
          notString = true;
        }
        var code, index = 0, i, length = message.length, blocks2 = this.blocks;
        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = this.block;
            this.block = blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (notString) {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 128) {
                blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 2048) {
                blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else if (code < 55296 || code >= 57344) {
                blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else {
                code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.block = blocks2[16];
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Sha256.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i = this.lastByteIndex;
        blocks2[16] = this.block;
        blocks2[i >>> 2] |= EXTRA[i & 3];
        this.block = blocks2[16];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = this.block;
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks2[15] = this.bytes << 3;
        this.hash();
      };
      Sha256.prototype.hash = function() {
        var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks2 = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
        for (j = 16; j < 64; ++j) {
          t1 = blocks2[j - 15];
          s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
          t1 = blocks2[j - 2];
          s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
          blocks2[j] = blocks2[j - 16] + s0 + blocks2[j - 7] + s1 << 0;
        }
        bc = b & c;
        for (j = 0; j < 64; j += 4) {
          if (this.first) {
            if (this.is224) {
              ab = 300032;
              t1 = blocks2[0] - 1413257819;
              h = t1 - 150054599 << 0;
              d = t1 + 24177077 << 0;
            } else {
              ab = 704751109;
              t1 = blocks2[0] - 210244248;
              h = t1 - 1521486534 << 0;
              d = t1 + 143694565 << 0;
            }
            this.first = false;
          } else {
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ab = a & b;
            maj = ab ^ a & c ^ bc;
            ch = e & f ^ ~e & g;
            t1 = h + s1 + ch + K[j] + blocks2[j];
            t2 = s0 + maj;
            h = d + t1 << 0;
            d = t1 + t2 << 0;
          }
          s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
          s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
          da = d & a;
          maj = da ^ d & b ^ ab;
          ch = h & e ^ ~h & f;
          t1 = g + s1 + ch + K[j + 1] + blocks2[j + 1];
          t2 = s0 + maj;
          g = c + t1 << 0;
          c = t1 + t2 << 0;
          s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
          s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
          cd = c & d;
          maj = cd ^ c & a ^ da;
          ch = g & h ^ ~g & e;
          t1 = f + s1 + ch + K[j + 2] + blocks2[j + 2];
          t2 = s0 + maj;
          f = b + t1 << 0;
          b = t1 + t2 << 0;
          s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
          s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
          bc = b & c;
          maj = bc ^ b & d ^ cd;
          ch = f & g ^ ~f & h;
          t1 = e + s1 + ch + K[j + 3] + blocks2[j + 3];
          t2 = s0 + maj;
          e = a + t1 << 0;
          a = t1 + t2 << 0;
          this.chromeBugWorkAround = true;
        }
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
        this.h4 = this.h4 + e << 0;
        this.h5 = this.h5 + f << 0;
        this.h6 = this.h6 + g << 0;
        this.h7 = this.h7 + h << 0;
      };
      Sha256.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var hex = HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >>> 28 & 15] + HEX_CHARS[h5 >>> 24 & 15] + HEX_CHARS[h5 >>> 20 & 15] + HEX_CHARS[h5 >>> 16 & 15] + HEX_CHARS[h5 >>> 12 & 15] + HEX_CHARS[h5 >>> 8 & 15] + HEX_CHARS[h5 >>> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >>> 28 & 15] + HEX_CHARS[h6 >>> 24 & 15] + HEX_CHARS[h6 >>> 20 & 15] + HEX_CHARS[h6 >>> 16 & 15] + HEX_CHARS[h6 >>> 12 & 15] + HEX_CHARS[h6 >>> 8 & 15] + HEX_CHARS[h6 >>> 4 & 15] + HEX_CHARS[h6 & 15];
        if (!this.is224) {
          hex += HEX_CHARS[h7 >>> 28 & 15] + HEX_CHARS[h7 >>> 24 & 15] + HEX_CHARS[h7 >>> 20 & 15] + HEX_CHARS[h7 >>> 16 & 15] + HEX_CHARS[h7 >>> 12 & 15] + HEX_CHARS[h7 >>> 8 & 15] + HEX_CHARS[h7 >>> 4 & 15] + HEX_CHARS[h7 & 15];
        }
        return hex;
      };
      Sha256.prototype.toString = Sha256.prototype.hex;
      Sha256.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var arr = [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 & 255
        ];
        if (!this.is224) {
          arr.push(h7 >>> 24 & 255, h7 >>> 16 & 255, h7 >>> 8 & 255, h7 & 255);
        }
        return arr;
      };
      Sha256.prototype.array = Sha256.prototype.digest;
      Sha256.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
        var dataView = new DataView(buffer);
        dataView.setUint32(0, this.h0);
        dataView.setUint32(4, this.h1);
        dataView.setUint32(8, this.h2);
        dataView.setUint32(12, this.h3);
        dataView.setUint32(16, this.h4);
        dataView.setUint32(20, this.h5);
        dataView.setUint32(24, this.h6);
        if (!this.is224) {
          dataView.setUint32(28, this.h7);
        }
        return buffer;
      };
      function HmacSha256(key, is224, sharedMemory) {
        var i, type = typeof key;
        if (type === "string") {
          var bytes = [], length = key.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key.charCodeAt(i);
            if (code < 128) {
              bytes[index++] = code;
            } else if (code < 2048) {
              bytes[index++] = 192 | code >>> 6;
              bytes[index++] = 128 | code & 63;
            } else if (code < 55296 || code >= 57344) {
              bytes[index++] = 224 | code >>> 12;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            } else {
              code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
              bytes[index++] = 240 | code >>> 18;
              bytes[index++] = 128 | code >>> 12 & 63;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            }
          }
          key = bytes;
        } else {
          if (type === "object") {
            if (key === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
              key = new Uint8Array(key);
            } else if (!Array.isArray(key)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
        }
        if (key.length > 64) {
          key = new Sha256(is224, true).update(key).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key[i] || 0;
          oKeyPad[i] = 92 ^ b;
          iKeyPad[i] = 54 ^ b;
        }
        Sha256.call(this, is224, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacSha256.prototype = new Sha256();
      HmacSha256.prototype.finalize = function() {
        Sha256.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Sha256.call(this, this.is224, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Sha256.prototype.finalize.call(this);
        }
      };
      var exports2 = createMethod();
      exports2.sha256 = exports2;
      exports2.sha224 = createMethod(true);
      exports2.sha256.hmac = createHmacMethod();
      exports2.sha224.hmac = createHmacMethod(true);
      if (COMMON_JS) {
        module.exports = exports2;
      } else {
        root.sha256 = exports2.sha256;
        root.sha224 = exports2.sha224;
        if (AMD) {
          define(function() {
            return exports2;
          });
        }
      }
    })();
  }
});

// src/pkg/frontendy/app/app.ts
var FrontendyAppInstance = class {
  constructor(component) {
    this.rootComponent = component;
  }
  mount(rootNode) {
    const instance = new this.rootComponent();
    instance.mount(rootNode);
  }
};

// node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var { iterator, toStringTag } = Symbol;
var kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(toStringTag in val) && !(iterator in val);
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction(val.pipe);
var isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define2 = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define2(arrayOrString) : define2(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {
};
var toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
var toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({ source, data }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === "function",
  isFunction(_global.postMessage)
);
var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
var isIterable = (thing) => thing != null && isFunction(thing[iterator]);
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};

// node_modules/axios/lib/core/AxiosError.js
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
var prototype = AxiosError.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;

// node_modules/axios/lib/helpers/null.js
var null_default = null;

// node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (null_default || FormData)();
  options = utils_default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils_default.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils_default.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;

// node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;

// node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode2;
  if (utils_default.isFunction(options)) {
    options = {
      serialize: options
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}

// node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;

// node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

// node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

// node_modules/axios/lib/platform/browser/classes/FormData.js
var FormData_default = typeof FormData !== "undefined" ? FormData : null;

// node_modules/axios/lib/platform/browser/classes/Blob.js
var Blob_default = typeof Blob !== "undefined" ? Blob : null;

// node_modules/axios/lib/platform/browser/index.js
var browser_default = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: Blob_default
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
};

// node_modules/axios/lib/platform/common/utils.js
var utils_exports = {};
__export(utils_exports, {
  hasBrowserEnv: () => hasBrowserEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  navigator: () => _navigator,
  origin: () => origin
});
var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
var _navigator = typeof navigator === "object" && navigator || void 0;
var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
var hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
var origin = hasBrowserEnv && window.location.href || "http://localhost";

// node_modules/axios/lib/platform/index.js
var platform_default = {
  ...utils_exports,
  ...browser_default
};

// node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new platform_default.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

// node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;

// node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils_default.isObject(data);
    if (isObjectPayload && utils_default.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils_default.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
    }
    if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
      return data;
    }
    if (utils_default.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils_default.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData_default(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
      return data;
    }
    if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform_default.classes.FormData,
    Blob: platform_default.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
var defaults_default = defaults;

// node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};

// node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value)) return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var AxiosHeaders = class {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils_default.isArray(entry)) {
          throw TypeError("Object iterator must return a key-value pair");
        }
        obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils_default.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;

// node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}

// node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// node_modules/axios/lib/cancel/CanceledError.js
function CanceledError(message, config, request) {
  AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true
});
var CanceledError_default = CanceledError;

// node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default(
      "Request failed with status code " + response.status,
      [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

// node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}

// node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
var speedometer_default = speedometer;

// node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
var throttle_default = throttle;

// node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return throttle_default((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
var progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
var asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
  url = new URL(url, platform_default.origin);
  return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
})(
  new URL(platform_default.origin),
  platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
) : () => true;

// node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + "=" + encodeURIComponent(value)];
      utils_default.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
      utils_default.isString(path) && cookie.push("path=" + path);
      utils_default.isString(domain) && cookie.push("domain=" + domain);
      secure === true && cookie.push("secure");
      document.cookie = cookie.join("; ");
    },
    read(name) {
      const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);

// node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

// node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}

// node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils_default.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}

// node_modules/axios/lib/helpers/resolveConfig.js
var resolveConfig_default = (config) => {
  const newConfig = mergeConfig({}, config);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders_default.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  let contentType;
  if (utils_default.isFormData(data)) {
    if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if ((contentType = headers.getContentType()) !== false) {
      const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
    }
  }
  if (platform_default.hasStandardBrowserEnv) {
    withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};

// node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig_default(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders_default.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitional_default;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError_default(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils_default.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};

// node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError_default(`timeout ${timeout} of ms exceeded`, AxiosError_default.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils_default.asap(unsubscribe);
    return signal;
  }
};
var composeSignals_default = composeSignals;

// node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
var readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
var readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
var trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator2.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator2.return();
    }
  }, {
    highWaterMark: 2
  });
};

// node_modules/axios/lib/adapters/fetch.js
var isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
var isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
var encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
var test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};
var supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;
  const hasContentType = new Request(platform_default.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      duplexAccessed = true;
      return "half";
    }
  }).headers.has("Content-Type");
  return duplexAccessed && !hasContentType;
});
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var supportsResponseStream = isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
var resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};
isFetchSupported && ((res) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
    !resolvers[type] && (resolvers[type] = utils_default.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
      throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
    });
  });
})(new Response());
var getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }
  if (utils_default.isBlob(body)) {
    return body.size;
  }
  if (utils_default.isSpecCompliantForm(body)) {
    const _request = new Request(platform_default.origin, {
      method: "POST",
      body
    });
    return (await _request.arrayBuffer()).byteLength;
  }
  if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
    return body.byteLength;
  }
  if (utils_default.isURLSearchParams(body)) {
    body = body + "";
  }
  if (utils_default.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};
var resolveBodyLength = async (headers, body) => {
  const length = utils_default.toFiniteNumber(headers.getContentLength());
  return length == null ? getBodyLength(body) : length;
};
var fetch_default = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = "same-origin",
    fetchOptions
  } = resolveConfig_default(config);
  responseType = responseType ? (responseType + "").toLowerCase() : "text";
  let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
  let request;
  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
    composedSignal.unsubscribe();
  });
  let requestContentLength;
  try {
    if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
      let _request = new Request(url, {
        method: "POST",
        body: data,
        duplex: "half"
      });
      let contentTypeHeader;
      if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
        headers.setContentType(contentTypeHeader);
      }
      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );
        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }
    if (!utils_default.isString(withCredentials)) {
      withCredentials = withCredentials ? "include" : "omit";
    }
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : void 0
    });
    let response = await fetch(request);
    const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
    if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
      const options = {};
      ["status", "statusText", "headers"].forEach((prop) => {
        options[prop] = response[prop];
      });
      const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];
      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }
    responseType = responseType || "text";
    let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
    !isStreamResponse && unsubscribe && unsubscribe();
    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders_default.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    });
  } catch (err) {
    unsubscribe && unsubscribe();
    if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      );
    }
    throw AxiosError_default.from(err, err && err.code, config, request);
  }
});

// node_modules/axios/lib/adapters/adapters.js
var knownAdapters = {
  http: null_default,
  xhr: xhr_default,
  fetch: fetch_default
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
var adapters_default = {
  getAdapter: (adapters) => {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};

// node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters_default.getAdapter(config.adapter || defaults_default.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders_default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}

// node_modules/axios/lib/env/data.js
var VERSION = "1.9.0";

// node_modules/axios/lib/helpers/validator.js
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
        AxiosError_default.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version + " and will be removed in the near future"
        )
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validator_default = {
  assertOptions,
  validators
};

// node_modules/axios/lib/core/Axios.js
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, true);
      }
    }
    if (config.allowAbsoluteUrls !== void 0) {
    } else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator_default.assertOptions(config, {
      baseUrl: validators2.spelling("baseURL"),
      withXsrfToken: validators2.spelling("withXSRFToken")
    }, true);
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils_default.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils_default.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_default = Axios;

// node_modules/axios/lib/cancel/CancelToken.js
var CancelToken = class _CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new _CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
var CancelToken_default = CancelToken;

// node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

// node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}

// node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;

// node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;

// node_modules/axios/index.js
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  getAdapter,
  mergeConfig: mergeConfig2
} = axios_default;

// src/pkg/event-broker/eventBroker.ts
var EventBroker = class _EventBroker {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!_EventBroker.instance) {
      _EventBroker.instance = new _EventBroker();
    }
    return _EventBroker.instance;
  }
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, callback);
    }
  }
  off(event) {
    if (this.listeners.has(event)) {
      this.listeners.delete(event);
    }
  }
  emit(event, ...args) {
    if (this.listeners.has(event)) {
      const callback = this.listeners.get(event);
      if (callback) {
        callback(...args);
      }
    } else {
      console.warn(`EventBroker warn : no listener for event: ${event}`);
    }
  }
};

// src/api/client.ts
function cacheTokens(tokenPair) {
  localStorage.setItem("access-token", tokenPair.accessToken);
  localStorage.setItem("refresh-token", tokenPair.refreshToken);
}
function removeTokens() {
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
}
function getTokens() {
  return {
    accessToken: localStorage.getItem("access-token") || "",
    refreshToken: localStorage.getItem("refresh-token") || ""
  };
}
function isAuthorized() {
  const tokens = getTokens();
  return !!tokens.accessToken && !!tokens.refreshToken;
}
var IS_REFRESHING = false;
var AxiosClient = class _AxiosClient {
  static {
    this.requestQueue = [];
  }
  constructor(baseUrl) {
    this.axiosInstance = axios_default.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const controller = new AbortController();
        const tokens = getTokens();
        if (!tokens.accessToken) {
          controller.abort();
          router_default.push("home");
        }
        if (tokens.accessToken && config.headers) {
          config.headers["Authorization"] = tokens.accessToken;
        }
        return {
          ...config,
          signal: controller.signal
        };
      },
      (error) => Promise.reject(error)
    );
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const tokens = getTokens();
        if (error.response && error.response.status === 401 && tokens.accessToken && !originalRequest._retry) {
          originalRequest._retry = true;
          if (IS_REFRESHING) {
            return new Promise((resolve, reject) => {
              _AxiosClient.requestQueue.push((token) => {
                originalRequest.headers["Authorization"] = `${token}`;
                this.axiosInstance(originalRequest).then(resolve).catch(reject);
              });
            });
          }
          IS_REFRESHING = true;
          try {
            const newTokens = await this.refreshTokens();
            _AxiosClient.requestQueue.forEach((callback) => callback(newTokens.accessToken));
            _AxiosClient.requestQueue = [];
            originalRequest.headers["Authorization"] = newTokens.accessToken;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          } finally {
            IS_REFRESHING = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }
  // Функция для обновления токенов
  async refreshTokens() {
    const response = await this.refresh();
    return response.data;
  }
  // Функция для выполнения запросов через клиент
  async request(config) {
    try {
      return await this.axiosInstance(config);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async refresh() {
    const tokens = getTokens();
    console.log("old tokens :>> ", tokens);
    try {
      const response = await axios_default.request({
        method: "POST",
        url: "http://localhost:5000/auth/api/rest/refresh",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
          // 'Authorization': `${tokens.accessToken}`
        },
        data: {
          "refreshToken": tokens.refreshToken
        }
      });
      if (response && response.data) {
        cacheTokens(response.data);
      }
      console.log("new tokens :>> ", response.data);
      return response;
    } catch (error) {
      console.log("refresh error :>> ", error);
      if (error.response && error.response.status == 401) {
        setTimeout(async () => {
          removeTokens();
          router_default.push("home");
          EventBroker.getInstance().emit("update-auth");
        });
      }
      return error.response;
    }
  }
};
var client_default = AxiosClient;

// src/pkg/frontendy/router/router.ts
var FrontendyRouter = class {
  constructor(routes2, config = void 0) {
    this.routes = [];
    this.config = config ?? { notFoundPage: void 0, routeIsAvailable: void 0 };
    this.routes = routes2;
    this.currentRoute = this.findRoute(window.location.pathname);
    document.addEventListener("click", this.handleLinkClick.bind(this));
    window.addEventListener("popstate", () => this.setCurrentRoute());
  }
  setRouterView(routerView) {
    this.routerView = routerView;
  }
  findRoute(path) {
    const route = this.routes.find((route2) => route2.path === path);
    if (!route) {
      return void 0;
    }
    if (!this.config.routeIsAvailable) {
      return route;
    }
    const reason = this.config.routeIsAvailable(route);
    if (reason) {
      console.error(`Router error : route ${route.name} is not available for reason : ${reason}`);
      return void 0;
    }
    return route;
  }
  getUndefinedMessageComponent() {
    return this.config?.notFoundPage;
  }
  handleLinkClick(event) {
    const target = event.target;
    if (target.tagName === "A") {
      const anchor = target;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("/")) {
        event.preventDefault();
        window.history.pushState({}, "", href);
        this.setCurrentRoute();
      }
    }
  }
  setCurrentRoute() {
    if (!this.routerView) {
      throw new Error("Router error : routerView instance is not set");
    }
    this.currentRoute = this.findRoute(window.location.pathname);
    this.routerView.updateCurrentRoute();
  }
  push(name) {
    const route = this.routes.find((route2) => route2.name === name);
    if (!route) {
      throw new Error(`Router error: route ${name} not found`);
    }
    if (route.path === this.currentRoute?.path) {
      throw new Error(`Router error: route ${name} already active`);
    }
    window.history.pushState({}, "", route.path);
    this.setCurrentRoute();
  }
  getCurrentRoute() {
    return this.currentRoute;
  }
};

// src/pkg/frontendy/vdom/VText.ts
var VText = class {
  constructor(value) {
    this.value = "";
    this.value = `${value}`;
  }
  print(level = 0) {
    console.log(`${"-".repeat(level)}> ${this.value}`);
  }
};
var VText_default = VText;

// src/pkg/frontendy/vdom/createElement.ts
function createElement(node) {
  if (!node) {
    return document.createElement("noscript");
  }
  if (node instanceof VText_default) {
    return document.createTextNode(node.value);
  }
  const el = document.createElement(node.tag);
  if (node.props) {
    for (const key in node.props) {
      el.setAttribute(key, node.props[key]);
    }
  }
  if (node.styles) {
    const styles = el.style;
    for (const key in node.styles) {
      if (key in styles && node.styles[key]) {
        styles[key] = node.styles[key];
      }
    }
  }
  if (node.events) {
    for (const eventName in node.events) {
      el.addEventListener(eventName, node.events[eventName]);
    }
  }
  node.children?.forEach((child) => {
    const childElem = child instanceof component_default ? child.mount(el) : createElement(child);
    if (!childElem) {
      return;
    }
    el.appendChild(childElem);
  });
  return el;
}
var createElement_default = createElement;

// src/pkg/frontendy/vdom/VElem.ts
var VElem = class _VElem {
  constructor(tag) {
    this.props = {};
    this.children = [];
    this.show = true;
    this.styles = {};
    this.events = {};
    this.tag = tag;
  }
  setProps(props) {
    if (!this.props) {
      this.props = props;
      return this;
    }
    Object.keys(props).forEach((key) => {
      this.props[key] = props[key];
    });
    return this;
  }
  getProps() {
    return this.props;
  }
  setChild(child) {
    const filtered = child.filter((c) => c != null).map((c) => {
      if (!(c instanceof _VElem) && !(c instanceof VText_default) && !(c instanceof component_default)) {
        c = new VText_default(c.toString());
      }
      return c;
    });
    this.children.push(...filtered);
    return this;
  }
  addChild(child) {
    if (!child) {
      return this;
    }
    if (!(child instanceof _VElem) && !(child instanceof VText_default) && !(child instanceof component_default)) {
      child = new VText_default(child.toString());
    }
    this.children.push(child);
    return this;
  }
  addEventListener(event, callback) {
    if (!event || !callback) {
      throw new Error("event and callback are required");
    }
    this.events[event] = callback;
    return this;
  }
  createHTMLElement() {
    return createElement_default(this);
  }
  print(level = 0) {
    const props = Object.keys(this.props).map((key) => `${key}="${this.props[key]}"`);
    console.log(`${"-".repeat(level)}> ${this.tag} with ${props}`);
    this.children.forEach((child) => {
      child.print(level + 2);
    });
  }
  $vif(conditionResult) {
    if (!conditionResult) {
      this.styles.display = "none";
    } else {
      this.styles.display = null;
    }
    return this;
  }
  $vfor(array, callback) {
    if (!Array.isArray(array)) {
      throw new Error("v-for expects an array");
    }
    return array.map((item) => {
      const newElem = new _VElem(this.tag);
      newElem.setProps(this.props);
      callback(newElem, item);
      return newElem;
    });
  }
};
var VElem_default = VElem;

// src/pkg/frontendy/vdom/updateElement.ts
function addNewElement(parent, newVNode) {
  if (newVNode instanceof component_default) {
    newVNode.mount(parent);
  } else {
    const childElem = createElement_default(newVNode);
    if (!childElem) {
      return;
    }
    parent.appendChild(childElem);
  }
}
function removeNewElement(parent, index) {
  const child = parent.childNodes[index];
  if (!child) {
    return;
  }
  parent.removeChild(child);
}
function replaceElement(parent, newVNode, index) {
  const child = parent.childNodes[index];
  if (!child) {
    return;
  }
  if (newVNode instanceof component_default) {
    const element = newVNode.mount(parent);
    if (!element) {
      return;
    }
    parent.replaceChild(element, child);
    return;
  }
  parent.replaceChild(createElement_default(newVNode), child);
}
function updateElement(parent, oldVNode, newVNode, index = 0) {
  if (parent instanceof Text) {
    if (newVNode instanceof VText_default) {
      if (newVNode.value !== parent.nodeValue) {
        parent.nodeValue = newVNode.value;
      }
    } else if (newVNode instanceof VElem_default) {
      parent.replaceWith(createElement_default(newVNode));
    }
    return;
  }
  if (!oldVNode && !newVNode) {
    return;
  }
  if (!oldVNode && newVNode) {
    addNewElement(parent, newVNode);
    return;
  }
  if (!newVNode && oldVNode) {
    removeNewElement(parent, index);
    return;
  }
  const newIsText = newVNode instanceof VText_default;
  const oldIsText = oldVNode instanceof VText_default;
  if (newIsText || oldIsText) {
    if (newIsText && oldIsText && newVNode.value !== oldVNode.value) {
      parent.innerText = newVNode.value;
    } else if (newVNode !== oldVNode && newVNode instanceof VElem_default) {
      parent.replaceWith(createElement_default(newVNode));
    } else if (newVNode !== oldVNode && newVNode instanceof component_default) {
      const elem2 = newVNode.mount(parent);
      if (elem2) {
        parent.replaceWith(elem2);
      } else {
        removeNewElement(parent, index);
        console.log("after render component no element...");
      }
    }
    return;
  }
  const newIsComponent = newVNode instanceof component_default;
  const oldIsComponent = oldVNode instanceof component_default;
  if (newIsComponent || oldIsComponent) {
    if (newIsComponent && oldIsComponent) {
      const parentParent = parent.parentElement;
      if (!parentParent) {
        return;
      }
      newVNode.mount(parentParent);
      oldVNode.unmount();
    } else {
      addNewElement(parent, newVNode);
    }
    return;
  }
  if (newVNode && oldVNode && newVNode.tag !== oldVNode.tag) {
    replaceElement(parent, newVNode, index);
    return;
  }
  if (!(parent.childNodes && parent.childNodes.length && oldVNode && newVNode)) {
    return;
  }
  for (const key in oldVNode.props) {
    if (!(key in newVNode.props)) {
      parent.removeAttribute(key);
    }
  }
  for (const key in newVNode.props) {
    if (oldVNode.props?.[key] !== newVNode.props[key]) {
      parent.setAttribute(key, newVNode.props[key]);
    }
  }
  for (let i = 0; i < newVNode.children.length || i < oldVNode.children.length; i++) {
    const newParent = parent.childNodes[i];
    const oldChild = oldVNode.children?.[i];
    const newChild = newVNode.children?.[i];
    updateElement(newParent, oldChild, newChild, i);
  }
}
var updateElement_default = updateElement;

// src/pkg/frontendy/component/lifecicle.ts
var FrontendyLifecicle = class {
  onMounted() {
  }
  onUpdated() {
  }
  onUnmounted() {
  }
  onCreated() {
  }
};
var lifecicle_default = FrontendyLifecicle;

// src/pkg/frontendy/component/name.ts
function getCounter() {
  let count = 0;
  return {
    getValue: () => ++count
  };
}
var counter = getCounter();
function getComponentUniqueName() {
  const id = counter.getValue();
  return "component-" + id;
}

// src/pkg/frontendy/component/slot.ts
var FrontendySlot = class {
  constructor(name) {
    this.value = void 0;
    this.name = name;
  }
  set(value) {
    this.value = value;
  }
  render() {
    return this.value ?? null;
  }
};
var slot_default = FrontendySlot;

// src/pkg/frontendy/component/component.ts
var FrontendyComponent = class extends lifecicle_default {
  constructor(props = {}) {
    super();
    this.componentName = getComponentUniqueName();
    // State
    this.state = {};
    this._props = {};
    this._slots = {};
    // VDOM
    this.oldVNode = null;
    this.isMounted = false;
    this._el = null;
    this.initProps(props);
    this.initState();
    this.initSlots();
    this.onCreated();
  }
  initProps(props = {}) {
    this._props = props;
  }
  initState() {
    const initialState = this.data();
    this.state = new Proxy(initialState, {
      set: (target, prop, value) => {
        target[prop] = value;
        console.log(`\u{1F504} State \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D: ${String(prop)} \u2192 ${value}`);
        this.update();
        return true;
      }
    });
  }
  initSlots() {
    this.slots().forEach((slotName) => {
      this.registerSlot(slotName);
    });
  }
  get props() {
    return this._props;
  }
  get el() {
    return this._el;
  }
  data() {
    return {};
  }
  slots() {
    return [];
  }
  print() {
    console.log("Component : ", this.componentName);
  }
  template() {
    return void 0;
  }
  mount(target) {
    this.oldVNode = this.template() ?? null;
    if (!this.oldVNode) {
      this._el = null;
      return;
    }
    this._el = this.oldVNode.createHTMLElement();
    if (!this._el) {
      return;
    }
    target.appendChild(this._el);
    if (!this.isMounted) {
      this.onMounted();
    } else {
      this.onUpdated();
    }
    this.isMounted = true;
    return this.el;
  }
  unmount() {
    if (!this.el || !this.isMounted) {
      console.warn(`Component ${this.componentName} is not mounted or has no element to unmount.`);
      return;
    }
    const parent = this.el.parentElement;
    if (parent) {
      parent.removeChild(this.el);
    }
    this._el = null;
    this.oldVNode = null;
    this.isMounted = false;
    this.onUnmounted();
  }
  update() {
    if (!this.isMounted || !this.el) {
      return;
    }
    const newVNode = this.template();
    if (!newVNode) {
      return;
    }
    updateElement_default(this.el, this.oldVNode, newVNode);
    this.oldVNode = newVNode;
  }
  registerSlot(name) {
    if (this._slots[name]) {
      return this._slots[name];
    }
    const slot = new slot_default(name);
    this._slots[name] = slot;
    return slot;
  }
  useSlot(name) {
    if (!this._slots[name]) {
      throw new Error(`FrontendyComponent error : slot with name "${name}" does not exist`);
    }
    return this._slots[name].render();
  }
  setSlot(name, value) {
    if (!this._slots[name]) {
      throw new Error(`FrontendyComponent error : slot with name "${name}" does not exist`);
    }
    this._slots[name].set(value);
    return this;
  }
};
var component_default = FrontendyComponent;

// src/pkg/frontendy/vdom/constructor.ts
function elem(tag) {
  return new VElem_default(tag);
}
function text(value) {
  return new VText_default(value);
}

// src/components/content/about-page-content/AboutInfoComponent.ts
var AboutInfoComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "home-dashboard-component";
  }
  template() {
    return elem("div").setProps({
      id: "home-dashboard-component",
      class: "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6"
    }).setChild([
      elem("h1").setProps({ class: "text-2xl font-bold mb-4" }).addChild(text(`About us`)),
      elem("p").setProps({ class: "text-gray-700 text-base mb-4" }).addChild(text("ft_transcendence is a project that aims to provide a platform for developers to learn and practice their skills in a collaborative environment.")),
      elem("h2").setProps({ class: "text-xl font-bold mb-2" }).addChild(text("Our team:")),
      elem("ul").setProps({ class: "list-disc list-inside mb-4" }).setChild([
        elem("li").addChild("Timur Mazitov - Team Lead and Frontend developer"),
        elem("li").addChild("Valeria Lomakina - Backend Developer"),
        elem("li").addChild("Sofia Abdulkina - Backend Developer"),
        elem("li").addChild("Dastan Abdygali - Game Developer"),
        elem("li").addChild("Alban Medetbek - DevOps Engineer")
      ])
    ]);
  }
};

// src/pages/AboutPage.ts
var AboutPage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "about-page";
  }
  data() {
    return {
      title: "About Us",
      description: "Example text about us."
    };
  }
  template() {
    return elem("div").setProps({ id: "about-page" }).setChild([
      elem("div").setProps({ class: "flex flex-col items-center p-4 pt-8" }).addChild(new AboutInfoComponent())
    ]);
  }
};

// src/api/mmrs.ts
var MMRS = class {
  constructor(baseUrl) {
    this.client = new client_default(baseUrl);
  }
  async userMatchStats() {
    const response = await this.client.request({
      method: "GET",
      url: "/stats"
    });
    return response;
  }
};

// src/api/ums.ts
var UMS = class {
  constructor(baseUrl) {
    this.client = new client_default(baseUrl);
    this.instance = axios_default.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  async signIn(form) {
    const response = await this.instance.request({
      method: "POST",
      url: "/login",
      data: form.toSubmit()
    });
    return response;
  }
  async signUp(form) {
    const response = await this.instance.request({
      method: "POST",
      url: "/registration",
      data: form.toSubmit()
    });
    return response;
  }
  async loginWithGoogle(data) {
    const response = await this.instance.request({
      method: "POST",
      url: "/google/login",
      data
    });
    return response;
  }
  async veryfyOtpCode(code, key) {
    const response = await this.instance.request({
      method: "POST",
      url: "/verify_otp",
      data: {
        otp: code,
        uuid: key
      }
    });
    cacheTokens(response.data);
    return response;
  }
  async refresh() {
    const tokens = getTokens();
    console.log("old tokens :>> ", tokens);
    try {
      const response = await this.instance.request({
        method: "POST",
        url: "/refresh",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        data: {
          "refreshToken": tokens.refreshToken
        }
      });
      if (response && response.data) {
        cacheTokens(response.data);
      }
      console.log("new tokens :>> ", response.data);
      return response;
    } catch (error) {
      console.log("refresh error :>> ", error);
      if (error.response && error.response.status == 401) {
        setTimeout(async () => {
          removeTokens();
          router_default.push("home");
          EventBroker.getInstance().emit("update-auth");
        });
      }
      return error.response;
    }
  }
  async signOut() {
    removeTokens();
    return null;
  }
  async userDelete() {
    const refreshToken = getTokens().refreshToken;
    return await this.client.request({
      method: "DELETE",
      url: "/user",
      data: {
        refreshToken
      }
    });
  }
  async userGetInfo() {
    return await this.client.request({
      method: "GET",
      url: "/user"
    });
  }
  async userUpdateAvatar(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await this.client.request({
      method: "POST",
      url: "/user/avatar",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  async userUpdatePassword(form) {
    return await this.client.request({
      method: "PATCH",
      url: "/user/password",
      data: form.toSubmit()
    });
  }
  async userUpdateNickname(nickname) {
    return await this.client.request({
      method: "PATCH",
      url: "/user/nickname",
      data: {
        nickname
      }
    });
  }
};

// src/api/api.ts
var API = class {
  static {
    this.ums = new UMS("http://localhost:5000/auth/api/rest");
  }
  static {
    this.mmrs = new MMRS("http://localhost:5001/mmrs/api/rest");
  }
};

// src/api/oauth/google.ts
var import_js_sha256 = __toESM(require_sha256());

// src/store/getters.ts
var StoreGetters = class {
  constructor(state) {
    this.state = state;
  }
  async gameStats(onUpdate) {
    return this.state.gameStats.getValue(onUpdate);
  }
  async user(onUpdate) {
    return this.state.user.getValue(onUpdate);
  }
  async userNickname(onUpdate) {
    const onUpdateCallback = onUpdate ? (value) => onUpdate(value?.nickname) : void 0;
    const user = await this.state.user.getValue(onUpdateCallback);
    if (!user) {
      return void 0;
    }
    return user.nickname;
  }
  async userRating(onUpdate) {
    const onUpdateCallback = onUpdate ? (value) => onUpdate(value?.rating) : void 0;
    const user = await this.state.user.getValue(onUpdateCallback);
    if (!user) {
      return void 0;
    }
    return user.rating;
  }
  async userId(onUpdate) {
    const onUpdateCallback = onUpdate ? (value) => onUpdate(value?.id) : void 0;
    const user = await this.state.user.getValue(onUpdateCallback);
    if (!user) {
      return void 0;
    }
    return user.id;
  }
};

// src/types/GameStat.ts
var GameStat = class {
  constructor(data) {
    this.uid = data.uid || data.id;
    this.date = new Date(data.staredAt || data.started_at);
    this.typeId = data.typeId || data.mode;
    this.statusId = data.statusId || data.status;
    this.winnerId = data.winnerId || data.winner_id;
  }
  getDateTime() {
    const minutes = this.date.getMinutes();
    const hours = this.date.getHours();
    const time = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    return this.date.toLocaleDateString() + " " + time;
  }
};
var GameStat_default = GameStat;

// src/types/User.ts
var User = class {
  constructor(data) {
    this.avatarUrl = null;
    this.id = data.id;
    this.nickname = data.nickname;
    this.rating = data.rating;
    this.avatarUrl = data.avatar || null;
  }
};

// src/store/setters.ts
var StoreSetters = class {
  constructor(state) {
    this.state = state;
  }
  async updateUserNickname(nickname) {
    const user = await this.state.user.getValue();
    if (!user) {
      return;
    }
    user.nickname = nickname;
    this.state.user.setValue(user);
  }
  deleteUser() {
    this.state.user.clearValue();
  }
  async setupUser() {
    if (!isAuthorized()) {
      return;
    }
    try {
      const response = await API.ums.userGetInfo();
      console.log({ response, data: response.data });
      if (!response) {
        throw new Error("no response");
      }
      if (!response.data) {
        throw new Error("no user data in response");
      }
      this.state.user.setValue(new User(response.data));
    } catch (e) {
      console.error("Store error: can't get user data :", e);
    }
  }
  async setupGameStats() {
    if (!isAuthorized()) {
      return;
    }
    try {
      const response = await API.mmrs.userMatchStats();
      if (!response) {
        throw new Error("no response");
      }
      if (response.status == 204) {
        this.state.gameStats.setValue([]);
      } else if (response.status == 200) {
        if (!response.data || response.data instanceof Array === false) {
          throw new Error("no game stats data in response");
        }
        console.log("StoreSetters: setupGameStats response:", response.data);
        const gameStats = response.data.map((stat) => new GameStat_default(stat));
        this.state.gameStats.setValue(gameStats);
      } else {
        throw new Error("unexpected response status: " + response.status);
      }
    } catch (e) {
      console.error("Store error: can't get game stats :", e);
    }
  }
};

// src/store/field.ts
var StoreField = class {
  constructor() {
    this.isSet = false;
    this.pendingResolversQueue = [];
    this.onUpdateCallbacks = [];
  }
  setValue(newValue) {
    this.value = newValue;
    this.isSet = true;
    this.pendingResolversQueue.forEach((resolve) => resolve(newValue));
    this.pendingResolversQueue = [];
    this.onUpdateCallbacks.forEach((callback) => callback(this.value));
  }
  getValue(onUpdate) {
    if (onUpdate) {
      this.onUpdateCallbacks.push(onUpdate);
    }
    if (this.isSet) {
      return new Promise((resolve, reject) => {
        if (onUpdate) {
          onUpdate(this.value);
        }
        resolve(this.value);
      });
    }
    return new Promise((resolve) => {
      this.pendingResolversQueue.push(resolve);
    });
  }
  clearValue() {
    this.value = void 0;
    this.isSet = false;
    this.onUpdateCallbacks.forEach((callback) => callback(void 0));
  }
};

// src/store/state.ts
var StoreState = class {
  constructor() {
    this.user = new StoreField();
    this.gameStats = new StoreField();
  }
};

// src/store/store.ts
var Store = class {
  static {
    this.state = new StoreState();
  }
  static {
    this.setters = new StoreSetters(this.state);
  }
  static {
    this.getters = new StoreGetters(this.state);
  }
};

// src/api/oauth/google.ts
function generateRandomString(length = 128) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function sha256Base64Url(str) {
  const hash = import_js_sha256.sha256.array(str);
  const binary = String.fromCharCode(...hash);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var GoogleOAuth = class {
  static async redirectToGoogle(clientId, redirectUri) {
    if (!clientId || !redirectUri) {
      throw new Error("Client ID and redirect URI are required");
    }
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await sha256Base64Url(codeVerifier);
    const state = generateRandomString(32);
    sessionStorage.setItem("code_verifier", codeVerifier);
    sessionStorage.setItem("pkce_state", state);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20email%20profile&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.location.href = authUrl;
  }
  static async authorizeWithGoogle(redirectUri) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state) {
      throw new Error("Invalid response from Google OAuth");
    }
    const savedState = sessionStorage.getItem("pkce_state");
    const codeVerifier = sessionStorage.getItem("code_verifier");
    if (state !== savedState) {
      throw new Error("State mismatch!");
    }
    if (!codeVerifier) {
      throw new Error("Code verifier not found!");
    }
    try {
      const response = await API.ums.loginWithGoogle({
        code,
        codeVerifier,
        redirectUri
      });
      cacheTokens(response.data);
    } catch (error) {
      console.error("Error during Google OAuth authorization:", error);
      throw error;
    }
    sessionStorage.removeItem("pkce_state");
    sessionStorage.removeItem("code_verifier");
    Store.setters.setupUser();
    router_default.push("home");
    EventBroker.getInstance().emit("update-auth");
  }
};

// src/components/inputs/ButtonComponent.ts
var ButtonComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "button-component";
  }
  data() {
    return {
      clickHandler: () => {
      }
    };
  }
  onClick(fn) {
    this.state.clickHandler = fn;
    return this;
  }
  getButtonColor() {
    const type = this.props.type || "default";
    const color = this.props.color || "gray";
    switch (type) {
      case "default":
        return `bg-${color}-500 hover:bg-${color}-600 active:bg-${color}-700 text-white`;
      case "outline":
        return `border border-${color}-300 hover:bg-${color}-100 active:bg-${color}-200 text-${color}-500`;
      case "blank":
        return `bg-${color}-100 hover:bg-${color}-200 active:bg-${color}-300 text-gray-800`;
      default:
        return `bg-${color}-200 hover:bg-${color}-300 active:bg-${color}-400 text-gray-800`;
    }
  }
  getButtonSize(iconOnly) {
    const size = this.props.size || "medium";
    let sizeStyles = "";
    if (iconOnly) {
      switch (size) {
        case "small":
          sizeStyles = "w-6 h-6 p-2";
          break;
        case "large":
          sizeStyles = "w-10 h-10 p-6";
          break;
        default:
          sizeStyles = "w-8 h-8 p-4";
      }
    } else {
      switch (size) {
        case "small":
          sizeStyles = "w-6 h-6 px-2 py-1 text-sm";
          break;
        case "large":
          sizeStyles = "px-6 py-3 text-lg";
          break;
        default:
          sizeStyles = "px-4 py-2 text-base";
      }
    }
    if (this.props.fullWidth) {
      sizeStyles += " w-full";
    }
    return `${sizeStyles}`;
  }
  template() {
    const iconOnly = !this.props.label && this.props.icon;
    const buttonSize2 = `${this.getButtonSize(iconOnly)} rounded-lg`;
    const buttonColor2 = this.getButtonColor();
    const buttonAnime = "transition duration-200 ease-in-out cursor-pointer";
    const buttonDisabledStyle = this.props.isDisabled ? "opacity-50 cursor-not-allowed" : "";
    const button = elem("button").setProps({
      class: `${buttonColor2} ${buttonSize2} ${buttonAnime} ${buttonDisabledStyle} flex justify-center items-center`
    });
    if (this.props.icon) {
      button.addChild(
        elem("i").setProps({ class: this.props.icon })
      );
    }
    if (this.props.label) {
      button.addChild(
        elem("span").setProps({ class: this.props.icon ? "ml-2" : void 0 }).addChild(text(this.props.label))
      );
    }
    if (this.state.clickHandler && !this.props.isDisabled) {
      button.addEventListener("click", this.state.clickHandler);
    }
    return button;
  }
};

// src/components/content/auth-callback-content/AuthFailedMessageComponent.ts
var AuthFailedMessageComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "auth-failed-message-component";
  }
  data() {
    return {};
  }
  template() {
    return elem("div").setProps({ class: "rounded-lg overflow-hidden shadow-md gap-2 bg-white p-6  max-w-2xl w-full flex flex-col items-center" }).setChild([
      elem("i").setProps({ class: "ti ti-bug text-xl text-red-500" }),
      elem("h1").setProps({ class: "text-2xl font-bold" }).addChild("Authorization Failed"),
      elem("div").setChild([
        elem("p").setProps({ class: "text-md text-center" }).addChild("An error occurred during the authorization process.")
      ]),
      new ButtonComponent({
        label: "Home",
        color: "blue"
      }).onClick(() => router_default.push("home"))
    ]);
  }
};

// src/components/content/auth-callback-content/InProccessMessageComponent.ts
var InProccessMessageComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "in-proccess-message-component";
  }
  data() {
    return {};
  }
  template() {
    return elem("div").setProps({ class: "rounded-lg overflow-hidden shadow-md gap-2 bg-white p-6  max-w-2xl w-full flex flex-col items-center" }).setChild([
      elem("i").setProps({ class: "ti ti-loader loading text-xl text-blue-500" }),
      elem("h1").setProps({ class: "text-2xl font-bold" }).addChild("Authorizing..."),
      elem("div").setChild([
        elem("p").setProps({ class: "text-md text-center" }).addChild("Please wait until the authorization process is completed."),
        elem("p").setProps({ class: "text-md text-center" }).addChild("This may take a few seconds.")
      ])
    ]);
  }
};

// src/config.ts
var Config = class {
  static {
    this.googleOauthClientId = window.__ENV__.GOOGLE_OAUTH_CLIENT_ID || "";
  }
  static {
    this.googleOauthRedirectUri = window.__ENV__.GOOGLE_OAUTH_REDIRECT_URI || "";
  }
};

// src/pages/AuthCallbackPage.ts
var OAuthCallbackPage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "oauth-callback-page";
  }
  data() {
    return {
      authIsFailed: false
    };
  }
  async onCreated() {
    try {
      await GoogleOAuth.authorizeWithGoogle(Config.googleOauthRedirectUri);
    } catch (error) {
      this.state.authIsFailed = true;
      console.log("Error during OAuth authorization:", error);
    }
  }
  template() {
    return elem("div").setProps({
      id: "oauth-callback-page",
      class: "flex flex-col items-center justify-center h-full w-full pt-8"
    }).addChild(
      this.state.authIsFailed ? new AuthFailedMessageComponent() : new InProccessMessageComponent()
    );
  }
};

// src/components/content/game-page-content/InfoBarComponent.ts
var InfoBarComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "info-bar-component";
  }
  template() {
    return elem("div").setProps({ class: "flex justify-between items-center p-4 w-[512px] " }).setChild([
      elem("div").setProps({ class: "text-bold text-md" }).addChild(this.props.player1Nickname),
      elem("div").setProps({ class: "text-bold text-lg" }).addChild(`${this.props.player1Score} : ${this.props.player2Score}`),
      elem("div").setProps({ class: "text-bold text-md" }).addChild(this.props.player2Nickname)
    ]);
  }
};

// src/pkg/ws-client/message.ts
var Message = class {
  constructor(raw) {
    console.log("Message info: Message constructor", raw);
    const obj = JSON.parse(raw);
    this.type = obj.type;
    this.raw = raw;
    this.data = obj;
  }
  getType() {
    return this.type;
  }
  getData() {
    return this.data;
  }
};

// src/pkg/ws-client/client.ts
var WebSocketClient = class {
  constructor(addr, opts) {
    this.listeners = /* @__PURE__ */ new Map();
    this.socket = new WebSocket(addr);
    this.opts = opts;
    this.socket.onopen = this.openHandler.bind(this);
    this.socket.onclose = this.closeHandler.bind(this);
    this.socket.onerror = this.errorHandler.bind(this);
    this.socket.onmessage = this.messageHandler.bind(this);
  }
  close() {
    this.socket.close();
  }
  on(type, callback) {
    if (this.listeners.has(type)) {
      throw new Error(`WebSocketClient error : Listener for ${type} already exists`);
    }
    this.listeners.set(type, callback);
    return this;
  }
  send(type, data) {
    this.socket.send(JSON.stringify({ type, ...data }));
  }
  openHandler() {
    console.log("WebSocketClient info: WebSocket WebSocketClient opened");
    if (this.opts?.onOpenCallback) {
      this.opts.onOpenCallback();
    }
  }
  closeHandler() {
    console.log("WebSocketClient info : WebSocket WebSocketClient closed");
    if (this.opts?.onCloseCallback) {
      this.opts.onCloseCallback();
    }
  }
  errorHandler(error) {
    console.error("WebSocketClient error : WebSocket error", error);
    if (this.opts?.onErrorCallback) {
      this.opts.onErrorCallback(error);
    }
  }
  messageHandler(event) {
    const raw = event.data;
    let message;
    try {
      message = new Message(raw);
    } catch (e) {
      console.error("WebSocketClient error : WebSocket message parse error", e);
      return;
    }
    const messageListener = this.parseMessage(message);
    if (!messageListener) {
      console.warn(`WebSocketClient error : WebSocket message ${message.getType()} listener not found`);
      return;
    }
    const data = message.getData();
    messageListener(data);
    console.log(`WebSocketClient info : ${message.getType()}	|`, data);
  }
  parseMessage(message) {
    const type = message.getType();
    return this.listeners.get(type);
  }
};

// src/pkg/game/play/ws.ts
var GameWebSocket = class _GameWebSocket {
  static connect(params) {
    if (_GameWebSocket.conn !== void 0) {
      console.warn("WebSocket connection already exists.");
      return;
    }
    _GameWebSocket.conn = new WebSocketClient("ws://localhost:5002/game/api/ws", {
      onOpenCallback: () => {
        console.log("GameWebSocket connection opened.");
        if (params.onOpenCallback) {
          params.onOpenCallback();
        }
      },
      onCloseCallback: () => {
        console.log("GameWebSocket connection closed.");
        if (params.onCloseCallback) {
          params.onCloseCallback();
        }
        _GameWebSocket.conn = void 0;
      },
      onErrorCallback: (error) => {
        if (params.onErrorCallback) {
          params.onErrorCallback(error);
        }
        console.error("GameWebSocket error:", error);
      }
    });
  }
  static on(action, callback) {
    if (_GameWebSocket.conn === void 0) {
      console.warn("WebSocket connection does not exist. Cannot register action listener.");
      setTimeout(() => this.on(action, callback), 100);
      return;
    }
    _GameWebSocket.conn.on(action, callback);
    console.log("Registering action listener for:", action);
  }
  static close() {
    if (_GameWebSocket.conn === void 0) {
      console.warn("WebSocket connection does not exist.");
      return;
    }
    _GameWebSocket.conn.close();
    _GameWebSocket.conn = void 0;
  }
  static send(action, payload) {
    if (_GameWebSocket.conn === void 0) {
      console.warn("WebSocket connection does not exist. Cannot send action.");
      return;
    }
    _GameWebSocket.conn.send(action, { payload });
  }
  static playerMoveDown() {
    _GameWebSocket.send("move_down" /* MoveDown */);
  }
  static playerMoveUp() {
    _GameWebSocket.send("move_up" /* MoveUp */);
  }
  static playerStop() {
    _GameWebSocket.send("stop" /* Stop */);
  }
  static join(accessToken) {
    console.log({ accessToken });
    _GameWebSocket.send("join" /* Join */, { accessToken });
  }
};

// src/pkg/game/play/moveController.ts
var MoveController = class {
  constructor() {
    this.direction = 0;
    this.pressedKeys = /* @__PURE__ */ new Set();
  }
  move(event) {
    if (this.direction != 1 && event.key === "w") {
      GameWebSocket.playerMoveUp();
      this.direction = 1;
    }
    if (this.direction != -1 && event.key === "s") {
      GameWebSocket.playerMoveDown();
      this.direction = -1;
    }
    if (event.key === "s" || event.key === "w") {
      this.pressedKeys.add(event.key);
    }
  }
  stop(event) {
    if (event.key !== "s" && event.key !== "w") {
      return;
    }
    if (this.pressedKeys.has(event.key)) {
      this.pressedKeys.delete(event.key);
    }
    if (this.pressedKeys.size === 0) {
      this.direction = 0;
      GameWebSocket.playerStop();
      return;
    }
    if (this.direction != 1 && this.pressedKeys.has("w")) {
      GameWebSocket.playerMoveUp();
      this.direction = 1;
    } else if (this.direction != -1 && this.pressedKeys.has("s")) {
      GameWebSocket.playerMoveDown();
      this.direction = -1;
    }
  }
};

// src/pkg/game/play/server.ts
var SERVER_ACTION = /* @__PURE__ */ ((SERVER_ACTION2) => {
  SERVER_ACTION2["Sync"] = "sync";
  SERVER_ACTION2["Authorized"] = "authorized";
  SERVER_ACTION2["Unauthorized"] = "unauthorized";
  return SERVER_ACTION2;
})(SERVER_ACTION || {});
var server_default = SERVER_ACTION;

// src/pkg/game/play/player.ts
var Player = class _Player {
  static {
    this.moveController = new MoveController();
  }
  static setup(accessToken, onUnauthorizedCallback) {
    GameWebSocket.on(server_default.Authorized, () => _Player.onAuthorizedHandler());
    GameWebSocket.on(server_default.Unauthorized, () => _Player.onUnauthorizedHandler(onUnauthorizedCallback));
    GameWebSocket.connect({
      onOpenCallback: () => GameWebSocket.join(accessToken)
    });
  }
  static onAuthorizedHandler() {
    console.log("Player setup complete. Listening for key events...");
    this.moveHandler = (event) => this.moveController.move(event);
    this.stopHandler = (event) => this.moveController.stop(event);
    window.addEventListener("keydown", this.moveHandler);
    window.addEventListener("keyup", this.stopHandler);
  }
  static onUnauthorizedHandler(onUnauthorizedCallback) {
    GameWebSocket.close();
    onUnauthorizedCallback();
  }
  static cleanup() {
    GameWebSocket.close();
    console.log("Player cleanup complete. Removing key event listeners...");
    if (this.moveHandler) {
      window.removeEventListener("keydown", this.moveHandler);
    }
    if (this.stopHandler) {
      window.removeEventListener("keyup", this.stopHandler);
    }
    this.moveHandler = void 0;
    this.stopHandler = void 0;
  }
  static onUpdatePosition(fn) {
    GameWebSocket.on(server_default.Sync, fn);
  }
};

// src/components/content/game-page-content/DelimeterComponet.ts
var DelimeterComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "delimeter-component";
  }
  template() {
    return elem("div").setProps({ class: "w-[1px] bg-gray-300 absolute top-[16px] bottom-[16px] left-1/2 transform -translate-x-1/2" });
  }
};

// src/components/content/game-page-content/PaddleComponent.ts
var PaddleComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "paddle-component";
  }
  template() {
    const position = `top-[${this.props.top + 16}px] ${this.props.side == "left" ? "left" : "right"}-[16px]`;
    return elem("div").setProps({ class: `w-[6px] h-[42px] bg-blue-500 rounded-lg absolute ${position}` });
  }
};

// src/components/content/game-page-content/SceneComponent.ts
var SceneComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "scene-component";
  }
  data() {
    return {
      player1Config: { top: 0, side: "left" },
      player2Config: { top: 0, side: "right" }
      // ballConfig: {top: 0, left: 0},
    };
  }
  onCreated() {
    Player.onUpdatePosition((data) => {
      const state = data.payload;
      if (!state) {
        return;
      }
      console.log("new state!", state, "is change 1", this.state.player1Config.top, state.player1Pos, "is change 2", this.state.player2Config.top, state.player2Pos);
      if (this.state.player1Config.top !== state.player1Pos) {
        this.state.player1Config = { top: state.player1Pos, side: "left" };
      }
      if (this.state.player2Config.top !== state.player2Pos) {
        this.state.player2Config = { top: state.player2Pos, side: "right" };
      }
    });
  }
  template() {
    return elem("div").setProps({ class: "p-[16px] w-[512px] h-[320px] relative bg-gray-100 rounded-lg shadow-md" }).setChild([
      new DelimeterComponent(),
      new PaddleComponent(this.state.player1Config),
      new PaddleComponent(this.state.player2Config)
    ]);
  }
};

// src/components/content/game-page-content/GameComponent.ts
var GameComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "game-component";
  }
  data() {
    return {};
  }
  template() {
    return elem("div").setProps({ class: "flex items-center flex-col" }).setChild([
      new InfoBarComponent({
        player1Nickname: "Player 1",
        player2Nickname: "Player 2",
        player1Score: 0,
        player2Score: 0
      }),
      new SceneComponent()
    ]);
  }
};

// src/layouts/dashboard/DashboardLayout.ts
var DashboardComponent = class extends component_default {
  constructor(label) {
    super({ label });
    this.componentName = "dashboard-component";
  }
  slots() {
    return [
      "content",
      "header"
    ];
  }
  template() {
    const content = this.useSlot("content");
    const header = this.useSlot("header");
    const dashboard = elem("div").setProps({
      id: "dashboard-component",
      class: "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6"
    });
    if (header) {
      dashboard.addChild(header);
    } else if (this.props.label) {
      dashboard.addChild(
        elem("h1").setProps({ class: "text-2xl font-bold mb-4" }).addChild(text(this.props.label))
      );
    }
    dashboard.addChild(content);
    return dashboard;
  }
};

// src/pages/GamePage.ts
var GamePage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "game-page";
  }
  data() {
    return {};
  }
  onMounted() {
    const tokens = getTokens();
    if (!tokens) {
      router_default.push("home");
      return;
    }
    let isCallbackActivated = false;
    const onUnauthorizedCallback = () => {
      if (isCallbackActivated) {
        router_default.push("home");
        return;
      }
      isCallbackActivated = true;
      API.ums.refresh().then(() => Player.setup(tokens.accessToken, onUnauthorizedCallback));
    };
    Player.setup(tokens.accessToken, onUnauthorizedCallback);
  }
  onUnmounted() {
    console.log("GameComponent unmounted");
    Player.cleanup();
  }
  template() {
    const dashboard = new DashboardComponent().setSlot("content", new GameComponent());
    return elem("div").setProps({ id: "game-page" }).setChild([
      elem("div").setProps({ class: "flex flex-col items-center p-4 pt-8" }).addChild(dashboard)
    ]);
  }
};

// src/components/inputs/InfoParagraphComponent.ts
var InfoParagraphComponent = class extends component_default {
  constructor(text15) {
    super({ text: text15 });
    this.componentName = "info-paragraph-component";
  }
  template() {
    return elem("p").setProps({ class: "text-gray-700 text-base mb-2" }).addChild(text(this.props.text));
  }
};

// src/pkg/game/launcher/confirmation.ts
var PlayersConfirmation = class {
  constructor(playersCount) {
    this.playersStatuses = new Array(playersCount).fill(false);
  }
  setConfirm() {
    const unconfirmedIndex = this.playersStatuses.findIndex((status) => !status);
    if (unconfirmedIndex !== -1) {
      this.playersStatuses[unconfirmedIndex] = true;
    }
  }
  getPlayersStatuses() {
    return this.playersStatuses.map((status) => {
      return status ? "confirmed" : "waiting";
    });
  }
};

// src/pkg/game/launcher/gameLauncher.ts
var GameLauncher = class {
  static {
    this.searchGameType = null;
  }
  static {
    this.isConfirmed = false;
  }
  static async startGameSearching(accessToken, game, options = {}) {
    try {
      const opts = {
        onOpenCallback: () => this.onEstablishConnection(accessToken, game, options.onConnectedCallback)
      };
      const user = await Store.getters.user();
      if (!user) {
        return;
      }
      const addr = `ws://localhost:5001/matchmaking`;
      this.client = new WebSocketClient(addr, opts).on("searching" /* MATCH_SEARCH */, (data) => this.matchSearchStartHandler(game, options.onConnectedCallback)).on("match_found" /* MATCH_FOUND */, (data) => this.matchFoundHandler(data)).on("match_timeout" /* MATCH_TIMEOUT */, (data) => this.matchTimeoutHandler(data)).on("unauthorized" /* UNAUTHORIZED */, (data) => this.unatuhorizedHandler(data, options.onUnauthorizedCallback));
    } catch (e) {
      console.error("GameLauncher error : WebSocketClient connection error", e);
      return;
    }
  }
  static onEstablishConnection(accessToken, game, onConnectedCallback) {
    console.log("GameLauncher : WebSocket connection opened");
    this.client?.send("join" /* JOIN */, { token: accessToken });
  }
  static stopGameSearching() {
    this.searchGameType = null;
    this.userId = void 0;
    this.confirmation = void 0;
    this.client?.close();
    EventBroker.getInstance().emit("deactivate-search-game-bar");
  }
  static unatuhorizedHandler(data, onUnauthorizedCallback) {
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  }
  static matchFoundHandler(data) {
    if (!data) {
      console.error("GameLauncher error : No opponent found");
      return;
    }
    this.confirmation = new PlayersConfirmation(this.searchGameType?.players || 0);
    EventBroker.getInstance().emit("deactivate-search-game-bar");
    EventBroker.getInstance().emit("activate-confirmation-modal", { confirmTime: data.timeLeft });
  }
  static matchSearchStartHandler(game, onConnectedCallback) {
    if (onConnectedCallback) {
      onConnectedCallback();
    }
    this.searchGameType = game;
    EventBroker.getInstance().emit("activate-search-game-bar", this.searchGameType);
  }
  static matchTimeoutHandler(data) {
    this.confirmation = void 0;
    if (this.isConfirmed) {
      EventBroker.getInstance().emit("activate-search-game-bar");
    } else {
      this.client?.close();
    }
    EventBroker.getInstance().emit("deactivate-confirmation-modal", this.searchGameType);
  }
  static async confirmGame(callback = null) {
    if (this.isConfirmed || !this.confirmation) {
      return;
    }
    this.client?.send("match_confirmed" /* CONFIRM */);
    this.isConfirmed = true;
    this.confirmation.setConfirm();
    if (callback) {
      callback();
    }
  }
  static getConfirmationStatus() {
    if (!this.isConfirmed || !this.searchGameType) {
      return [];
    }
    return this.confirmation?.getPlayersStatuses();
  }
  // static cancelGame(callback: Function | null = null) {
  //     if (!this.searchGameType) {
  //         return;
  //     }
  //     EventBroker.getInstance().emit("deactivate-confirmation-modal");
  //     setTimeout(() => { 
  //         const isWasConfirmed = this.isConfirmed;
  //         this.isConfirmed = false;
  //         if (callback) {
  //             callback();
  //         }
  //         console.log("Game cancelled", isWasConfirmed);
  //         if (!this.searchGameType) {
  //             return; 
  //         }
  //         const game = this.searchGameType;
  //         this.searchGameType = null;
  //         if (isWasConfirmed) {
  //             this.startGameSearching(this.userId || 0, game)
  //         }
  //     }, 200)
  // }
};

// src/layouts/loading/LoadingLayout.ts
var LoadingLayout = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "loading-layout";
  }
  data() {
    return {
      show: false
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  template() {
    return elem("div").$vif(this.state.show).setProps({ class: "absolute top-0 left-0 w-full h-full flex items-center justify-center" }).setChild([
      elem("div").setProps({ class: "absolute z-1 top-0 left-0 w-full h-full bg-gray-200 opacity-50" }),
      elem("div").setProps({ class: "absolute z-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center" }).setChild([
        elem("i").setProps({ class: `${this.props.icon} text-xl text-blue-500 animate-spin` }),
        elem("p").setProps({ class: "text-gray-700 mt-2" }).addChild(text(this.props.label))
      ])
    ]);
  }
};

// src/layouts/modal/ModalLayoutCloseButton.ts
var buttonSize = "w-6 h-6";
var buttonColor = "bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg ease-in-out duration-200";
var buttonInner = "flex items-center justify-center";
var ModalLayoutCloseButton = class extends component_default {
  constructor(onClick) {
    super({ onClick });
    this.componentName = "modal-layout-close-button";
  }
  template() {
    const button = elem("button").setProps({ class: `${buttonSize} ${buttonColor} ${buttonInner}` }).addChild(elem("i").setProps({ class: "ti ti-x" }));
    if (this.props.onClick) {
      button.addEventListener("click", this.props.onClick.bind(this));
    }
    return button;
  }
};

// src/layouts/modal/ModalLayout.ts
var ModalLayout = class extends component_default {
  constructor(name, opts = {}) {
    super({ name, opts });
  }
  data() {
    return {
      show: false
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  slots() {
    return [
      "header",
      "body",
      "footer"
    ];
  }
  template() {
    if (!this.state.show) {
      return void 0;
    }
    const header = this.useSlot("header");
    const body = this.useSlot("body");
    const footer = this.useSlot("footer");
    const defaultCardSize = "min-h-20 min-w-20 max-w-80 rounded-lg shadow-lg bg-white";
    const cardSize = this.props.opts.customClasses || defaultCardSize;
    const cardPos = "absolute left-1/2 transform -translate-x-1/2";
    const onCloseFuncion = this.props.opts.onClose;
    const backdrop = elem("div").setProps({ class: "w-dvw h-dvh bg-black opacity-50 " });
    if (this.props.opts.closeOnClickOutside && onCloseFuncion) {
      backdrop.addEventListener("click", () => {
        onCloseFuncion.bind(this)();
      });
    }
    const headerComp = elem("div").$vif(header !== null).setProps({ class: "px-6 py-4 flex gap-4 items-center " });
    if (this.props.opts.onClose) {
      const closeHandler = onCloseFuncion ? onCloseFuncion.bind(this) : void 0;
      headerComp.addChild(new ModalLayoutCloseButton(closeHandler));
    }
    headerComp.addChild(header);
    return elem("div").setProps({ class: `fixed top-0 left-0 z-10 flex items-center` }).setChild([
      // Backdrop (outside click --> close)
      backdrop,
      // Modal Window (with header and body slots)
      elem("div").setProps({ class: ` ${cardSize} ${cardPos}  overflow-hidden` }).setChild([
        // Header
        headerComp,
        // Body
        elem("div").setProps({ class: "p-6 pt-0" }).addChild(body),
        // Footer
        elem("div").$vif(footer !== null).setProps({ class: "p-6 pt-0" }).addChild(footer)
      ])
    ]);
  }
};

// src/types/Game.ts
var Game = class {
  constructor(id, name, description, players, icon) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.players = players;
    this.icon = icon;
  }
};

// src/data/games.ts
var games = [
  new Game(0, "Training", "Fight against a bot to train your skills.", 1, "ti ti-robot"),
  new Game(1, "Duel", "Face off against another player in a 1v1 duel.", 2, "ti ti-users"),
  new Game(2, "Turnament", "Become the target of everyone and prove you're the king of the hill.", 8, "ti ti-tournament")
];
var games_default = games;

// src/pkg/game/launcher/preferedMode.ts
var PreferModeStorage = class {
  static save(modeId) {
    localStorage.setItem("prefered-mode", modeId.toString());
  }
  static get() {
    const modeId = localStorage.getItem("prefered-mode");
    if (!modeId) {
      return null;
    }
    return parseInt(modeId);
  }
};

// src/components/content/game-launch-modal-content/GameCurrentRatingComponent.ts
var GameCurrentRatingComponent = class extends component_default {
  constructor(rating) {
    super({ rating });
    this.componentName = "game-current-rating-component";
  }
  template() {
    return elem("p").$vif(this.props.rating).setProps({ class: "text-sm text-gray-500 mt-6 mb-2" }).addChild(text(`Rating : ${this.props.rating}`));
  }
};

// src/components/inputs/TagComponent.ts
var TagComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "tag-component";
  }
  template() {
    const icon = this.props.icon ? elem("i").setProps({ class: this.props.icon }) : null;
    return elem("div").setProps({
      class: `flex flex-row items-center gap-2 bg-${this.props.color}-100 text-${this.props.color}-800 text-sm font-medium px-2.5 py-0.5 rounded`
    }).setChild([
      icon,
      elem("div").setProps({ class: "" }).addChild(text(this.props.label))
    ]);
  }
};

// src/components/content/game-launch-modal-content/GameDescriptionComponent.ts
var GameDescriptionComponent = class extends component_default {
  constructor(game) {
    super({ game });
    this.componentName = "game-description-component";
  }
  template() {
    const description = this.props.game.description;
    const number = this.props.game.players;
    const name = this.props.game.name;
    return elem("span").setChild([
      elem("div").setProps({ class: "flex gap-2 mt-4" }).setChild([
        elem("h4").setProps({ class: "text-lg font-semibold text-gray-800" }).addChild(text(name)),
        new TagComponent({
          label: `${number} player${number > 1 ? "s" : ""}`,
          color: "blue",
          icon: "ti ti-users"
        })
      ]),
      elem("p").setProps({ class: "text-sm text-gray-600 mt-2 max-w-xs" }).addChild(text(description))
    ]);
  }
};

// src/components/content/game-launch-modal-content/GameOptionComponent.ts
var GameOptionComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "game-option";
  }
  template() {
    const sizeStyles = "w-24 h-24 flex flex-col items-center justify-center rounded-lg";
    const borderStyles = this.props.isSelected ? "border-blue-300" : "border-blue-100";
    const hoverStyles = this.props.isSelected ? "hover:border-blue-400" : "hover:border-blue-300";
    const backgroundStyles = this.props.isSelected ? "bg-blue-100" : "bg-white";
    return elem("div").setProps({
      class: `${sizeStyles} border-2 ${borderStyles} ${hoverStyles} ${backgroundStyles} select-none cursor-pointer  shadow-md transition duration-300`
    }).setChild([
      elem("i").setProps({ class: this.props.game.icon }),
      elem("p").setProps({ class: "text-sm mt-2" }).addChild(text(this.props.game.name))
    ]).addEventListener("click", () => {
      this.props.onClick(this.props.game.id);
    });
  }
};

// src/components/content/game-launch-modal-content/BodyComponent.ts
var GameLauchBodyComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "game-launch-body";
  }
  data() {
    return {
      rating: void 0,
      selectedOption: PreferModeStorage.get() ?? 0
    };
  }
  onCreated() {
    Store.getters.userRating().then((rating) => {
      if (!rating) {
        return;
      }
      this.state.rating = rating;
    });
  }
  updateSelectedOption(gameId) {
    if (this.state.selectedOption === gameId) {
      return;
    }
    this.state.selectedOption = gameId;
    PreferModeStorage.save(gameId);
  }
  template() {
    return elem("div").setChild([
      elem("div").setProps({ class: "flex flex-row gap-4 mt-4" }).setChild([
        ...games_default.map((option, index) => {
          return new GameOptionComponent({
            game: option,
            isSelected: this.state.selectedOption === index,
            onClick: this.updateSelectedOption.bind(this)
          });
        })
      ]),
      elem("hr").setProps({ class: "my-4 border-gray-300" }),
      new GameDescriptionComponent(games_default[this.state.selectedOption]),
      new GameCurrentRatingComponent(this.state.rating),
      new ButtonComponent({
        label: "Find Game",
        color: "blue",
        fullWidth: true
      }).onClick(() => this.props.onSubmit(games_default[this.state.selectedOption]))
    ]);
  }
};

// src/components/modals/GameLauncherModal.ts
var GameLauncherModal = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "game-launch-modal";
  }
  data() {
    return {
      userId: void 0,
      show: false,
      isLoading: false
    };
  }
  onCreated() {
    Store.getters.userId().then((userId) => {
      this.state.userId = userId;
    });
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  onSubmit(game) {
    if (!this.state.userId) {
      console.error("GameLauncherModal error : userId is undefined");
      return;
    }
    this.state.isLoading = true;
    const accessToken = getTokens()?.accessToken;
    if (!accessToken) {
      return;
    }
    GameLauncher.startGameSearching(accessToken, game, {
      onConnectedCallback: () => {
        this.state.show = false;
        this.state.isLoading = false;
      },
      onUnauthorizedCallback: () => {
        API.ums.refresh().then((response) => this.onSubmit(game));
      }
    });
  }
  template() {
    return elem("span").setChild([
      new ModalLayout("game-launch-modal", {
        onClose: () => this.state.show = false,
        customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
      }).setShow(this.state.show).setSlot(
        "header",
        elem("h2").setProps({ class: "text-lg font-bold" }).addChild(text("Game Launcher"))
      ).setSlot(
        "body",
        elem("span").setChild([
          new LoadingLayout({
            label: "Please wait...",
            icon: "ti ti-loader"
          }).setShow(this.state.isLoading),
          new GameLauchBodyComponent({
            onSubmit: this.onSubmit.bind(this)
          })
        ])
      )
    ]);
  }
};

// src/components/content/home-page-content/PlayButtonComponent.ts
var PlayButtonComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "play-button-component";
  }
  data() {
    return {
      showGameLaunchModal: false
    };
  }
  onOpenModal() {
    GameLauncher.stopGameSearching();
    this.state.showGameLaunchModal = true;
  }
  template() {
    return elem("span").setChild([
      elem("button").setProps({
        class: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
      }).addEventListener("click", this.onOpenModal.bind(this)).addChild(text("Play")),
      new GameLauncherModal().setShow(this.state.showGameLaunchModal)
    ]);
  }
};

// src/components/content/home-page-content/DashboardComponent.ts
var DashboardComponent2 = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "home-dashboard-component";
  }
  template() {
    return elem("div").setProps({
      id: "home-dashboard-component",
      class: "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6"
    }).setChild([
      elem("h1").setProps({ class: "text-2xl font-bold mb-4" }).addChild(text(`Home`)),
      new InfoParagraphComponent("Welcome to the ft_transcendence!"),
      new InfoParagraphComponent("There will be some tools and players statistics soon."),
      isAuthorized() ? new PlayButtonComponent() : new InfoParagraphComponent("You have to sign in in to play.")
    ]);
  }
};

// src/pages/HomePage.ts
var HomePage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "home-page";
  }
  data() {
    return {
      title: "Welcome to Frontendy",
      description: "This is a simple example of a Frontendy component."
    };
  }
  template() {
    return elem("div").setProps({ id: "home-page" }).setChild([
      elem("div").setProps({ class: "flex flex-col items-center p-4 pt-8" }).addChild(new DashboardComponent2())
    ]);
  }
};

// src/pages/NotFoundPage.ts
var NotFoundPage = class extends component_default {
  static {
    this.componentName = "not-found-page";
  }
  goHome() {
    router_default.push("home");
  }
  template() {
    return elem("div").setProps({
      id: "not-found-page",
      class: "flex flex-col items-center justify-center h-full w-full p-8"
    }).setChild([
      elem("div").setProps({ class: "flex flex-col gap-4 p-4 rounded-lg max-w-lg w-full bg-white" }).setChild([
        elem("div").setProps({ class: "flex items-center justify-center mb-4" }).addChild(elem("img").setProps({ src: "/public/notfound_image.png", class: "w-72" })),
        elem("h1").setProps({ class: "text-2xl font-bold text-gray-800" }).addChild(text("404 Oups! Page not found...")),
        elem("p").setProps({ class: "text-gray-600" }).addChild(text("The page you are looking for does not exist.")),
        new ButtonComponent({
          label: "Home page",
          color: "blue"
        }).onClick(this.goHome.bind(this))
      ])
    ]);
  }
};

// src/layouts/tabs/TabItemComponent.ts
var TabItemComponent = class extends component_default {
  constructor(title, isActive) {
    super({ title, isActive });
    this.componentName = "tab-item";
  }
  data() {
    return {
      onClickHandler: null
    };
  }
  onClick(fn) {
    this.state.onClickHandler = fn;
    return this;
  }
  template() {
    const borderClass = this.props.isActive ? "border-b-2 border-blue-500" : "border-b-2 border-transparent";
    return elem("div").setProps({ class: `px-4 py-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${borderClass} transition duration-300 ease-in-out` }).addChild(text(this.props.title)).addEventListener("click", () => {
      if (this.state.onClickHandler) {
        this.state.onClickHandler();
      }
    });
  }
};

// src/layouts/tabs/TabsLayout.ts
var TabsLayout = class extends component_default {
  constructor(tabs) {
    super({ tabs });
    this.componentName = "tabs-layout";
  }
  data() {
    return {
      currentTab: 0
    };
  }
  changeCurrentTab(index) {
    if (this.state.currentTab == index) {
      return this;
    }
    this.state.currentTab = index;
    return this;
  }
  template() {
    const currentTabContent = this.props.tabs[this.state.currentTab].content;
    return elem("div").setChild([
      // Tabs
      elem("div").setProps({ class: "flex border-b-1 border-gray-200" }).setChild(this.props.tabs.map((tab, index) => {
        return new TabItemComponent(tab.title, this.state.currentTab == index).onClick(() => this.changeCurrentTab(index));
      })),
      // Tab content
      elem("div").setProps({ class: "p-4" }).addChild(currentTabContent)
    ]);
  }
};

// src/components/content/profile-page-content/GamesTableRowComponent.ts
var GamesTableRowComponent = class extends component_default {
  constructor(userId, gameStat) {
    super({ userId, gameStat });
    this.componentName = "games-table-row-component";
  }
  getGameTypeName() {
    return games_default.find((game) => game.id === this.props.gameStat.typeId)?.name || "Unknown";
  }
  getGameResult() {
    if (this.props.gameStat.winnerId == null) {
      return "Playing";
    }
    return this.props.gameStat.winnerId === this.props.userId ? "Win" : "Lose";
  }
  getGameResultStyle() {
    if (this.props.gameStat.winnerId == null) {
      return "blue";
    }
    return this.props.gameStat.winnerId === this.props.userId ? "green" : "red";
  }
  template() {
    return elem("tr").setProps({ class: "border-t-1 border-gray-200" }).setChild([
      elem("td").setProps({ class: "p-2 text-sm" }).addChild(text("#" + this.props.gameStat.uid)),
      elem("td").setProps({ class: `p-2 border-l-1 border-gray-200 text-sm` }).addChild(new TagComponent({ label: this.getGameResult(), color: this.getGameResultStyle() })),
      elem("td").setProps({ class: "p-2 border-l-1 border-gray-200 text-sm" }).addChild(text(this.props.gameStat.getDateTime())),
      elem("td").setProps({ class: "p-2 border-l-1 border-gray-200 text-sm" }).addChild(text(this.getGameTypeName()))
    ]);
  }
};

// src/components/content/profile-page-content/GamesTableComponent.ts
var GamesTableComponent = class extends component_default {
  constructor(userId, games2) {
    super({ games: games2, userId });
    this.componentName = "games-table-component";
  }
  template() {
    return elem("div").setProps({ class: "max-h-[320px] overflow-y-auto" }).addChild(
      elem("table").setProps({ class: "min-w-full table-auto" }).setChild([
        elem("thead").setProps({ class: "sticky top-0 z-10" }).setChild([
          elem("tr").setChild([
            elem("th").setProps({ class: "p-2 w-1/6 text-start" }).addChild(text("ID")),
            elem("th").setProps({ class: "p-2 w-1/6 text-start border-l-1 border-gray-200" }).addChild(text("Result")),
            elem("th").setProps({ class: "p-2 w-1/3 text-start border-l-1 border-gray-200" }).addChild(text("Date")),
            elem("th").setProps({ class: "p-2 w-1/3 text-start border-l-1 border-gray-200" }).addChild(text("Type"))
          ])
        ]),
        elem("tbody").setChild(this.props.games.map((game) => {
          return new GamesTableRowComponent(this.props.userId, game);
        }))
      ])
    );
  }
};

// src/components/content/profile-page-content/GamesContentComponent.ts
var GamesContentComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "games-content";
  }
  data() {
    return {
      games: void 0,
      userId: 0
    };
  }
  onCreated() {
    Store.setters.setupGameStats().then(() => {
      Store.getters.gameStats((stats) => {
        this.state.games = stats || [];
      });
    });
    Store.getters.userId((userId) => {
      if (userId === void 0) {
        return;
      }
      this.state.userId = userId;
    });
  }
  template() {
    let content;
    const isLoading = this.state.games === void 0;
    if (isLoading) {
      content = elem("div").setProps({ class: "flex flex-col items-center justify-center h-full w-full" }).setChild([
        elem("i").setProps({ class: "ti ti-loader loading text-blue-500" }),
        "Loading games..."
      ]);
    } else if (this.state.games.length === 0) {
      content = elem("div").setProps({ class: "flex flex-col items-center justify-center h-full w-full text-gray-400" }).setChild([
        elem("i").setProps({ class: "ti ti-brand-apple-arcade " }),
        "No games found"
      ]);
    } else {
      content = new GamesTableComponent(this.state.userId, this.state.games);
    }
    return elem("div").addChild(content);
  }
};

// src/components/inputs/BigAvatarComponent.ts
var BigAvatarComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "big-avatar-component";
  }
  data() {
    return {
      onClickHandler: null
    };
  }
  onClick(fn) {
    this.state.onClickHandler = fn;
    return this;
  }
  template() {
    const avatar = this.state.onClickHandler ? "big-avatar-container " : "";
    return elem("div").addEventListener("click", () => this.state.onClickHandler()).setProps({ class: avatar + "w-32 h-32 rounded-full border-1 border-gray-400 overflow-hidden relative" }).setChild([
      elem("span").setProps({ class: "image" }).addChild(elem("img").setProps({ class: "w-full object-cover", referrerpolicy: "no-referrer", src: this.props.imagePath })),
      elem("div").$vif(this.state.onClickHandler).setProps({ class: "text absolute text-sm text-white bottom-4 right-0 select-none left-0 text-center opacity-0 transition-all duration-200" }).addChild("Change photo")
    ]);
  }
};

// src/components/inputs/InputFileComponent.ts
var InputFileComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "input-file-component";
  }
  data() {
    return {
      selectedFile: null,
      onSelectFileHandler: void 0
    };
  }
  onSelect(callback) {
    this.state.onSelectFileHandler = callback;
    return this;
  }
  handleDrop(event) {
    event = event;
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.handleFiles(files);
  }
  handleFiles(files) {
    this.state.selectedFile = files[0];
  }
  template() {
    const selectedImageUrl = this.state.selectedFile ? URL.createObjectURL(this.state.selectedFile) : null;
    return elem("span").setChild([
      // Input file container
      elem("div").addEventListener("click", () => document.getElementById("fileInput")?.click()).addEventListener("dragover", (event) => event.preventDefault()).addEventListener("drop", (event) => this.handleDrop(event)).setProps({
        style: `display: ${selectedImageUrl ? "none" : "flex"};`,
        class: "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-100 transition p-4"
      }).setChild([
        elem("i").setProps({ class: "ti ti-photo-scan text-6xl text-gray-400" }),
        elem("p").setProps({ class: "text-gray-600 text-center text-sm" }).addChild("Drag and drop file here, or click to select"),
        elem("p").setProps({ class: "text-gray-400 text-xs" }).addChild("Max size: 2MB"),
        elem("input").addEventListener("change", (event) => this.handleFiles(event.target.files)).setProps({
          type: "file",
          id: "fileInput",
          class: "hidden"
        })
      ]),
      // Preload image container
      elem("div").setProps({
        class: "flex flex-col items-center justify-center w-full h-full",
        id: "preload",
        style: `display: ${selectedImageUrl ? "flex" : "none"};`
      }).setChild([
        // Preload image
        elem("span").addChild(new BigAvatarComponent({
          imagePath: selectedImageUrl
        })),
        // Buttons 
        elem("div").setProps({ class: "flex gap-4 mt-4" }).setChild([
          new ButtonComponent({
            label: "Cancel",
            color: "red",
            type: "outline"
          }).onClick(() => {
            this.state.selectedFile = null;
            const input = document.getElementById("fileInput");
            if (input) {
              input.value = "";
            }
          }),
          new ButtonComponent({
            label: "Upload",
            color: "blue"
          }).onClick(() => {
            if (this.state.onSelectFileHandler) {
              this.state.onSelectFileHandler(this.state.selectedFile);
            }
          })
        ])
      ])
    ]);
  }
};

// src/components/modals/AvatarChangeModal.ts
var AvatarChangeModal = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "avatar-change-modal";
  }
  data() {
    return {
      show: false,
      onSubmitHandler: void 0
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  onSubmit(fn) {
    this.state.onSubmitHandler = fn;
    return this;
  }
  onSubmitWrapper(file) {
    if (!this.state.onSubmitHandler) {
      return;
    }
    this.state.onSubmitHandler(file);
    this.setShow(false);
  }
  template() {
    const header = elem("h2").addChild(text("Upload new Avatar")).setProps({ class: "text-xl font-bold text-center" });
    const body = elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      new InputFileComponent().onSelect(async (file) => this.onSubmitWrapper(file))
    ]);
    return elem("span").addChild(
      new ModalLayout("avatar-change-modal", {
        onClose: () => this.state.show = false,
        customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
      }).setShow(this.state.show).setSlot("header", header).setSlot("body", body)
    );
  }
};

// src/components/content/profile-page-content/ProfileAvatarComponent.ts
var ProfileAvatarComponent = class extends component_default {
  constructor(imagePath) {
    super({ imagePath });
    this.componentName = "big-avatar-component";
  }
  data() {
    return {
      isAvatarChangeModalOpen: false,
      onUpdateHandler: void 0
    };
  }
  onUpdate(fn) {
    this.state.onUpdateHandler = fn;
    return this;
  }
  template() {
    return elem("span").setChild([
      new BigAvatarComponent({ imagePath: this.props.imagePath }).onClick(() => this.state.isAvatarChangeModalOpen = true),
      new AvatarChangeModal().setShow(this.state.isAvatarChangeModalOpen).onSubmit(async (file) => {
        if (!this.state.onUpdateHandler) {
          return;
        }
        this.state.onUpdateHandler(file);
      })
    ]);
  }
};

// src/components/content/profile-page-content/InfoContentComponent.ts
var InfoContentComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "info-content";
  }
  data() {
    return {
      isDeleteAccountModalOpen: false,
      user: void 0
    };
  }
  onCreated() {
    Store.getters.user((user) => {
      if (!user) {
        return;
      }
      this.state.user = user;
    });
  }
  async signoutHandler() {
    await API.ums.signOut();
    router_default.push("home");
    Store.setters.deleteUser();
    EventBroker.getInstance().emit("update-auth");
  }
  async updateImageHandler(file) {
    const response = await API.ums.userUpdateAvatar(file);
    if (response.status != 200) {
      console.log("Error while updating avatar", response);
      return;
    }
    const user = this.state.user;
    this.state.user = void 0;
    user.avatarUrl = response.data.avatar;
    this.state.user = user;
  }
  template() {
    let imagePath;
    if (!this.state.user) {
      imagePath = null;
    } else if (this.state.user.avatarUrl && this.state.user.avatarUrl.startsWith("http")) {
      imagePath = this.state.user.avatarUrl;
    } else if (this.state.user.avatarUrl) {
      imagePath = `http://localhost:5000/auth/public/${this.state.user.avatarUrl}`;
    } else {
      imagePath = "http://localhost:5000/auth/public/avatars/default.png";
    }
    return elem("div").setProps({ class: "grid grid-cols-[8rem_1fr] gap-4 w-full" }).setChild([
      // Image container
      elem("span").setChild([
        new ProfileAvatarComponent(imagePath).onUpdate(async (file) => this.updateImageHandler(file))
      ]),
      // Information container
      elem("div").setProps({ class: "h-32" }).setChild([
        elem("div").setProps({ class: "flex flex-col gap-2 justify-between h-full " }).setChild([
          elem("div").setProps({ class: "flex gap-2 flex-col" }).setChild([
            elem("h2").setProps({ class: "text-xl font-bold" }).addChild(text(this.state.user?.nickname)),
            elem("p").setProps({ class: "text-gray-600 text-sm" }).addChild(text("Played games: 0")),
            elem("p").setProps({ class: "text-gray-600 text-sm" }).addChild(text(`Rating: ${this.state.user?.rating}`))
          ]),
          elem("div").setProps({ class: "flex gap-2" }).setChild([
            new ButtonComponent({ icon: "ti ti-settings", color: "blue", type: "outline" }).onClick(() => router_default.push("profile-settings")),
            new ButtonComponent({ icon: "ti ti-logout", color: "red", type: "outline" }).onClick(() => this.signoutHandler())
          ])
        ])
      ])
    ]);
  }
};

// src/components/content/profile-page-content/ProfilePageContent.ts
var ProfilePageContent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "profile-page-content";
  }
  data() {
    return {};
  }
  template() {
    return elem("div").setChild([
      new TabsLayout([
        { title: "Info", content: new InfoContentComponent() },
        { title: "Games", content: new GamesContentComponent() }
      ])
    ]);
  }
};

// src/pages/ProfilePage.ts
var ProfilePage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "profile-page";
  }
  template() {
    const dashboard = new DashboardComponent("Profile").setSlot("content", new ProfilePageContent());
    return elem("div").setProps({ id: "profile-page" }).setChild([
      elem("div").setProps({ class: "flex flex-col items-center p-4 pt-8" }).addChild(dashboard)
    ]);
  }
};

// src/components/inputs/InputLabelComponent.ts
var InputLabelComponent = class extends component_default {
  constructor(label) {
    super({ label });
    this.componentName = "input-label-component";
  }
  template() {
    return elem("div").setProps({ class: "text-gray-700 text-sm" }).addChild(text(this.props.label));
  }
};

// src/components/inputs/InputComponent.ts
var InputComponent = class extends component_default {
  constructor(value, opts = {}) {
    super({ value, opts });
    this.componentName = "input-component";
  }
  data() {
    return {
      inputHandler: null,
      enterHandler: null,
      blurHandler: null,
      focusHandler: null
    };
  }
  onInput(fn) {
    this.state.inputHandler = fn;
    return this;
  }
  onBlur(fn) {
    this.state.blurHandler = fn;
    return this;
  }
  onFocus(fn) {
    this.state.focusHandler = fn;
    return this;
  }
  onEnter(fn) {
    this.state.enterHandler = fn;
    return this;
  }
  focus() {
    if (!this.el || this.el instanceof Text) {
      return;
    }
    this.el.focus();
    if (this.el.tagName === "input") {
      this.el.focus();
    } else {
      this.el.querySelector("input")?.focus();
    }
  }
  template() {
    const elemBorder = "border-2 border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ease-in-out duration-200";
    const elemSize = "w-full h-8";
    const input = elem("input").setProps({
      class: `p-2 bg-transparent ${elemSize} ${elemBorder}`,
      value: this.props.value,
      type: this.props.opts.type ?? "text",
      length: this.props.opts.length,
      placeholder: this.props.opts.placeholder ?? ""
    });
    if (this.state.inputHandler) {
      input.addEventListener("input", (event) => {
        const target = event.target;
        this.state.inputHandler(target.value);
      });
    }
    if (this.state.blurHandler) {
      input.addEventListener("blur", (event) => {
        const target = event.target;
        this.state.blurHandler(target.value);
      });
    }
    if (this.state.focusHandler) {
      input.addEventListener("focus", (event) => {
        const target = event.target;
        this.state.focusHandler(target.value);
      });
    }
    if (this.state.enterHandler) {
      input.addEventListener("keydown", (event) => {
        const target = event.target;
        if (event.key === "Enter") {
          this.state.enterHandler(target.value);
        }
      });
    }
    if (this.props.opts.label) {
      return elem("div").setChild([
        new InputLabelComponent(this.props.opts.label),
        input
      ]);
    }
    return input;
  }
};

// src/components/inputs/MessageComponent.ts
var MessageComponent = class extends component_default {
  constructor(message, opts = {}) {
    super({ message, opts });
    this.componentName = "message-component";
  }
  template() {
    const color = this.props.opts.color || "gray";
    return elem("p").setProps({
      class: `${this.props.message ? "block" : "hidden"} text-${color}-700 text-sm`
    }).addChild(this.props.message);
  }
};

// src/components/forms/NicknameUpdateForm.ts
var NicknameUpdateForm = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "nickname-update-form";
  }
  data() {
    return {
      form: { nickname: void 0 },
      successMessage: void 0,
      errorMessage: void 0
    };
  }
  onCreated() {
    Store.getters.userNickname().then((nickname) => {
      this.state.form = { nickname };
    });
  }
  async onSubmit() {
    if (!this.state.form.nickname) {
      this.state.errorMessage = "Nickname cannot be empty.";
      this.state.successMessage = void 0;
      return;
    }
    try {
      const response = await API.ums.userUpdateNickname(this.state.form.nickname);
      if (response.status == 200) {
        this.state.successMessage = "Nickname updated successfully.";
        this.state.errorMessage = void 0;
        Store.setters.updateUserNickname(this.state.form.nickname);
      }
    } catch (error) {
      this.state.successMessage = void 0;
      if (error instanceof AxiosError2) {
        if (error.response?.status == 409) {
          this.state.errorMessage = "Nickname is already taken.";
        } else if (error.response?.status == 500) {
          this.state.errorMessage = "Failed to update user nickname.";
        }
      }
    }
  }
  template() {
    return elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      new MessageComponent(this.state.successMessage, { color: "green" }),
      new MessageComponent(this.state.errorMessage, { color: "red" }),
      new InputComponent(this.state.form.nickname, {
        label: "Nickname"
      }).onInput((value) => this.state.form.nickname = value),
      new ButtonComponent({
        label: "Update",
        color: "blue"
      }).onClick(() => this.onSubmit())
    ]);
  }
};

// src/types/forms/updatePasswordForm.ts
var PasswordUpdateForm = class {
  constructor(oldPassword, newPassword) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
  validate() {
    if (this.newPassword.length < 8) {
      return "New password must be at least 8 characters long.";
    }
    if (this.oldPassword === this.newPassword) {
      return "New password must be different from the old password.";
    }
  }
  toSubmit() {
    return {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };
  }
};

// src/components/forms/PasswordUpdateForm.ts
var PasswordUpdateForm2 = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "update-password-form-component";
  }
  data() {
    return {
      form: new PasswordUpdateForm("", ""),
      successMessage: void 0,
      errorMessage: void 0
    };
  }
  async onSubmit() {
    const error = this.state.form.validate();
    if (error) {
      this.state.errorMessage = error;
      return;
    }
    try {
      const response = await API.ums.userUpdatePassword(this.state.form);
      if (response.status == 205 || response.status == 201) {
        this.state.successMessage = "Password updated successfully.";
        this.state.errorMessage = void 0;
        this.state.form = new PasswordUpdateForm("", "");
      }
    } catch (error2) {
      console.error("Error updating password:", error2);
      this.state.successMessage = void 0;
      if (error2 instanceof AxiosError2) {
        if (error2.response && error2.response.status === 400) {
          this.state.errorMessage = "Invalid entered data.";
        } else if (error2.response && error2.response.status === 403) {
          this.state.errorMessage = "Invalid current password.";
        } else {
          this.state.errorMessage = "An unexpected error occurred. Please try again later.";
        }
      } else {
        this.state.errorMessage = "Failed to update password. Please try again.";
      }
      return;
    }
  }
  template() {
    const newPasswordInput = new InputComponent(this.state.form.newPassword, {
      label: "New Password",
      type: "password"
    }).onInput((value) => this.state.form.newPassword = value);
    const oldPasswordInput = new InputComponent(this.state.form.oldPassword, {
      label: "Current Password",
      type: "password"
    }).onInput((value) => this.state.form.oldPassword = value).onEnter(() => newPasswordInput.focus());
    return elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      new MessageComponent(this.state.successMessage, { color: "green" }),
      new MessageComponent(this.state.errorMessage, { color: "red" }),
      oldPasswordInput,
      newPasswordInput,
      new ButtonComponent({
        label: "Update",
        color: "blue"
      }).onClick(() => this.onSubmit())
    ]);
  }
};

// src/components/inputs/AccordionComponent.ts
var AccordionComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "accodion-component";
  }
  data() {
    return {
      opened: void 0
    };
  }
  contentGenerator(item) {
    if (typeof item.content === "string") {
      return elem("div").setProps({ class: "accordion-content" }).addChild(item.content);
    }
    return new item.content();
  }
  changeOpened(index) {
    this.state.opened = this.state.opened === index ? void 0 : index;
  }
  template() {
    const itemsComponents = this.props.items.map((item, index) => {
      const isOpen = this.state.opened === index;
      const content = this.contentGenerator(item);
      return elem("div").setProps({ class: "accordion-item" }).setChild([
        elem("div").setProps({ class: `accordion-item-header ${isOpen ? "opened" : "closed"} text-grey-800 text-lg ${isOpen ? "text-blue-500" : "text-black"} font-semibold cursor-pointer flex justify-between items-center` }).addEventListener("click", () => this.changeOpened(index)).setChild([
          elem("p").setProps({ class: "select-none transition duration-200 ease-in-out" }).addChild(item.title),
          elem("div").setProps({ class: "flex items-center justify-center h-6 w-6" }).addChild(elem("i").setProps({ class: `ti ti-chevron-right transition duration-200 ease-in-out` }))
        ]),
        elem("div").setProps({ class: `${isOpen ? "max-h-full p-4 opacity-100" : "max-h-0 opacity-0"} transition-all duration-200 ease-in-out  overflow-hidden` }).addChild(content)
      ]);
    });
    return elem("div").setProps({ class: "accordion-component flex flex-col gap-2" }).setChild([
      ...itemsComponents
    ]);
  }
};

// src/components/modals/DeleteAccountModal.ts
var DeleteAccountModal = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "delete-account-modal";
  }
  data() {
    return {
      show: false,
      errorMessage: "",
      originalNickname: void 0,
      enteredNickname: ""
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  onCreated() {
    Store.getters.userNickname().then((nickname) => {
      this.state.originalNickname = nickname;
    });
  }
  async onSubmit() {
    try {
      await API.ums.userDelete();
    } catch (error) {
      console.error("Error during account deletion:", error);
      return;
    }
    await API.ums.signOut();
    this.setShow(false);
    router_default.push("home");
    Store.setters.deleteUser();
    EventBroker.getInstance().emit("update-auth");
  }
  template() {
    return elem("span").addChild(
      new ModalLayout("delete-account-modal", {
        onClose: () => this.state.show = false,
        customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
      }).setShow(this.state.show).setSlot(
        "header",
        elem("h2").addChild(text("Delete your Account")).setProps({ class: "text-xl font-bold text-center" })
      ).setSlot(
        "body",
        elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
          new InfoParagraphComponent("This action cannot be undone."),
          new InfoParagraphComponent(`To delete your account, please enter "${this.state.originalNickname}" in the field below:`),
          new InputComponent(this.state.enteredNickname, { placeholder: "Enter your nickname" }).onBlur((value) => {
            this.state.enteredNickname = value;
          }).onEnter((value) => {
            this.state.enteredNickname = value;
          }),
          new ButtonComponent({
            label: "Delete",
            icon: "ti ti-trash",
            color: "red",
            isDisabled: this.state.enteredNickname != this.state.originalNickname
          }).onClick(() => {
            this.onSubmit();
          })
        ])
      )
    );
  }
};

// src/components/content/profile-settings-page-content/DeleteAccountContent.ts
var DeleteAccountComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "delete-account-component";
  }
  data() {
    return {};
  }
  template() {
    return elem("span").setChild([
      new ButtonComponent({
        label: "Delete account",
        icon: "ti ti-trash",
        color: "red",
        type: "outline"
      }).onClick(() => this.state.isDeleteAccountModalOpen = true),
      new DeleteAccountModal().setShow(this.state.isDeleteAccountModalOpen)
    ]);
  }
};

// src/components/content/profile-settings-page-content/ProfileSettingsPageContent.ts
var ProfileSettingsPageContent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "profile-settings-page-content";
  }
  data() {
    return {
      isDeleteAccountModalOpen: false
    };
  }
  template() {
    return elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      new AccordionComponent({
        items: [
          { title: "Change Nickname", content: NicknameUpdateForm },
          { title: "Change Password", content: PasswordUpdateForm2 },
          { title: "Danger Zone", content: DeleteAccountComponent }
        ]
      })
    ]);
  }
};

// src/pages/ProfileSettingsPage.ts
var ProfileSettingsPage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "profile-settings-page";
  }
  template() {
    const dashboard = new DashboardComponent().setSlot("content", new ProfileSettingsPageContent()).setSlot("header", elem("div").setProps({ class: "flex gap-4 items-center mb-4" }).setChild([
      new ButtonComponent({ color: "gray", icon: "ti ti-arrow-left", type: "blank", size: "small" }).onClick(() => router_default.push("profile")),
      elem("h1").setProps({ class: "text-2xl font-bold" }).addChild(text("Profile settings"))
    ]));
    return elem("div").setProps({ id: "profile-settings-page" }).setChild([
      elem("div").setProps({ class: "flex flex-col items-center p-4 pt-8" }).addChild(dashboard)
    ]);
  }
};

// src/pages/router.ts
var routes = [
  { name: "home", path: "/", component: HomePage },
  { name: "about", path: "/about", component: AboutPage },
  { name: "profile", path: "/profile", component: ProfilePage },
  { name: "profile-settings", path: "/profile/settings", component: ProfileSettingsPage },
  { name: "game", path: "/launch/game", component: GamePage },
  { name: "oauth-callback", path: "/oauth-callback", component: OAuthCallbackPage }
];
var withoutLogin = ["home", "about", "oauth-callback", "game"];
var routerConfig = {
  notFoundPage: NotFoundPage,
  routeIsAvailable: (route) => {
    if (!withoutLogin.includes(route.name) && !isAuthorized()) {
      return "user is unauthorized";
    }
  }
};
var router = new FrontendyRouter(routes, routerConfig);
var router_default = router;

// src/pkg/frontendy/router/RouterView.ts
var lastRenderedRouteComponent = void 0;
var FrontendyRouterView = class extends component_default {
  constructor(router2) {
    super({ router: router2 });
    this.componentName = "router-view";
    router2.setRouterView(this);
  }
  data() {
    return {
      currentRoute: this.calcCurrentRoute()
    };
  }
  calcCurrentRoute() {
    const currentUrl = window.location.pathname;
    return this.props.router.findRoute(currentUrl);
  }
  updateCurrentRoute() {
    const newRoute = this.calcCurrentRoute();
    if (this.state.currentRoute !== newRoute) {
      this.state.currentRoute = newRoute;
    }
  }
  template() {
    const renderComponentType = this.state.currentRoute !== void 0 ? this.state.currentRoute.component : this.props.router.getUndefinedMessageComponent();
    if (renderComponentType === void 0) {
      throw new Error("RouterView error : No component found for the current route.");
    }
    lastRenderedRouteComponent = new renderComponentType();
    return elem("div").setProps({ id: "router-view" }).setChild([
      lastRenderedRouteComponent
    ]);
  }
};

// src/types/NavBarLink.ts
var NavBarLink = class {
  constructor(label, routeName, icon) {
    this.label = label;
    this.routeName = routeName;
    this.icon = icon;
  }
};

// src/components/search-game-bar/CancelButtonComponent.ts
var CancelButtonComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "cancel-button-component";
  }
  template() {
    return elem("div").setProps({ class: "w-6 h-6 flex justify-center items-center transition duration-300 hover:bg-red-200 active:bg-red-300 rounded-full cursor-pointer" }).setChild([
      elem("i").setProps({ class: "ti ti-x text-red-500 text-md" })
    ]).addEventListener("click", this.props.onClick);
  }
};

// src/pkg/timer.ts
var Timer = class {
  constructor() {
    this.interval = void 0;
    this.counter = 0;
    this.isCounting = false;
  }
  start(omChange) {
    if (this.isCounting) {
      return;
    }
    this.isCounting = true;
    this.counter = 0;
    this.interval = setInterval(() => {
      this.counter++;
      omChange(this.counter);
    }, 1e3);
  }
  stop() {
    if (!this.isCounting) {
      return;
    }
    this.isCounting = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = void 0;
    }
  }
  reset() {
    this.counter = 0;
  }
};
var TimerStorage = class {
  static {
    this.timers = /* @__PURE__ */ new Map();
  }
  static addTimer(name, onChange) {
    if (this.timers.has(name)) {
      throw new Error(`Timer with name ${name} already exists`);
    }
    const timer = new Timer();
    this.timers.set(name, timer);
    timer.start(onChange);
    return timer;
  }
  static removeTimer(name) {
    const timer = this.timers.get(name);
    if (timer) {
      timer.stop();
      this.timers.delete(name);
    }
  }
  static closeAll() {
    this.timers.forEach((timer) => {
      timer.stop();
    });
    this.timers.clear();
  }
};
var timer_default = TimerStorage;

// src/components/search-game-bar/ElapsedTimeComponent.ts
var ElapsedTimeComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "elapsed-time-component";
  }
  data() {
    return {
      elapsedTime: "0:00"
    };
  }
  setCounting(isCounting) {
    if (this.state.isCounting == isCounting) {
      return this;
    }
    if (isCounting) {
      timer_default.addTimer("game-search-bar", (counter2) => {
        const minutes = Math.floor(counter2 / 60);
        const seconds = counter2 % 60;
        this.state.elapsedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      });
    }
    return this;
  }
  template() {
    return elem("p").setChild([
      text(this.state.elapsedTime)
    ]);
  }
};

// src/components/search-game-bar/SearchGameBarComponent.ts
var SearchGameBarComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "find-game-bar-component";
  }
  data() {
    return {
      show: false,
      searchGame: null
    };
  }
  setSearchGame(game) {
    if (this.state.searchGame == game) {
      return this;
    }
    this.state.searchGame = game;
    this.state.show = !!this.state.searchGame;
    return this;
  }
  onCancel() {
    GameLauncher.stopGameSearching();
  }
  template() {
    const position = `fixed left-0 bottom-0 w-full h-20 bg-gray-200 flex items-center justify-center`;
    const toast = "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white py-2 px-4";
    return elem("div").$vif(this.state.show).setProps({ class: `${position} z-5` }).setChild([
      elem("div").setProps({ class: `${toast} flex gap-4 justify-between` }).setChild([
        elem("div").setProps({ class: "flex gap-4 items-center" }).setChild([
          new ElapsedTimeComponent().setCounting(this.state.show),
          elem("p").setProps({ class: "text-gray-700" }).addChild(text(this.state.searchGame?.name)),
          elem("p").setProps({ class: "text-gray-700" }).addChild(text("Searching for a game..."))
        ]),
        new CancelButtonComponent({
          onClick: this.onCancel.bind(this)
        })
      ])
    ]);
  }
};

// src/types/forms/registrationForm.ts
var SignUpForm = class {
  constructor(nickname, email, password) {
    this.nickname = nickname;
    this.email = email;
    this.password = password;
  }
  validate() {
    if (!this.nickname || this.nickname.length < 3) {
      return "Nickname must be at least 3 characters long";
    }
    if (!this.email || !this.email.includes("@")) {
      return "Please enter a valid email address";
    }
    if (!this.password || this.password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return void 0;
  }
  toSubmit() {
    return {
      nickname: this.nickname,
      email: this.email,
      password: this.password
    };
  }
};

// src/types/forms/signInForm.ts
var SignInForm = class {
  constructor(nickname, password) {
    this.nickname = nickname;
    this.password = password;
  }
  validate() {
    if (!this.nickname.length) {
      return "Invalid email address.";
    }
    if (!this.password.length) {
      return "Password is required.";
    }
    if (this.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
  }
  toSubmit() {
    return {
      nickname: this.nickname,
      password: this.password
    };
  }
};

// src/components/forms/AuthForm.ts
var AuthForm = class extends component_default {
  constructor(form, onSubmit) {
    super({ form, onSubmit });
    this.componentName = "auth-form";
  }
  data() {
    return {
      form: this.props.form
    };
  }
  submit() {
    this.props.onSubmit(this.state.form);
  }
  template() {
    const submitButton = new ButtonComponent({ label: "Submit", color: "blue", fullWidth: true }).onClick(this.submit.bind(this));
    const passwordInput = new InputComponent(this.state.form.password, {
      type: "password",
      label: "Password"
    }).onInput((value) => this.state.form.password = value).onEnter(this.submit.bind(this));
    const nicknameInput = new InputComponent(this.state.form.nickname, {
      type: "nickname",
      label: "Nickname"
    }).onInput((value) => this.state.form.nickname = value).onEnter(() => passwordInput.focus());
    return elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      nicknameInput,
      passwordInput,
      elem("div").setProps({ class: "mt-2 flex" }).addChild(submitButton)
    ]);
  }
};

// src/components/forms/RegistrationForm.ts
var RegistrationForm = class extends component_default {
  constructor(form, onSubmit) {
    super({ form, onSubmit });
    this.componentName = "registration-form";
  }
  data() {
    return {
      form: this.props.form
    };
  }
  submit() {
    this.props.onSubmit(this.state.form);
  }
  onChangeNickname(value) {
    this.state.form.nickname = value;
  }
  onChangeEmail(value) {
    this.state.form.email = value;
  }
  onChangePassword(value) {
    this.state.form.password = value;
  }
  template() {
    const submitButton = new ButtonComponent({ label: "Submit", color: "blue", fullWidth: true }).onClick(this.submit.bind(this));
    const passwordInput = new InputComponent(this.state.form.password, {
      type: "password",
      label: "Password"
    }).onInput((value) => this.state.form.password = value).onEnter(this.submit.bind(this));
    const emailInput = new InputComponent(this.state.form.email, {
      type: "email",
      label: "Email"
    }).onInput((value) => this.state.form.email = value).onEnter(() => passwordInput.focus());
    const nicknameInput = new InputComponent(this.state.form.nickname, {
      type: "text",
      label: "Nickname"
    }).onInput((value) => this.state.form.nickname = value).onEnter(() => emailInput.focus());
    return elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      nicknameInput,
      emailInput,
      passwordInput,
      elem("div").setProps({ class: "mt-2 flex" }).addChild(submitButton)
    ]);
  }
};

// src/components/forms/OtpForm.ts
var OtpForm = class extends component_default {
  constructor(onSubmit) {
    super({ onSubmit });
    this.componentName = "otp-form";
  }
  data() {
    return {
      code: ["", "", "", "", "", ""]
    };
  }
  template() {
    const inputs = this.state.code.map((value, index) => {
      return new InputComponent(value, { length: 1 }).onInput((newValue) => {
        if (newValue.length > 0 && index != 5) {
          inputs[index + 1].focus();
        } else if (newValue.length == 0 && index != 0) {
          inputs[index - 1].focus();
        }
        this.state.code[index] = newValue;
        if (this.state.code.join("").length == 6) {
          this.props.onSubmit(this.state.code.join(""));
        }
      });
    });
    return elem("div").setChild([
      new InfoParagraphComponent("Enter the verification code sent to your email."),
      elem("div").setProps({ class: "flex gap-4 p-4" }).setChild([
        ...inputs
      ])
    ]);
  }
};

// src/components/modals/AuthModal.ts
var AuthModal = class extends component_default {
  constructor() {
    super();
  }
  data() {
    return {
      show: false,
      isLogin: true,
      isOtpCode: false,
      errorMessage: "",
      otpKey: void 0,
      signInForm: new SignInForm("", ""),
      signUpForm: new SignUpForm("", "", "")
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  async onSubmitForm(form) {
    const error = form.validate();
    if (error) {
      this.state.errorMessage = error;
      return;
    }
    this.state.errorMessage = "";
    try {
      let response = null;
      if (this.state.isLogin && form instanceof SignInForm) {
        response = await API.ums.signIn(form);
      } else if (!this.state.isLogin && form instanceof SignUpForm) {
        response = await API.ums.signUp(form);
      } else {
        throw new Error("invalid form type");
      }
      if (response === null) {
        throw new Error("no received response from server");
      }
      const data = response.data;
      this.state.otpKey = data.key;
    } catch (error2) {
      if (error2 instanceof AxiosError2) {
        this.state.errorMessage = this.serverResponseMessage(error2.status);
      } else {
        console.error("AuthModal error :", error2);
      }
      return;
    }
    this.state.isOtpCode = true;
  }
  async onSubmitOtp(code) {
    try {
      await API.ums.veryfyOtpCode(code, this.state.otpKey);
      Store.setters.setupUser();
      EventBroker.getInstance().emit("update-auth");
      this.setShow(false);
    } catch (error) {
      if (error instanceof AxiosError2) {
        this.state.errorMessage = this.serverResponseMessage(error.status);
      } else {
        console.error("AuthModal error :", error);
      }
      return;
    }
  }
  async signInWithGoogle() {
    GoogleOAuth.redirectToGoogle(Config.googleOauthClientId, Config.googleOauthRedirectUri);
  }
  serverResponseMessage(status) {
    switch (status) {
      case 400:
        return "Validation error. Please check your input.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 409:
        return "User with this login or email already exists.";
      case 500:
        return "Internal server error. Please try again later.";
      default:
        return "Unknown error";
    }
  }
  toggleForm() {
    this.state.isLogin = !this.state.isLogin;
    this.state.errorMessage = "";
  }
  getAppropriateForm() {
    if (this.state.isOtpCode) {
      return new OtpForm(this.onSubmitOtp.bind(this));
    }
    return this.state.isLogin ? new AuthForm(this.state.signInForm, this.onSubmitForm.bind(this)) : new RegistrationForm(this.state.signUpForm, this.onSubmitForm.bind(this));
  }
  getAppropriateTitle() {
    if (this.state.isOtpCode) {
      return "Verification code";
    }
    return this.state.isLogin ? "Sign in" : "Sign up";
  }
  template() {
    const form = this.getAppropriateForm();
    const title = this.getAppropriateTitle();
    const toggleText = this.state.isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in";
    return elem("span").addChild(
      new ModalLayout("auth-modal", {
        onClose: () => this.state.show = false,
        customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
      }).setShow(this.state.show).setSlot(
        "header",
        elem("h2").addChild(title).setProps({ class: "text-xl font-bold text-center" })
      ).setSlot(
        "body",
        elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
          elem("div").$vif(this.state.errorMessage).setProps({ class: "text-red-500 text-sm text-center" }).addChild(this.state.errorMessage),
          form,
          elem("div").$vif(!this.state.isOtpCode).setProps({ class: "flex flex-col gap-2 justify-center" }).setChild([
            new ButtonComponent({
              label: "Proceed with Google",
              color: "blue",
              icon: "ti ti-brand-google",
              type: "outline"
              // isDisabled: true,
            }).onClick(() => this.signInWithGoogle()),
            elem("button").setProps({
              class: "text-blue-500 hover:text-blue-700 underline text-sm"
            }).addChild(toggleText).addEventListener("click", this.toggleForm.bind(this))
          ])
        ])
      )
    );
  }
};

// src/components/nav-bar/NavBarItemComponent.ts
var NavBarItemComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "nav-bar-item-component";
  }
  getStyles() {
    const styles = {
      animation: "hover:bg-gray-100 active:bg-gray200 duration-200 ease-in-out",
      container: "flex items-center px-4 py-2",
      text: "cursor-pointer text-sm"
    };
    return `nav-link ${styles.container} ${styles.text} ${styles.animation}`;
  }
  template() {
    return elem("div").setProps({ class: this.getStyles() }).setChild([
      elem("i").setProps({ class: this.props.icon }),
      elem("span").setProps({ class: "ml-2" }).addChild(text(this.props.label))
    ]).addEventListener("click", this.props.onClick);
  }
};

// src/components/nav-bar/NavBarComponent.ts
var NavBarComponent = class extends component_default {
  constructor(links, isAuthorized2 = false) {
    super({ links, isAuthorized: isAuthorized2 });
    this.componentName = "nav-bar-component";
  }
  data() {
    return {
      showAuthModal: false,
      nickname: void 0
    };
  }
  onCreated() {
    Store.getters.userNickname((nickname) => {
      this.state.nickname = nickname;
    });
  }
  navigate(routeName) {
    router_default.push(routeName);
  }
  template() {
    return elem("div").setProps({ class: "flex flex-col items-center p-4" }).setChild([
      elem("div").setProps({
        id: "nav-bar",
        class: "max-w-2xl w-full rounded-lg navbar flex flex-row bg-white pr-4 shadow-md"
      }).setChild([
        elem("h1").addChild(text("ft_transcendence")).setProps({ class: "text-l font-bold px-4 py-2" }),
        elem("div").setProps({ class: "flex flex-row justify-between w-full" }).setChild([
          // Main navbar links
          elem("div").setProps({ class: "flex flex-row" }).setChild(this.props.links.map((link) => {
            return new NavBarItemComponent({
              icon: link.icon,
              label: link.label,
              onClick: () => this.navigate(link.routeName)
            });
          })),
          // Sign in button
          this.props.isAuthorized ? new NavBarItemComponent({
            icon: "ti ti-user",
            label: this.state.nickname,
            onClick: () => this.navigate("profile")
          }) : new NavBarItemComponent({
            icon: "ti ti-login-2",
            label: "Sign in",
            onClick: () => {
              this.state.showAuthModal = true;
            }
          })
        ]),
        // Sign in / up modal window
        new AuthModal().setShow(this.state.showAuthModal)
      ])
    ]);
  }
};

// src/components/content/game-confirmation-modal-content/GameConfirmationComponent.ts
var GameConfirmationComponent = class extends component_default {
  constructor(remainingTime, onSubmit) {
    super({ onSubmit, remainingTime });
    this.componentName = "confirm-view-component";
  }
  template() {
    return elem("div").setProps({ class: "w-full h-full" }).setChild([
      elem("p").setProps({ class: "text-sm text-gray-600 mb-2 text-start" }).addChild(text(`Confirmation time : ${this.props.remainingTime}`)),
      new ButtonComponent({
        label: "Accept",
        color: "blue",
        fullWidth: true
      }).onClick(this.props.onSubmit.bind(this))
    ]);
  }
};

// src/components/content/game-confirmation-modal-content/WaitPlayerBoxComponent.ts
var PlayerBoxComponent = class extends component_default {
  constructor(status) {
    super({ status });
    this.componentName = "player-box-component";
  }
  getBackgroundColor(status) {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "waiting":
        return "bg-gray-300";
      case "missing":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  }
  getBorderColor(status) {
    switch (status) {
      case "confirmed":
        return "border-green-500";
      case "waiting":
        return "border-gray-300";
      case "missing":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  }
  template() {
    const status = this.props.status;
    const borderColor = this.getBorderColor(status);
    const bgColor = this.getBackgroundColor(status);
    return elem("div").setProps({ class: `w-8 h-8 border-2 ${borderColor} ${bgColor} rounded-md flex justify-center items-center` });
  }
};

// src/components/content/game-confirmation-modal-content/GameWaitComponent.ts
var GameWaitComponent = class extends component_default {
  constructor(remainingTime) {
    super({ remainingTime });
    this.componentName = "game-wait-component";
  }
  template() {
    const statuses = GameLauncher.getConfirmationStatus() || [];
    return elem("span").setChild([
      elem("p").setProps({ class: "text-sm text-gray-600 mb-2 text-start" }).addChild(text(`Remaining time : ${this.props.remainingTime}`)),
      elem("div").setProps({ class: "w-full flex gap-2 justify-center" }).setChild([
        ...statuses.map((status) => new PlayerBoxComponent(status))
      ])
    ]);
  }
};

// src/components/modals/GameConfirmationModal.ts
var GameConfirmationModal = class extends component_default {
  constructor(game, time) {
    super({ game, time });
    this.componentName = "game-launch-modal";
  }
  data() {
    return {
      show: false,
      isLoading: false,
      isConfirmed: false,
      delay: this.props.time ? this.props.time : 20
    };
  }
  setShow(value) {
    this.state.show = value;
    if (value) {
      timer_default.addTimer("game-confirmation-modal", (counter2) => {
        if (this.state.delay == 0) {
          timer_default.removeTimer("game-confirmation-modal");
          this.state.isLoading = false;
          this.state.isConfirmed = false;
          this.state.show = false;
          return;
        }
        this.state.delay = (this.props.time || 20) - counter2;
      });
    }
    return this;
  }
  onSubmit() {
    this.state.isLoading = true;
    GameLauncher.confirmGame(() => {
      console.log("successfully confirmed game");
      this.state.isLoading = false;
      this.state.isConfirmed = true;
    });
  }
  time(num) {
    const seconds = num < 10 ? "0" + num : num;
    return "0:" + seconds;
  }
  template() {
    const modal = new ModalLayout("game-launch-modal", {
      customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
    }).setShow(this.state.show);
    const headerText = this.state.isConfirmed ? "Waiting for all confirmations..." : "Found a game!";
    const header = elem("h2").setProps({ class: "text-lg font-semibold text-gray-800" }).addChild(text(headerText));
    modal.setSlot("header", header);
    const remainingTime = this.time(this.state.delay);
    if (this.state.isConfirmed) {
      const body = elem("span").setChild([
        new GameWaitComponent(remainingTime)
      ]);
      modal.setSlot("body", body);
    } else {
      const body = elem("span").setChild([
        new LoadingLayout({
          label: "Please wait...",
          icon: "ti ti-loader"
        }).setShow(this.state.isLoading),
        new GameConfirmationComponent(remainingTime, this.onSubmit.bind(this))
      ]);
      modal.setSlot("body", body);
    }
    return elem("span").addChild(modal);
  }
};

// src/components/AppComponent.ts
var navBarLinks = [
  new NavBarLink("Home", "home", "ti ti-home"),
  new NavBarLink("About", "about", "ti ti-info-circle")
];
var AppComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "app-container";
  }
  data() {
    return {
      isAuthorized: isAuthorized(),
      currentRoute: router_default.getCurrentRoute(),
      searchGameType: null,
      showGameConfirmationModal: false,
      confirmTime: void 0
    };
  }
  isNavigatablePage() {
    if (!this.state.currentRoute) {
      return false;
    }
    return this.state.currentRoute.name != "auth";
  }
  onMounted() {
    EventBroker.getInstance().on("activate-search-game-bar", (game) => {
      if (this.state.searchGameType) {
        return;
      }
      this.state.searchGameType = game;
    });
    EventBroker.getInstance().on("deactivate-search-game-bar", () => {
      if (!this.state.searchGameType) {
        return;
      }
      timer_default.removeTimer("game-search-bar");
      this.state.searchGameType = null;
    });
    EventBroker.getInstance().on("activate-confirmation-modal", (data) => {
      this.state.showGameConfirmationModal = true;
      this.state.confirmTime = data.confirmTime;
    });
    EventBroker.getInstance().on("deactivate-confirmation-modal", () => {
      timer_default.removeTimer("game-confirmation-modal");
      this.state.showGameConfirmationModal = false;
    });
    EventBroker.getInstance().on("update-auth", () => {
      this.state.isAuthorized = isAuthorized();
    });
  }
  onCreated() {
    Store.setters.setupUser();
  }
  onUnmounted() {
    EventBroker.getInstance().off("activate-confirmation-modal");
    EventBroker.getInstance().off("deactivate-confirmation-modal");
    EventBroker.getInstance().off("activate-search-game-bar");
    EventBroker.getInstance().off("deactivate-search-game-bar");
    EventBroker.getInstance().off("update-auth");
  }
  template() {
    return elem("div").setProps({ id: "app", class: "h-screen w-screen bg-gray-100 text-gray-800" }).setChild([
      elem("span").$vif(true).addChild(new NavBarComponent(navBarLinks, this.state.isAuthorized)),
      new FrontendyRouterView(router_default),
      new SearchGameBarComponent().setSearchGame(this.state.searchGameType),
      new GameConfirmationModal(this.state.searchGameType, this.state.confirmTime).setShow(this.state.showGameConfirmationModal)
    ]);
  }
};

// src/client.ts
console.log("I am client.ts");
var rootElem = document.querySelector("body");
if (!rootElem) {
  throw new Error("Client error : root id not found");
}
var appInstance = new FrontendyAppInstance(AppComponent);
appInstance.mount(rootElem);
/*! Bundled license information:

js-sha256/src/sha256.js:
  (**
   * [js-sha256]{@link https://github.com/emn178/js-sha256}
   *
   * @version 0.11.0
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2024
   * @license MIT
   *)
*/
