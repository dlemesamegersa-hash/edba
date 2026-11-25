import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';

const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');

// NOTE: reads the whole file into memory. Fine for small/medium files; very large PDFs
// must be tested on a real low-end device before relying on this (see README "Known limits").
export async function sha256OfFile(uri) {
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return toHex(await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, bytes));
}
