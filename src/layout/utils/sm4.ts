/**
 * 国密SM4加密解密工具类
 *
 * @format
 */

import { sm4 } from "gm-crypt";

// 此处的秘钥需要与后台一致
const pwdKey: string = "Rt1U5i1po1(0*^3&";

interface SM4Config {
  key: string;
  mode: "ecb" | "cbc"; // 修复类型定义，明确指定模式选项
  cipherType: "base64" | "text"; // 修复类型定义，明确指定输出类型选项
}

/**
 * SM4加密
 * @param data 需要加密的数据
 * @returns 加密后的数据
 */
export function encryptBySm4(data: string): string {
  const sm4Config: SM4Config = {
    key: pwdKey,
    mode: "ecb", // 明确指定为 'ecb'
    cipherType: "base64", // 明确指定为 'base64'
  };
  const sm4Util = new sm4(sm4Config);
  return sm4Util.encrypt(data);
}
/**
 * SM4解密
 * @param data 需要解密的数据
 * @returns 解密后的数据
 */
export function decryptBySm4(data: string): string {
  const sm4Config: SM4Config = {
    key: pwdKey,
    mode: "ecb", // 明确指定为 'ecb'
    cipherType: "base64", // 明确指定为 'base64'
  };
  const sm4Util = new sm4(sm4Config);
  return sm4Util.decrypt(data);
}
