import {
  aliceGetResponseGet,
  aliceRequestPublicKey,
  aliceRequestSignAggregateBondedTx,
  aliceRequestSignBatches,
  aliceRequestSignBinaryHex,
  aliceRequestSignTransaction,
  aliceRequestSignUtf8,
  type AliceErrorResponse,
  type AlicePublicKeyResponse,
  type AliceSignBatchesResponse,
  type AliceSignTxResponse,
  type AliceSignUtf8Response,
} from 'alice-cookie'
import { useEffect, useState } from 'react'
import { PublicKey, utils } from 'symbol-sdk'
import {
  descriptors,
  generateNamespaceId,
  models,
  SymbolFacade,
  SymbolTransactionFactory,
} from 'symbol-sdk/symbol'
import './App.css'
import symbolLogo from './assets/Symbol_Logo_primary_light_BG.svg'

/** 空の公開鍵 */
const EMPTY_PUBLIC_KEY = new PublicKey(new Uint8Array(32).fill(0))

/**
 *
 * @returns
 */
function App() {
  const [response, setResponse] = useState<
    | AliceSignTxResponse
    | AliceSignUtf8Response
    | AlicePublicKeyResponse
    | AliceErrorResponse
    | AliceSignBatchesResponse
    | null
  >()

  useEffect(() => {
    // GETパラメータ取得
    const response = aliceGetResponseGet()
    setResponse(response)

    const signedPayload = (response as AliceSignTxResponse)?.signedPayload
    console.log('Signed Payload:', signedPayload)
    const signedHashLockPayload = (response as AliceSignTxResponse)?.signedHashLockPayload
    console.log('Signed Hash Lock Payload:', signedHashLockPayload)

    const facade = new SymbolFacade('testnet')

    if (signedPayload) {
      const tx = SymbolTransactionFactory.deserialize(utils.hexToUint8(signedPayload))
      console.debug(JSON.stringify(tx.toJson(), undefined, 2))
      const txHash = facade.hashTransaction(tx)
      console.log('Transaction Hash:', utils.uint8ToHex(txHash.bytes))
    }
    if (signedHashLockPayload) {
      const hashLockTx = facade.transactionFactory.static.deserialize(
        utils.hexToUint8(signedHashLockPayload),
      )
      console.debug(JSON.stringify(hashLockTx.toJson(), undefined, 2))
    }

    // POSTパラメータ取得
    if (window.opener && window.addEventListener) {
      window.addEventListener('message', (event) => {
        // if (typeof event.data === 'object' && event.data && event.data.type === 'alice-cookie-response') {
        setResponse(event.data.payload)
        // }
      })
    }
  }, [])

  const handleRequestSignTransaction = (method: 'get' | 'post' | 'announce') => {
    // ファサード生成
    const facade = new SymbolFacade('testnet')
    // symbol.xymのネームスペースIDを生成
    const nsSymbol = generateNamespaceId('symbol')
    const nsSymbolXym = generateNamespaceId('xym', nsSymbol)
    // キャロルパブリックアカウント
    const carolPublicKey = new PublicKey(
      '249B8ADE64EFF216D43BB655EF41DC1D7B8DDF96BD655749FFAF78BE3ACE7D77',
    )
    const carolPublicAccount = facade.createPublicAccount(carolPublicKey)
    // メッセージ
    const message = '\0message'
    // 転送トランザクションを作成
    const transferDescriptor = new descriptors.TransferTransactionV1Descriptor(
      carolPublicAccount.address,
      [
        new descriptors.UnresolvedMosaicDescriptor(
          new models.UnresolvedMosaicId(nsSymbolXym),
          new models.Amount(300000n),
        ),
      ],
      message,
    )
    const transferTx = facade.createTransactionFromTypedDescriptor(
      transferDescriptor,
      EMPTY_PUBLIC_KEY,
      // new PublicKey('94EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD'),
      100,
      60 * 60 * 2,
      0,
    )

    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignTransaction({
      serializedTransaction: transferTx.serialize(),
      callbackUrl: currentUrl,
      method,
    })
  }

  const handleRequestSignTransactionAb = (method: 'get' | 'post' | 'announce') => {
    // ファサード生成
    const facade = new SymbolFacade('testnet')
    // symbol.xymのネームスペースIDを生成
    const nsSymbol = generateNamespaceId('symbol')
    const nsSymbolXym = generateNamespaceId('xym', nsSymbol)
    // キャロルパブリックアカウント
    const carolPublicKey = new PublicKey(
      '249B8ADE64EFF216D43BB655EF41DC1D7B8DDF96BD655749FFAF78BE3ACE7D77',
    )
    const carolPublicAccount = facade.createPublicAccount(carolPublicKey)
    // 内部トランザクション
    const innerDescriptor1 = new descriptors.TransferTransactionV1Descriptor(
      carolPublicAccount.address,
      [
        new descriptors.UnresolvedMosaicDescriptor(
          new models.UnresolvedMosaicId(nsSymbolXym),
          new models.Amount(99_883784n),
        ),
      ],
    )
    const innerTx1 = facade.createEmbeddedTransactionFromTypedDescriptor(
      innerDescriptor1,
      carolPublicKey,
    )
    // アグリゲートボンデッドトランザクション
    const embeddedTransactions = [innerTx1]
    const descriptor = new descriptors.AggregateBondedTransactionV2Descriptor(
      facade.static.hashEmbeddedTransactions(embeddedTransactions),
      embeddedTransactions,
    )
    const aggregateTx = facade.createTransactionFromTypedDescriptor(
      descriptor,
      EMPTY_PUBLIC_KEY,
      100,
      60 * 60 * 2,
      1,
    )

    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignAggregateBondedTx({
      serializedTransaction: aggregateTx.serialize(),
      hashLockDuration: 480,
      callbackUrl: currentUrl,
      method,
    })
  }

  const handleRequestSignUtf8 = (method: 'get' | 'post' | 'announce') => {
    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignUtf8({
      stringUtf8: 'message',
      callbackUrl: currentUrl,
      method,
    })
  }

  const handleRequestSignBinaryHex = (method: 'get' | 'post' | 'announce') => {
    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignBinaryHex({
      binaryData: new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]),
      callbackUrl: currentUrl,
      method,
    })
  }

  const handleRequestSignBatches = (method: 'get' | 'post' | 'announce') => {
    // ファサード生成
    const facade = new SymbolFacade('testnet')
    // symbol.xymのネームスペースIDを生成
    const nsSymbol = generateNamespaceId('symbol')
    const nsSymbolXym = generateNamespaceId('xym', nsSymbol)
    // キャロルパブリックアカウント
    const carolPublicKey = new PublicKey(
      '249B8ADE64EFF216D43BB655EF41DC1D7B8DDF96BD655749FFAF78BE3ACE7D77',
    )
    const carolPublicAccount = facade.createPublicAccount(carolPublicKey)
    // メッセージ
    const message1 = '\0message1'
    // 転送トランザクションを作成
    const transferDescriptor1 = new descriptors.TransferTransactionV1Descriptor(
      carolPublicAccount.address,
      [
        new descriptors.UnresolvedMosaicDescriptor(
          new models.UnresolvedMosaicId(nsSymbolXym),
          new models.Amount(300000n),
        ),
      ],
      message1,
    )
    const transferTx1 = facade.createTransactionFromTypedDescriptor(
      transferDescriptor1,
      EMPTY_PUBLIC_KEY,
      100,
      60 * 60 * 2,
      0,
    )

    // メッセージ
    const message2 = '\0message2'
    // 転送トランザクションを作成
    const transferDescriptor2 = new descriptors.TransferTransactionV1Descriptor(
      carolPublicAccount.address,
      [
        new descriptors.UnresolvedMosaicDescriptor(
          new models.UnresolvedMosaicId(nsSymbolXym),
          new models.Amount(300000n),
        ),
      ],
      message2,
    )
    const transferTx2 = facade.createTransactionFromTypedDescriptor(
      transferDescriptor2,
      EMPTY_PUBLIC_KEY,
      100,
      60 * 60 * 2,
      0,
    )

    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignBatches({
      serializedTransactions: [transferTx1.serialize(), transferTx2.serialize()],
      callbackUrl: currentUrl,
      method,
    })
  }

  const handleRequestPublicKey = () => {
    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestPublicKey({ callbackUrl: currentUrl })
  }

  return (
    <>
      <div>
        <img src={symbolLogo} className="logo react" alt="Symbol logo" />
      </div>
      <h1>
        Vite + React
        <br />+ Symbol
        <br />+ aLice
      </h1>
      <div className="card">
        {response && (
          <>
            Response:
            <pre
              style={{
                textAlign: 'left',
                maxHeight: '200px',
                maxWidth: 'calc(100vw - 32px)',
                overflowY: 'auto',
                overflowX: 'auto',
                wordBreak: 'break-all',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '0.95em',
                boxSizing: 'border-box',
              }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
          </>
        )}
      </div>
      <button onClick={() => handleRequestPublicKey()}>Request Public Key</button>
      <br />
      <strong>GET</strong>
      <br />
      <button onClick={() => handleRequestSignTransaction('get')}>Sign Tx</button>
      <button onClick={() => handleRequestSignTransactionAb('get')}>Sign AB Tx</button>
      <button onClick={() => handleRequestSignUtf8('get')}>Sign UTF8</button>
      <br />
      <button onClick={() => handleRequestSignBinaryHex('get')}>Sign Binary</button>
      <button onClick={() => handleRequestSignBatches('get')}>Sign Batches</button>
      <br />
      <strong>POST</strong>
      <br />
      <button onClick={() => handleRequestSignTransaction('post')}>Sign Tx</button>
      <button onClick={() => handleRequestSignTransactionAb('post')}>Sign AB Tx</button>
      <button onClick={() => handleRequestSignUtf8('post')}>Sign UTF8</button>
      <br />
      <button onClick={() => handleRequestSignBinaryHex('post')}>Sign Binary</button>
      <button onClick={() => handleRequestSignBatches('post')}>Sign Batches</button>
    </>
  )
}

export default App
