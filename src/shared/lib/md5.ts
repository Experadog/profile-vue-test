// Minimal, dependency-free MD5 implementation (public-domain algorithm).
// Used only to build Gravatar URLs — not for anything security-sensitive.
// Pulling in a library for a single hash function isn't worth the bundle cost.

function rotateLeft(value: number, shift: number): number {
  return (value << shift) | (value >>> (32 - shift))
}

function addUnsigned(x: number, y: number): number {
  return (x + y) | 0
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b)
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn((b & c) | (~b & d), a, b, x, s, t)
}

function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn((b & d) | (c & ~d), a, b, x, s, t)
}

function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn(b ^ c ^ d, a, b, x, s, t)
}

function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn(c ^ (b | ~d), a, b, x, s, t)
}

function toWordArray(input: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < input.length; i++) {
    bytes.push(input.charCodeAt(i) & 0xff)
  }

  const bitLength = bytes.length * 8
  bytes.push(0x80)
  while (bytes.length % 64 !== 56) {
    bytes.push(0)
  }

  const words: number[] = []
  for (let i = 0; i < bytes.length; i += 4) {
    words[i / 4] =
      (bytes[i] ?? 0) | ((bytes[i + 1] ?? 0) << 8) | ((bytes[i + 2] ?? 0) << 16) | ((bytes[i + 3] ?? 0) << 24)
  }

  words.push(bitLength >>> 0)
  words.push(0)

  return words
}

function toHex(value: number): string {
  let hex = ''
  for (let i = 0; i < 4; i++) {
    const byte = (value >>> (i * 8)) & 0xff
    hex += byte.toString(16).padStart(2, '0')
  }
  return hex
}

// UTF-8 encode so non-ASCII emails hash the same way every MD5/Gravatar
// implementation expects.
function utf8Encode(input: string): string {
  return unescape(encodeURIComponent(input))
}

export function md5(input: string): string {
  const words = toWordArray(utf8Encode(input))

  let a = 0x67452301
  let b = 0xefcdab89
  let c = 0x98badcfe
  let d = 0x10325476

  for (let i = 0; i < words.length; i += 16) {
    const [aa, bb, cc, dd] = [a, b, c, d]

    a = ff(a, b, c, d, words[i + 0] ?? 0, 7, -680876936)
    d = ff(d, a, b, c, words[i + 1] ?? 0, 12, -389564586)
    c = ff(c, d, a, b, words[i + 2] ?? 0, 17, 606105819)
    b = ff(b, c, d, a, words[i + 3] ?? 0, 22, -1044525330)
    a = ff(a, b, c, d, words[i + 4] ?? 0, 7, -176418897)
    d = ff(d, a, b, c, words[i + 5] ?? 0, 12, 1200080426)
    c = ff(c, d, a, b, words[i + 6] ?? 0, 17, -1473231341)
    b = ff(b, c, d, a, words[i + 7] ?? 0, 22, -45705983)
    a = ff(a, b, c, d, words[i + 8] ?? 0, 7, 1770035416)
    d = ff(d, a, b, c, words[i + 9] ?? 0, 12, -1958414417)
    c = ff(c, d, a, b, words[i + 10] ?? 0, 17, -42063)
    b = ff(b, c, d, a, words[i + 11] ?? 0, 22, -1990404162)
    a = ff(a, b, c, d, words[i + 12] ?? 0, 7, 1804603682)
    d = ff(d, a, b, c, words[i + 13] ?? 0, 12, -40341101)
    c = ff(c, d, a, b, words[i + 14] ?? 0, 17, -1502002290)
    b = ff(b, c, d, a, words[i + 15] ?? 0, 22, 1236535329)

    a = gg(a, b, c, d, words[i + 1] ?? 0, 5, -165796510)
    d = gg(d, a, b, c, words[i + 6] ?? 0, 9, -1069501632)
    c = gg(c, d, a, b, words[i + 11] ?? 0, 14, 643717713)
    b = gg(b, c, d, a, words[i + 0] ?? 0, 20, -373897302)
    a = gg(a, b, c, d, words[i + 5] ?? 0, 5, -701558691)
    d = gg(d, a, b, c, words[i + 10] ?? 0, 9, 38016083)
    c = gg(c, d, a, b, words[i + 15] ?? 0, 14, -660478335)
    b = gg(b, c, d, a, words[i + 4] ?? 0, 20, -405537848)
    a = gg(a, b, c, d, words[i + 9] ?? 0, 5, 568446438)
    d = gg(d, a, b, c, words[i + 14] ?? 0, 9, -1019803690)
    c = gg(c, d, a, b, words[i + 3] ?? 0, 14, -187363961)
    b = gg(b, c, d, a, words[i + 8] ?? 0, 20, 1163531501)
    a = gg(a, b, c, d, words[i + 13] ?? 0, 5, -1444681467)
    d = gg(d, a, b, c, words[i + 2] ?? 0, 9, -51403784)
    c = gg(c, d, a, b, words[i + 7] ?? 0, 14, 1735328473)
    b = gg(b, c, d, a, words[i + 12] ?? 0, 20, -1926607734)

    a = hh(a, b, c, d, words[i + 5] ?? 0, 4, -378558)
    d = hh(d, a, b, c, words[i + 8] ?? 0, 11, -2022574463)
    c = hh(c, d, a, b, words[i + 11] ?? 0, 16, 1839030562)
    b = hh(b, c, d, a, words[i + 14] ?? 0, 23, -35309556)
    a = hh(a, b, c, d, words[i + 1] ?? 0, 4, -1530992060)
    d = hh(d, a, b, c, words[i + 4] ?? 0, 11, 1272893353)
    c = hh(c, d, a, b, words[i + 7] ?? 0, 16, -155497632)
    b = hh(b, c, d, a, words[i + 10] ?? 0, 23, -1094730640)
    a = hh(a, b, c, d, words[i + 13] ?? 0, 4, 681279174)
    d = hh(d, a, b, c, words[i + 0] ?? 0, 11, -358537222)
    c = hh(c, d, a, b, words[i + 3] ?? 0, 16, -722521979)
    b = hh(b, c, d, a, words[i + 6] ?? 0, 23, 76029189)
    a = hh(a, b, c, d, words[i + 9] ?? 0, 4, -640364487)
    d = hh(d, a, b, c, words[i + 12] ?? 0, 11, -421815835)
    c = hh(c, d, a, b, words[i + 15] ?? 0, 16, 530742520)
    b = hh(b, c, d, a, words[i + 2] ?? 0, 23, -995338651)

    a = ii(a, b, c, d, words[i + 0] ?? 0, 6, -198630844)
    d = ii(d, a, b, c, words[i + 7] ?? 0, 10, 1126891415)
    c = ii(c, d, a, b, words[i + 14] ?? 0, 15, -1416354905)
    b = ii(b, c, d, a, words[i + 5] ?? 0, 21, -57434055)
    a = ii(a, b, c, d, words[i + 12] ?? 0, 6, 1700485571)
    d = ii(d, a, b, c, words[i + 3] ?? 0, 10, -1894986606)
    c = ii(c, d, a, b, words[i + 10] ?? 0, 15, -1051523)
    b = ii(b, c, d, a, words[i + 1] ?? 0, 21, -2054922799)
    a = ii(a, b, c, d, words[i + 8] ?? 0, 6, 1873313359)
    d = ii(d, a, b, c, words[i + 15] ?? 0, 10, -30611744)
    c = ii(c, d, a, b, words[i + 6] ?? 0, 15, -1560198380)
    b = ii(b, c, d, a, words[i + 13] ?? 0, 21, 1309151649)
    a = ii(a, b, c, d, words[i + 4] ?? 0, 6, -145523070)
    d = ii(d, a, b, c, words[i + 11] ?? 0, 10, -1120210379)
    c = ii(c, d, a, b, words[i + 2] ?? 0, 15, 718787259)
    b = ii(b, c, d, a, words[i + 9] ?? 0, 21, -343485551)

    a = addUnsigned(a, aa)
    b = addUnsigned(b, bb)
    c = addUnsigned(c, cc)
    d = addUnsigned(d, dd)
  }

  return toHex(a) + toHex(b) + toHex(c) + toHex(d)
}
