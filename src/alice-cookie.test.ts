import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  aliceRequestSignTransaction,
  aliceRequestSignAggregateBondedTx,
  aliceRequestSignUtf8,
  aliceRequestSignBinaryHex,
  aliceRequestSignBatches,
  aliceRequestPublicKey,
  aliceGetResponseGet,
} from './alice-cookie'

// location.href をモックするためのヘルパー
type LocationMock = { href: string }
let locationMock: LocationMock

beforeEach(() => {
  locationMock = { href: '' }
  vi.stubGlobal('location', locationMock)
  vi.spyOn(console, 'debug').mockImplementation(() => {})
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('aliceRequestSignTransaction', () => {
  it('location.hrefに正しいURLがセットされる', async () => {
    await aliceRequestSignTransaction({
      serializedTransaction: new Uint8Array([1, 2, 3]),
      callbackUrl: 'https://example.com',
      method: 'post',
      publicKey: 'pubkey',
      node: 'node1',
    })
    expect(locationMock.href).toContain('alice://sign')
    expect(locationMock.href).toContain('data=010203')
    expect(locationMock.href).toContain('type=request_sign_transaction')
    expect(locationMock.href).toContain('method=post')
    expect(locationMock.href).toContain('set_public_key=pubkey')
    expect(locationMock.href).toContain('callback=68747470733A2F2F6578616D706C652E636F6D')
    expect(locationMock.href).toContain('node=node1')
  })
})

describe('aliceRequestSignAggregateBondedTx', () => {
  it('location.hrefに正しいURLがセットされる', async () => {
    await aliceRequestSignAggregateBondedTx({
      serializedTransaction: new Uint8Array([4, 5, 6]),
      hashLockDuration: 123,
      callbackUrl: 'https://cb',
      method: 'get',
      publicKey: 'pk',
      node: 'n',
    })
    expect(locationMock.href).toContain('data=040506')
    expect(locationMock.href).toContain('hash_lock_duration=123')
    expect(locationMock.href).toContain('callback=68747470733A2F2F6362')
    expect(locationMock.href).toContain('set_public_key=pk')
    expect(locationMock.href).toContain('node=n')
  })
})

describe('aliceRequestSignUtf8', () => {
  it('location.hrefに正しいURLがセットされる', async () => {
    await aliceRequestSignUtf8({
      stringUtf8: 'テスト',
      callbackUrl: 'cb',
      method: 'get',
      publicKey: 'pk',
      node: 'n',
    })
    expect(locationMock.href).toContain('data=E38386E382B9E38388')
    expect(locationMock.href).toContain('type=request_sign_utf8')
    expect(locationMock.href).toContain('callback=6362')
    expect(locationMock.href).toContain('set_public_key=pk')
    expect(locationMock.href).toContain('node=n')
  })
})

describe('aliceRequestSignBinaryHex', () => {
  it('location.hrefに正しいURLがセットされる', async () => {
    await aliceRequestSignBinaryHex({
      binaryData: new Uint8Array([0xAA, 0xBB]),
      callbackUrl: 'cb',
      method: 'get',
      publicKey: 'pk',
      node: 'n',
    })
    expect(locationMock.href).toContain('data=AABB')
    expect(locationMock.href).toContain('type=request_sign_binary_hex')
    expect(locationMock.href).toContain('callback=6362')
    expect(locationMock.href).toContain('set_public_key=pk')
    expect(locationMock.href).toContain('node=n')
  })
})

describe('aliceRequestSignBatches', () => {
  it('location.hrefにバッチデータが含まれる', async () => {
    await aliceRequestSignBatches({
      serializedTransactions: [new Uint8Array([1]), new Uint8Array([2])],
      callbackUrl: 'cb',
      method: 'get',
      publicKey: 'pk',
      node: 'n',
    })
    expect(locationMock.href).toContain('batch0=01')
    expect(locationMock.href).toContain('batch1=02')
    expect(locationMock.href).toContain('type=request_sign_batches')
    expect(locationMock.href).toContain('callback=6362')
    expect(locationMock.href).toContain('set_public_key=pk')
    expect(locationMock.href).toContain('node=n')
  })
})

describe('aliceRequestPublicKey', () => {
  it('location.hrefに公開鍵リクエストが含まれる', async () => {
    await aliceRequestPublicKey({ callbackUrl: 'cb' })
    expect(locationMock.href).toContain('type=request_pubkey')
    expect(locationMock.href).toContain('callback=6362')
  })
})

describe('aliceGetResponseGet', () => {
  let search = ''
  let pathname = '/testpath'
  let replaceStateMock: any

  beforeEach(() => {
    search = ''
    pathname = '/testpath'
    replaceStateMock = vi.fn()
    // windowとdocumentを両方stubする必要がある
    const win: any = {
      location: { search, pathname },
      history: { replaceState: replaceStateMock },
      document: { title: 'title' }
    }
    vi.stubGlobal('window', win)
    vi.stubGlobal('document', { title: 'title' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function setSearch(s: string) {
    search = s
    const win: any = {
      location: { search, pathname },
      history: { replaceState: replaceStateMock },
      document: { title: 'title' }
    }
    vi.stubGlobal('window', win)
    vi.stubGlobal('document', { title: 'title' })
  }

  it('エラーの場合', () => {
    setSearch('?error=err')
    expect(aliceGetResponseGet()).toEqual({ error: 'err' })
    expect(replaceStateMock).toHaveBeenCalledWith({}, 'title', '/testpath')
  })

  it('署名済みペイロードの場合', () => {
    setSearch('?signed_payload=abc&pubkey=pk&network=net&signed_hash_lock_payload=hl')
    expect(aliceGetResponseGet()).toEqual({
      signedPayload: 'abc',
      pubkey: 'pk',
      network: 'net',
      signedHashLockPayload: 'hl',
    })
    expect(replaceStateMock).toHaveBeenCalledWith({}, 'title', '/testpath')
  })

  it('署名（UTF8）の場合', () => {
    setSearch('?signature=sig&original_data=od&network=net')
    expect(aliceGetResponseGet()).toEqual({
      signature: 'sig',
      originalData: 'od',
      network: 'net',
    })
    expect(replaceStateMock).toHaveBeenCalledWith({}, 'title', '/testpath')
  })

  it('バッチ署名の場合', () => {
    setSearch('?signed0=a&signed1=b&pubkey=pk')
    expect(aliceGetResponseGet()).toEqual({
      signedPayloads: ['a', 'b'],
      pubkey: 'pk',
    })
    expect(replaceStateMock).toHaveBeenCalledWith({}, 'title', '/testpath')
  })

  it('公開鍵のみの場合', () => {
    setSearch('?pubkey=pk&network=net')
    expect(aliceGetResponseGet()).toEqual({
      pubkey: 'pk',
      network: 'net',
    })
    expect(replaceStateMock).toHaveBeenCalledWith({}, 'title', '/testpath')
  })

  it('該当しない場合はnull', () => {
    setSearch('')
    expect(aliceGetResponseGet()).toBeNull()
    expect(replaceStateMock).toHaveBeenCalledWith({}, 'title', '/testpath')
  })
})
