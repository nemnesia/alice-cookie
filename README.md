# alice-cookie

> ⚠️ ご利用にはスマートフォンにaLiceアプリがインストールされている必要があります。
> コールバックURLはhttps推奨です。
>
> [aLiceアプリ（iOS版）をダウンロード](https://apps.apple.com/us/app/alice-sign/id6449146041)｜[aLiceアプリ（Android版）をダウンロード](https://play.google.com/store/apps/details?id=com.pine.alice)

`alice-cookie`は、Symbolブロックチェーン向けの署名スマホアプリ「aLice」と連携するためのユーティリティライブラリです。  
主にWebアプリやサービスからaLiceアプリを呼び出し、トランザクションやデータの署名をリクエストする用途で利用します。

## 特長

- aLiceアプリのカスタムURLスキームを利用した署名リクエスト
- トランザクション署名、アグリゲートボンデッド署名、UTF8文字列署名、バイナリデータ署名などに対応
- コールバックURLによる署名結果の受け取り
- TypeScript対応

## インストール

```bash
yarn add alice-cookie
# または
npm install alice-cookie
```

## 使い方

### 引数の省略可・デフォルト値

| プロパティ             | 型                        | 省略可 | デフォルト値 | 説明                                         |
| ---------------------- | ------------------------- | ------ | ------------ | -------------------------------------------- |
| serializedTransaction  | Uint8Array                | ×      | -            | 署名対象トランザクション                     |
| serializedTransactions | Uint8Array[]              | ×      | -            | 一括署名用トランザクション配列               |
| stringUtf8             | string                    | ×      | -            | 署名対象UTF8文字列                           |
| binaryData             | Uint8Array                | ×      | -            | 署名対象バイナリデータ                       |
| callbackUrl            | string                    | ○      | -            | 署名後のコールバックURL                      |
| method                 | 'get'\|'post'\|'announce' | ○      | 'get'        | コールバック方式                             |
| publicKey              | string                    | ○      | -            | 署名者の公開鍵                               |
| node                   | string                    | ○      | -            | アナウンスノードURL                          |
| hashLockDuration       | number                    | ○      | 480          | ハッシュロック期限(アグリゲートボンデッド用) |

※各関数で利用しないプロパティは無視されます。

### 主なメソッド一覧

| メソッド名                        | 用途                       | 主な引数型                        | 返り値型         |
| --------------------------------- | -------------------------- | --------------------------------- | ---------------- |
| aliceRequestSignTransaction       | トランザクション署名       | AliceSignTransactionOptions       | Promise<void>    |
| aliceRequestSignAggregateBondedTx | アグリゲートボンデッド署名 | AliceSignAggregateBondedTxOptions | Promise<void>    |
| aliceRequestSignUtf8              | UTF8文字列署名             | AliceSignUtf8Options              | Promise<void>    |
| aliceRequestSignBinaryHex         | バイナリデータ署名         | AliceSignBinaryHexOptions         | Promise<void>    |
| aliceRequestSignBatches           | 複数トランザクション署名   | AliceSignBatchesOptions           | Promise<void>    |
| aliceRequestPublicKey             | 公開鍵取得                 | AlicePublicKeyOptions             | Promise<void>    |
| aliceGetResponseGet               | レスポンス取得             | なし                              | 各種レスポンス型 |

---

### コールバックURLについて

- コールバックURLはhttpsを推奨します。
- スマートフォンのブラウザでaLiceアプリから遷移できるURLを指定してください。

---

### 1. トランザクション署名リクエスト

```ts
import { aliceRequestSignTransaction } from 'alice-cookie'

aliceRequestSignTransaction({
  serializedTransaction: tx.serialize(),
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: '公開鍵文字列',
  node: 'https://symbol-node',
})
```

### 2. アグリゲートボンデッド署名リクエスト

```ts
import { aliceRequestSignAggregateBondedTx } from 'alice-cookie'

aliceRequestSignAggregateBondedTx({
  serializedTransaction: tx.serialize(),
  hashLockDuration: 480,
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: '公開鍵文字列',
  node: 'https://symbol-node',
})
```

### 3. UTF8文字列署名リクエスト

```ts
import { aliceRequestSignUtf8 } from 'alice-cookie'

aliceRequestSignUtf8({
  stringUtf8: '署名したい文字列',
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: '公開鍵文字列',
  node: 'https://symbol-node',
})
```

### 4. バイナリデータ署名リクエスト

```ts
import { aliceRequestSignBinaryHex } from 'alice-cookie'

aliceRequestSignBinaryHex({
  binaryData: new Uint8Array([0x01, 0x02, 0x03]),
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: '公開鍵文字列',
  node: 'https://symbol-node',
})
```

### 5. 複数トランザクション一括署名リクエスト

```ts
import { aliceRequestSignBatches } from 'alice-cookie'

aliceRequestSignBatches({
  serializedTransactions: [tx1.serialize(), tx2.serialize()],
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: '公開鍵文字列',
  node: 'https://symbol-node',
})
```

### 6. 公開鍵取得リクエスト

```ts
import { aliceRequestPublicKey } from 'alice-cookie'

aliceRequestPublicKey({
  callbackUrl: 'https://your-app/callback',
})
```

### 7. aLiceからのレスポンス取得

```ts
import { aliceGetResponseGet } from 'alice-cookie'

const response = aliceGetResponseGet()
// レスポンス内容は署名種別により異なります
// 返却型例:
// - トランザクション署名: { signedPayload, pubkey, network, signedHashLockPayload? } (AliceSignTxResponse)
// - UTF8文字列署名: { signature, originalData, network } (AliceSignUtf8Response)
// - 複数署名: { signedPayloads, pubkey } (AliceSignBatchesResponse)
// - 公開鍵取得: { pubkey, network } (AlicePublicKeyResponse)
// - エラー: { error } (AliceErrorResponse)
```

---

## サポート・問い合わせ

- 不具合・要望は[GitHub Issues](https://github.com/nemnesia/alice-cookie/issues)へご連絡ください。
- 対応環境: モダンブラウザ（スマートフォン推奨）、Node.js v18以降

## ライセンス

Apache-2.0

---
