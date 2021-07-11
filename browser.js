/*! wp-common. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

/* global crypto */

/*
  This file is meant to be a substitute to some of what the nodejs api can do
  that the browser can't do and vice versa.
*/

const hash = globalThis.crypto?.subtle
  ? crypto.subtle.digest.bind(crypto.subtle, 'sha-1')
  : () => Promise.reject(new Error('no web crypto support'))

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const alphabet = '0123456789abcdef'
const encodeLookup = []
const decodeLookup = []

for (let i = 0; i < 256; i++) {
  encodeLookup[i] = alphabet[i >> 4 & 0xf] + alphabet[i & 0xf]
  if (i < 16) {
    if (i < 10) {
      decodeLookup[0x30 + i] = i
    } else {
      decodeLookup[0x61 - 10 + i] = i
    }
  }
}

/**
 * Encode a Uint8Array to a hex string
 *
 * @param {Uint8Array} array Bytes to encode to string
 */
const arr2hex = array => {
  const length = array.length
  let string = ''
  let i = 0
  while (i < length) {
    string += encodeLookup[array[i++]]
  }
  return string
}

/**
 * Decodes a hex string to a Uint8Array
 *
 * @param {string} string hex string to decode to Uint8Array
 * @return {Uint8Array}    Uint8Array
 */
const hex2arr = string => {
  const sizeof = string.length >> 1
  const length = sizeof << 1
  const array = new Uint8Array(sizeof)
  let n = 0
  let i = 0
  while (i < length) {
    array[n++] = decodeLookup[string.charCodeAt(i++)] << 4 | decodeLookup[string.charCodeAt(i++)]
  }
  return array
}

/**
 * @param {string} str
 * @return {string}
 */
const binary2hex = str => {
  const hex = '0123456789abcdef'
  let res = ''
  let c
  let i = 0
  const l = str.length

  for (; i < l; ++i) {
    c = str.charCodeAt(i)
    res += hex.charAt((c >> 4) & 0xF)
    res += hex.charAt(c & 0xF)
  }

  return res
}

/** @param {string} hex */
const hex2binary = hex => {
  let string = ''
  for (let i = 0, l = hex.length; i < l; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }

  return string
}

/**
 * @param  {BufferSource} buffer
 * @return {Promise<Uint8Array>}
 */
const sha1 = buffer => hash(buffer).then(toUint8)

/** @param {string} any */
const text2arr = any => textEncoder.encode(any)

/** @param {ArrayBufferView} bufferSource */
const arr2text = (bufferSource) => textDecoder.decode(bufferSource)

/** Convert anything to Uint8Array without a copy */
const toUint8 = x => x instanceof ArrayBuffer
  ? new Uint8Array(x)
  : ArrayBuffer.isView(x)
    ? x instanceof Uint8Array && x.constructor.name === Uint8Array.name
      ? x
      : new Uint8Array(x.buffer, x.byteOffset, x.byteLength)
    : text2arr(x)

/** @param {ArrayBufferView} view */
const getRandomValues = view => crypto.getRandomValues(view)

exports.arr2hex = arr2hex
exports.hex2arr = hex2arr
exports.binary2hex = binary2hex
exports.hex2binary = hex2binary
exports.text2arr = text2arr
exports.arr2text = arr2text
exports.sha1 = sha1
exports.toUint8 = toUint8
exports.getRandomValues = getRandomValues
