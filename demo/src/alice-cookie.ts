import type {
  AliceErrorResponse,
  AlicePublicKeyResponse,
  AliceSignTxResponse,
  AliceSignUtf8Response,
} from './types/alice-cookie.types'
import { uint8ToHex, utf8ToHex } from './utils/convert'

/** アリスカスタムURLスキーム */
const ALICE_CUSTOM_URL_SCHEME = 'alice://sign'

/**
 * アリスにトランザクション署名をリクエストする
 * @param serializedTransaction シリアライズトランザクション
 * @param callbackUrl コールバックURL
 * @param method Get / Post / Announce
 * @param publicKey 公開鍵
 * @param node アナウンスノード
 */
export async function aliceRequestSignTransaction(
  serializedTransaction: Uint8Array,
  callbackUrl?: string,
  method: 'get' | 'post' | 'announce' = 'get',
  publicKey?: string,
  node?: string,
): Promise<void> {
  const url = new URL(ALICE_CUSTOM_URL_SCHEME)
  url.searchParams.set('data', uint8ToHex(serializedTransaction))
  url.searchParams.set('type', 'request_sign_transaction')
  url.searchParams.set('method', method)
  if (publicKey) url.searchParams.set('set_public_key', publicKey)
  if (callbackUrl) url.searchParams.set('callback', utf8ToHex(callbackUrl))
  if (node) url.searchParams.set('node', node)

  console.debug('Requesting sign transaction:', url.toString())
  location.href = url.toString()
}

/**
 * アリスにUTF8文字列署名をリクエストする
 * @param stringUtf8 署名したいUTF8文字列
 * @param callbackUrl コールバックURL
 * @param method Get / Post / Announce
 * @param publicKey 公開鍵
 * @param node アナウンスノード
 */
export async function aliceRequestSignUtf8(
  stringUtf8: string,
  callbackUrl?: string,
  method: 'get' | 'post' | 'announce' = 'get',
  publicKey?: string,
  node?: string,
): Promise<void> {
  const url = new URL(ALICE_CUSTOM_URL_SCHEME)
  url.searchParams.set('data', utf8ToHex(stringUtf8))
  url.searchParams.set('type', 'request_sign_utf8')
  url.searchParams.set('method', method)
  if (publicKey) url.searchParams.set('set_public_key', publicKey)
  if (callbackUrl) url.searchParams.set('callback', utf8ToHex(callbackUrl))
  if (node) url.searchParams.set('node', node)

  console.debug('Requesting sign transaction:', url.toString())
  location.href = url.toString()
}

/**
 * アリスにバイナリデータ署名をリクエストする
 * @param binaryData 署名したいバイナリデータ
 * @param callbackUrl コールバックURL
 * @param method Get / Post / Announce
 * @param publicKey 公開鍵
 * @param node アナウンスノード
 */
export async function aliceRequestSignBinaryHex(
  binaryData: Uint8Array,
  callbackUrl?: string,
  method: 'get' | 'post' | 'announce' = 'get',
  publicKey?: string,
  node?: string,
): Promise<void> {
  const url = new URL(ALICE_CUSTOM_URL_SCHEME)
  url.searchParams.set('data', uint8ToHex(binaryData))
  url.searchParams.set('type', 'request_sign_binary_hex')
  url.searchParams.set('method', method)
  if (publicKey) url.searchParams.set('set_public_key', publicKey)
  if (callbackUrl) url.searchParams.set('callback', utf8ToHex(callbackUrl))
  if (node) url.searchParams.set('node', node)

  console.debug('Requesting sign transaction:', url.toString())
  location.href = url.toString()
}

/**
 * アリスにトランザクション署名をバッチリクエストする
 * @param serializedTransactions シリアライズトランザクションの配列
 * @param callbackUrl コールバックURL
 * @param method Get / Post / Announce
 * @param publicKey 公開鍵
 * @param node アナウンスノード
 */
export async function aliceRequestSignBatches(
  serializedTransactions: Uint8Array[],
  callbackUrl?: string,
  method: 'get' | 'post' | 'announce' = 'get',
  publicKey?: string,
  node?: string,
): Promise<void> {
  const url = new URL(ALICE_CUSTOM_URL_SCHEME)
  for (let i = 0; i < serializedTransactions.length; i++) {
    url.searchParams.set(`batch${i}`, uint8ToHex(serializedTransactions[i]))
  }
  url.searchParams.set('type', 'request_sign_batches')
  url.searchParams.set('method', method)
  if (publicKey) url.searchParams.set('set_public_key', publicKey)
  if (callbackUrl) url.searchParams.set('callback', utf8ToHex(callbackUrl))
  if (node) url.searchParams.set('node', node)

  console.debug('Requesting sign transaction:', url.toString())
  location.href = url.toString()
}

/**
 * アリスから公開鍵を取得する
 * @param callbackUrl コールバックURL
 */
export async function aliceRequestPublicKey(
  callbackUrl?: string,
  method: 'get' | 'post' | 'announce' = 'get',
): Promise<void> {
  const url = new URL(ALICE_CUSTOM_URL_SCHEME)
  url.searchParams.set('type', 'request_pubkey')
  url.searchParams.set('method', method)
  if (callbackUrl) url.searchParams.set('callback', utf8ToHex(callbackUrl))

  console.debug('Requesting sign transaction:', url.toString())
  location.href = url.toString()
}

/**
 * アリスからのレスポンスを取得する
 * @returns レスポンス情報
 */
export function aliceGetResponseGet() {
  const urlParams = new URLSearchParams(window.location.search)
  const signedPayload = urlParams.get('signed_payload')
  const error = urlParams.get('error')
  const pubkey = urlParams.get('pubkey')
  const network = urlParams.get('network')
  const signature = urlParams.get('signature')
  const originalData = urlParams.get('original_data')

  // パラメータを削除
  window.history.replaceState({}, document.title, window.location.pathname)

  if (error) {
    return { error } as AliceErrorResponse
  } else if (signedPayload) {
    return { signedPayload, pubkey, network } as AliceSignTxResponse
  } else if (signature) {
    return { signature, originalData, network } as AliceSignUtf8Response
  } else if (pubkey && !signedPayload) {
    return { pubkey, network } as AlicePublicKeyResponse
  }

  return null
}
