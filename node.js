/*! wp-common. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

/*
  This file is meant to be a substitute to some of what the nodejs api can do
  that the browser can't do and vice versa.
*/

// could technically use web crypto in node also
// but it was introduced in v15... so we need to wait
const { randomFillSync, createHash: hash } = require('crypto')

/** Convert anything to Uint8Array without a copy */
/** @returns {Uint8Array} */
const toUint8 = x => x instanceof ArrayBuffer
  ? new Uint8Array(x)
  : ArrayBuffer.isView(x)
    ? x instanceof Uint8Array && x.constructor.name === Uint8Array.name
      ? x
      : new Uint8Array(x.buffer, x.byteOffset, x.byteLength)
    : text2arr(x)

/**
 * Encode a Uint8Array to a hex string
 *
 * @param  {Uint8Array} arr Bytes to encode to string
 * @return {string} hex string
 */
const arr2hex = arr => Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength).toString('hex')

/**
 * Decodes a hex string to a Uint8Array
 *
 * @param  {string} str hex string to decode to Uint8Array
 * @return {Uint8Array} Uint8Array
 */
const hex2arr = str => toUint8(Buffer.from(str, 'hex'))

/**
 * @param  {string} str
 * @return {string}
 */
const binary2hex = str => Buffer.from(str, 'binary').toString('hex')

/**
 * @param  {string} str
 * @return {string}
 */
const hex2binary = str => Buffer.from(str, 'hex').toString('binary')

/**
 * @param  {Uint8Array} uint8
 * @return {Promise<Uint8Array>}
 */
const sha1 = uint8 => Promise.resolve(toUint8(hash('sha1').update(uint8).digest()))

const text2arr = str => toUint8(Buffer.from(String(str), 'utf8'))

/** @param {ArrayBufferView} view */
const arr2text = view => Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString('hex')

/** @param {ArrayBufferView} view */
const getRandomValues = view => randomFillSync(view)

exports.toUint8 = toUint8
exports.arr2hex = arr2hex
exports.hex2arr = hex2arr
exports.binary2hex = binary2hex
exports.hex2binary = hex2binary
exports.sha1 = sha1
exports.text2arr = text2arr
exports.arr2text = arr2text
exports.getRandomValues = getRandomValues
