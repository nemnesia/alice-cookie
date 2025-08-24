import { describe, it, expect } from 'vitest'
import { utf8ToHex, uint8ToHex } from './convert'

// utf8ToHex のテスト
describe('utf8ToHex', () => {
  it('ASCII文字列を16進数に変換できる', () => {
    expect(utf8ToHex('hello')).toBe('68656C6C6F')
  })

  it('日本語文字列を16進数に変換できる', () => {
    expect(utf8ToHex('あ')).toBe('E38182')
    expect(utf8ToHex('テスト')).toBe('E38386E382B9E38388')
  })

  it('空文字列は空文字列を返す', () => {
    expect(utf8ToHex('')).toBe('')
  })
})

// uint8ToHex のテスト
describe('uint8ToHex', () => {
  it('Uint8Arrayを16進数に変換できる', () => {
    expect(uint8ToHex(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]))).toBe('68656C6C6F')
  })

  it('空のUint8Arrayは空文字列を返す', () => {
    expect(uint8ToHex(new Uint8Array([]))).toBe('')
  })

  it('日本語のバイト列も正しく変換できる', () => {
    // "あ" のUTF-8バイト列: [0xE3, 0x81, 0x82]
    expect(uint8ToHex(new Uint8Array([0xE3, 0x81, 0x82]))).toBe('E38182')
  })
})
