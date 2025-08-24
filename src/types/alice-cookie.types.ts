/**
 * アリスに署名リクエストを送信するオプション
 */
export interface AliceSignOptions {
  callbackUrl?: string
  method?: 'get' | 'post' | 'announce'
  publicKey?: string
  node?: string
}

/**
 * アリスにトランザクション署名をリクエストするオプション
 */
export interface AliceSignTransactionOptions extends AliceSignOptions {
  serializedTransaction: Uint8Array
}

/**
 * アリスにアグリゲートボンデッドトランザクション署名をリクエストするオプション
 */
export interface AliceSignAggregateBondedTxOptions extends AliceSignTransactionOptions {
  hashLockDuration?: number
}

/**
 * アリスにUTF8文字列署名をリクエストするオプション
 */
export interface AliceSignUtf8Options extends AliceSignOptions {
  stringUtf8: string
}

/**
 * アリスにバイナリデータ署名をリクエストするオプション
 */
export interface AliceSignBinaryHexOptions extends AliceSignOptions {
  binaryData: Uint8Array
}

/**
 * アリスにバッチトランザクション署名をリクエストするオプション
 */
export interface AliceSignBatchesOptions extends AliceSignOptions {
  serializedTransactions: Uint8Array[]
}

/**
 * アリスから公開鍵を取得するオプション
 */
export interface AlicePublicKeyOptions {
  callbackUrl?: string
}

/**
 * アリスからの共通レスポンス（network付き）
 */
export interface AliceNetworkResponse {
  network: string
}

/**
 * アリスからのトランザクション署名レスポンス
 */
export interface AliceSignTxResponse extends AliceNetworkResponse {
  signedPayload: string
  originalData: string
  pubkey: string
  signedHashLockPayload?: string
}

/**
 * アリスからのUTF8データ署名レスポンス
 */
export interface AliceSignUtf8Response extends AliceNetworkResponse {
  signature: string
  originalData: string
}

/**
 * アリスからのバッチ署名レスポンス
 */
export interface AliceSignBatchesResponse {
  signedPayloads: string[]
  pubkey: string
}

/**
 * アリスからの公開鍵レスポンス
 */
export interface AlicePublicKeyResponse extends AliceNetworkResponse {
  pubkey: string
}

/**
 * アリスからのエラーレスポンス
 */
export interface AliceErrorResponse {
  error: string
}
