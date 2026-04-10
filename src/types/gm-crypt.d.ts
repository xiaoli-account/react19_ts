/** @format */

declare module "gm-crypt" {
  export class sm4 {
    constructor(config: SM4Config);
    encrypt(plaintext: string): string;
    decrypt(ciphertext: string): string;
  }

  export interface SM4Config {
    key: string;
    mode: "ecb" | "cbc";
    iv?: string;
    outType?: "base64" | "text";
  }
}
