# alice-cookie

> ⚠️ You need to have the aLice app installed on your smartphone to use this library.
> Callback URLs are recommended to use https.
>
> [Download aLice app (iOS)](https://apps.apple.com/us/app/alice-sign/id6449146041)｜[Download aLice app (Android)](https://play.google.com/store/apps/details?id=com.pine.alice)

`alice-cookie` is a utility library for integrating with the "aLice" signature smartphone app for the Symbol blockchain.
It is mainly used to call the aLice app from web apps or services to request signatures for transactions or data.

## Features

- Signature requests using aLice app's custom URL scheme
- Supports transaction signing, aggregate bonded signing, UTF8 string signing, binary data signing, etc.
- Receive signature results via callback URL
- TypeScript support

## Installation

```bash
yarn add alice-cookie
# or
npm install alice-cookie
```

## Usage

### Optional Arguments & Default Values

| Property                | Type                       | Optional | Default     | Description                                      |
| ----------------------- | -------------------------- | -------- | ----------- | ------------------------------------------------ |
| serializedTransaction   | Uint8Array                 | ×        | -           | Transaction to be signed                         |
| serializedTransactions  | Uint8Array[]               | ×        | -           | Array of transactions for batch signing          |
| stringUtf8              | string                     | ×        | -           | UTF8 string to be signed                         |
| binaryData              | Uint8Array                 | ×        | -           | Binary data to be signed                         |
| callbackUrl             | string                     | ○        | -           | Callback URL after signing                       |
| method                  | 'get'|'post'|'announce'    | ○        | 'get'       | Callback method                                  |
| publicKey               | string                     | ○        | -           | Signer's public key                              |
| node                    | string                     | ○        | -           | Announce node URL                                |
| hashLockDuration        | number                     | ○        | 480         | Hash lock duration (for aggregate bonded signing) |

*Unused properties in each function are ignored.

### Main Methods

| Method Name                      | Purpose                    | Main Argument Type                  | Return Type      |
| -------------------------------- | ------------------------- | ----------------------------------- | --------------- |
| aliceRequestSignTransaction      | Transaction signing        | AliceSignTransactionOptions         | Promise<void>    |
| aliceRequestSignAggregateBondedTx| Aggregate bonded signing   | AliceSignAggregateBondedTxOptions   | Promise<void>    |
| aliceRequestSignUtf8             | UTF8 string signing        | AliceSignUtf8Options                | Promise<void>    |
| aliceRequestSignBinaryHex        | Binary data signing        | AliceSignBinaryHexOptions           | Promise<void>    |
| aliceRequestSignBatches          | Batch transaction signing  | AliceSignBatchesOptions             | Promise<void>    |
| aliceRequestPublicKey            | Get public key             | AlicePublicKeyOptions               | Promise<void>    |
| aliceGetResponseGet              | Get response               | None                                | Various response types |

---

### About Callback URLs

- Callback URLs should use https.
- Specify a URL that can be opened from the aLice app in the smartphone browser.

---

### 1. Transaction Signing Request

```ts
import { aliceRequestSignTransaction } from 'alice-cookie'

aliceRequestSignTransaction({
  serializedTransaction: tx.serialize(),
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: 'your public key',
  node: 'https://symbol-node',
})
```

### 2. Aggregate Bonded Signing Request

```ts
import { aliceRequestSignAggregateBondedTx } from 'alice-cookie'

aliceRequestSignAggregateBondedTx({
  serializedTransaction: tx.serialize(),
  hashLockDuration: 480,
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: 'your public key',
  node: 'https://symbol-node',
})
```

### 3. UTF8 String Signing Request

```ts
import { aliceRequestSignUtf8 } from 'alice-cookie'

aliceRequestSignUtf8({
  stringUtf8: 'String to sign',
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: 'your public key',
  node: 'https://symbol-node',
})
```

### 4. Binary Data Signing Request

```ts
import { aliceRequestSignBinaryHex } from 'alice-cookie'

aliceRequestSignBinaryHex({
  binaryData: new Uint8Array([0x01, 0x02, 0x03]),
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: 'your public key',
  node: 'https://symbol-node',
})
```

### 5. Batch Transaction Signing Request

```ts
import { aliceRequestSignBatches } from 'alice-cookie'

aliceRequestSignBatches({
  serializedTransactions: [tx1.serialize(), tx2.serialize()],
  callbackUrl: 'https://your-app/callback',
  method: 'get',
  publicKey: 'your public key',
  node: 'https://symbol-node',
})
```

### 6. Public Key Request

```ts
import { aliceRequestPublicKey } from 'alice-cookie'

aliceRequestPublicKey({
  callbackUrl: 'https://your-app/callback',
})
```

### 7. Get Response from aLice

```ts
import { aliceGetResponseGet } from 'alice-cookie'

const response = aliceGetResponseGet()
// The response content varies depending on the signature type
// Example return types:
// - Transaction signing: { signedPayload, pubkey, network, signedHashLockPayload? } (AliceSignTxResponse)
// - UTF8 string signing: { signature, originalData, network } (AliceSignUtf8Response)
// - Batch signing: { signedPayloads, pubkey } (AliceSignBatchesResponse)
// - Public key: { pubkey, network } (AlicePublicKeyResponse)
// - Error: { error } (AliceErrorResponse)
```

---

## Support & Contact

- For bug reports or requests, please contact us via [GitHub Issues](https://github.com/nemnesia/alice-cookie/issues).
- Supported environments: Modern browsers (smartphone recommended), Node.js v18 or later

## License

Apache-2.0

---
