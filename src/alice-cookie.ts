import type {
  AliceErrorResponse,
  AlicePublicKeyOptions,
  AlicePublicKeyResponse,
  AliceSignAggregateBondedTxOptions,
  AliceSignBatchesOptions,
  AliceSignBatchesResponse,
  AliceSignBinaryHexOptions,
  AliceSignTransactionOptions,
  AliceSignTxResponse,
  AliceSignUtf8Options,
  AliceSignUtf8Response,
} from './types/alice-cookie.types'
import { uint8ToHex, utf8ToHex } from './utils/convert'

/** アリスカスタムURLスキーム */
const ALICE_CUSTOM_URL_SCHEME = 'alice://sign'

/**
 * アリスにトランザクション署名をリクエストする
 * @param options アリスにトランザクション署名をリクエストするオプション
 */
export async function aliceRequestSignTransaction(
  options: AliceSignTransactionOptions,
): Promise<void> {
  const { serializedTransaction, callbackUrl, method = 'get', publicKey, node } = options

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
 * アリスにアグリゲートボンデッドトランザクション署名をリクエストする
 * @param options アリスにアグリゲートボンデッドトランザクション署名をリクエストするオプション
 */
export async function aliceRequestSignAggregateBondedTx(
  options: AliceSignAggregateBondedTxOptions,
): Promise<void> {
  const {
    serializedTransaction,
    hashLockDuration = 480,
    callbackUrl,
    method = 'get',
    publicKey,
    node,
  } = options

  const url = new URL(ALICE_CUSTOM_URL_SCHEME)
  url.searchParams.set('data', uint8ToHex(serializedTransaction))
  url.searchParams.set('type', 'request_sign_transaction')
  url.searchParams.set('hash_lock_duration', String(hashLockDuration))
  url.searchParams.set('method', method)
  if (publicKey) url.searchParams.set('set_public_key', publicKey)
  if (callbackUrl) url.searchParams.set('callback', utf8ToHex(callbackUrl))
  if (node) url.searchParams.set('node', node)

  console.debug('Requesting sign transaction:', url.toString())
  location.href = url.toString()
}

/**
 * アリスにUTF8文字列署名をリクエストする
 * @param options アリスにUTF8文字列署名をリクエストするオプション
 */
export async function aliceRequestSignUtf8(options: AliceSignUtf8Options): Promise<void> {
  const { stringUtf8, callbackUrl, method = 'get', publicKey, node } = options

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
 * @param options アリスにバイナリデータ署名をリクエストするオプション
 */
export async function aliceRequestSignBinaryHex(options: AliceSignBinaryHexOptions): Promise<void> {
  const { binaryData, callbackUrl, method = 'get', publicKey, node } = options

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
 * @param options アリスにトランザクション署名をバッチリクエストするオプション
 */
export async function aliceRequestSignBatches(options: AliceSignBatchesOptions): Promise<void> {
  const { serializedTransactions, callbackUrl, method = 'get', publicKey, node } = options

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
 * @param options アリスから公開鍵を取得するオプション
 */
export async function aliceRequestPublicKey(options: AlicePublicKeyOptions): Promise<void> {
  const { callbackUrl } = options

  const url = new URL(ALICE_CUSTOM_URL_SCHEME)
  url.searchParams.set('type', 'request_pubkey')
  if (callbackUrl) url.searchParams.set('callback', utf8ToHex(callbackUrl))

  console.debug('Requesting sign transaction:', url.toString())
  location.href = url.toString()
}

/**
 * アリスからのレスポンスを取得する
 * @returns レスポンス情報
 */
export function aliceGetResponseGet():
  | AliceErrorResponse
  | AliceSignTxResponse
  | AliceSignUtf8Response
  | AlicePublicKeyResponse
  | AliceSignBatchesResponse
  | null {
  const urlParams = new URLSearchParams(window.location.search)
  const signedPayload = urlParams.get('signed_payload')
  const error = urlParams.get('error')
  const pubkey = urlParams.get('pubkey')
  const network = urlParams.get('network')
  const signature = urlParams.get('signature')
  const originalData = urlParams.get('original_data')
  const signedHashLockPayload = urlParams.get('signed_hash_lock_payload')

  let i = 0
  let signed: string | null = null
  const signeds: string[] = []
  do {
    signed = urlParams.get(`signed${i++}`)
    if (signed) signeds.push(signed)
  } while (signed)

  // パラメータを削除
  window.history.replaceState({}, document.title, window.location.pathname)

  if (error) {
    return { error } as AliceErrorResponse
  } else if (signedPayload) {
    return {
      signedPayload,
      pubkey,
      network,
      ...(signedHashLockPayload !== null && { signedHashLockPayload }),
    } as AliceSignTxResponse
  } else if (signature) {
    return { signature, originalData, network } as AliceSignUtf8Response
  } else if (signeds.length > 0) {
    return { signedPayloads: signeds, pubkey } as AliceSignBatchesResponse
  } else if (pubkey && !signedPayload) {
    return { pubkey, network } as AlicePublicKeyResponse
  }

  return null
}
