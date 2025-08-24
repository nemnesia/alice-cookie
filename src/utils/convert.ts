/**
 * UTF8文字列を16進数文字列に変換する関数（Buffer非依存）
 * @param str 変換したいUTF8文字列
 * @returns 16進数文字列
 */
export function utf8ToHex(str: string): string {
  return Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Uint8Arrayを16進文字列に変換
 * @param bytes 変換したいUint8Array
 * @returns 16進数文字列
 */
export function uint8ToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}
