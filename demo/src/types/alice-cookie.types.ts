/**
 * アリスからのエラーレスポンス
 */
export type AliceErrorResponse = {
  error: string
}

/**
 * アリスからのトランザクション署名レスポンス
 */
export type AliceSignTxResponse = {
  signedPayload: string
  pubkey: string
  network: string
}

/**
 * アリスからのUTF8データ署名レスポンス
 */
export type AliceSignUtf8Response = {
  signature: string
  originalData: string
  network: string
}

/**
 * アリスからの公開鍵レスポンス
 */
export type AlicePublicKeyResponse = {
  pubkey: string
  network: string
}
