import { useEffect, useState } from 'react'
import { PublicKey } from 'symbol-sdk'
import { descriptors, generateNamespaceId, models, SymbolFacade } from 'symbol-sdk/symbol'
import {
  aliceGetResponseGet,
  aliceRequestPublicKey,
  aliceRequestSignBatches,
  aliceRequestSignBinaryHex,
  aliceRequestSignTransaction,
  aliceRequestSignUtf8,
} from './alice-cookie'
import './App.css'
import symbolLogo from './assets/Symbol_Logo_primary_light_BG.svg'
import type {
  AliceErrorResponse,
  AlicePublicKeyResponse,
  AliceSignTxResponse,
  AliceSignUtf8Response,
} from './types/alice-cookie.types'

/**
 *
 * @returns
 */
function App() {
  const [response, setResponse] = useState<
    AliceSignTxResponse | AliceSignUtf8Response | AlicePublicKeyResponse | AliceErrorResponse | null
  >()

  useEffect(() => {
    // GETパラメータ取得
    const response = aliceGetResponseGet()
    setResponse(response)

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
    const carolPublicKey = new PublicKey('249B8ADE64EFF216D43BB655EF41DC1D7B8DDF96BD655749FFAF78BE3ACE7D77')
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
      new PublicKey('0000000000000000000000000000000000000000000000000000000000000000'),
      // new PublicKey('94EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD'),
      100,
      60 * 60 * 2,
      0,
    )

    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignTransaction(transferTx.serialize(), currentUrl, method)
  }

  const handleRequestSignUtf8 = (method: 'get' | 'post' | 'announce') => {
    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignUtf8('message', currentUrl, method)
  }

  const handleRequestSignBinaryHex = (method: 'get' | 'post' | 'announce') => {
    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignBinaryHex(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]), currentUrl, method)
  }

  const handleRequestSignBatches = (method: 'get' | 'post' | 'announce') => {
    // ファサード生成
    const facade = new SymbolFacade('testnet')
    // symbol.xymのネームスペースIDを生成
    const nsSymbol = generateNamespaceId('symbol')
    const nsSymbolXym = generateNamespaceId('xym', nsSymbol)
    // キャロルパブリックアカウント
    const carolPublicKey = new PublicKey('249B8ADE64EFF216D43BB655EF41DC1D7B8DDF96BD655749FFAF78BE3ACE7D77')
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
      new PublicKey('0000000000000000000000000000000000000000000000000000000000000000'),
      // new PublicKey('94EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD'),
      100,
      60 * 60 * 2,
      0,
    )

    // 転送トランザクションを作成
    const transferDescriptor2 = new descriptors.TransferTransactionV1Descriptor(
      carolPublicAccount.address,
      [
        new descriptors.UnresolvedMosaicDescriptor(
          new models.UnresolvedMosaicId(nsSymbolXym),
          new models.Amount(200000n),
        ),
      ],
      message,
    )
    const transferTx2 = facade.createTransactionFromTypedDescriptor(
      transferDescriptor2,
      new PublicKey('0000000000000000000000000000000000000000000000000000000000000000'),
      // new PublicKey('94EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD'),
      100,
      60 * 60 * 2,
      0,
    )

    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestSignBatches([transferTx.serialize(), transferTx2.serialize()], currentUrl, method)
  }

  const handleRequestPublicKey = (method: 'get' | 'post' | 'announce') => {
    const currentUrl = window.location.href
    console.log('Current URL:', currentUrl)
    aliceRequestPublicKey(currentUrl, method)
  }

  return (
    <>
      <div>
        <img src={symbolLogo} className="logo react" alt="Symbol logo" />
      </div>
      <h1>
        Vite + React
        <br />+ Symbol
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
      <strong>GET</strong>
      <br />
      <button onClick={() => handleRequestSignTransaction('get')}>Sign Tx</button>
      <button onClick={() => handleRequestSignUtf8('get')}>Sign UTF8</button>
      <button onClick={() => handleRequestSignBinaryHex('get')}>Sign Binary</button>
      <br />
      <button onClick={() => handleRequestSignBatches('get')}>Sign Batches</button>
      <button onClick={() => handleRequestPublicKey('get')}>Request Public Key</button>
      <br />
      <strong>POST</strong>
      <br />
      <button onClick={() => handleRequestSignTransaction('post')}>Sign Tx</button>
      <button onClick={() => handleRequestSignUtf8('post')}>Sign UTF8</button>
      <button onClick={() => handleRequestSignBinaryHex('post')}>Sign Binary</button>
      <br />
      <button onClick={() => handleRequestSignBatches('post')}>Sign Batches</button>
      <button onClick={() => handleRequestPublicKey('post')}>Request Public Key</button>
    </>
  )
}

export default App
