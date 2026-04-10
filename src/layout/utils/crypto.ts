/**
 * 加密工具类
 * 基于 crypto-js 封装常用的加密解密方法
 *
 * @format
 */

import CryptoJS from "crypto-js";

// 默认密钥（建议从环境变量读取）
const DEFAULT_SECRET_KEY =
  import.meta.env.VITE_CRYPTO_SECRET_KEY || "react19-ts-default-key";

/**
 * AES 加密
 * @param data 待加密的数据
 * @param secretKey 密钥（可选，默认使用 DEFAULT_SECRET_KEY）
 * @returns 加密后的字符串
 */
export const encryptAES = (
  data: string,
  secretKey: string = DEFAULT_SECRET_KEY
): string => {
  try {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  } catch (error) {
    console.error("AES 加密失败:", error);
    return "";
  }
};

/**
 * AES 解密
 * @param ciphertext 加密后的字符串
 * @param secretKey 密钥（可选，默认使用 DEFAULT_SECRET_KEY）
 * @returns 解密后的原始数据
 */
export const decryptAES = (
  ciphertext: string,
  secretKey: string = DEFAULT_SECRET_KEY
): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("AES 解密失败:", error);
    return "";
  }
};

/**
 * MD5 加密（不可逆）
 * @param data 待加密的数据
 * @returns MD5 哈希值
 */
export const encryptMD5 = (data: string): string => {
  return CryptoJS.MD5(data).toString();
};

/**
 * SHA256 加密（不可逆）
 * @param data 待加密的数据
 * @returns SHA256 哈希值
 */
export const encryptSHA256 = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};

/**
 * Base64 编码
 * @param data 待编码的数据
 * @returns Base64 编码后的字符串
 */
export const encodeBase64 = (data: string): string => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
};

/**
 * Base64 解码
 * @param base64String Base64 编码的字符串
 * @returns 解码后的原始数据
 */
export const decodeBase64 = (base64String: string): string => {
  return CryptoJS.enc.Base64.parse(base64String).toString(CryptoJS.enc.Utf8);
};

/**
 * 加密对象（先转 JSON 再 AES 加密）
 * @param obj 待加密的对象
 * @param secretKey 密钥（可选）
 * @returns 加密后的字符串
 */
export const encryptObject = (obj: any, secretKey?: string): string => {
  try {
    const jsonString = JSON.stringify(obj);
    return encryptAES(jsonString, secretKey);
  } catch (error) {
    console.error("对象加密失败:", error);
    return "";
  }
};

/**
 * 解密对象（先 AES 解密再解析 JSON）
 * @param ciphertext 加密后的字符串
 * @param secretKey 密钥（可选）
 * @returns 解密后的对象
 */
export const decryptObject = <T = any>(
  ciphertext: string,
  secretKey?: string
): T | null => {
  try {
    const jsonString = decryptAES(ciphertext, secretKey);
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("对象解密失败:", error);
    return null;
  }
};

/**
 * 生成随机密钥
 * @param length 密钥长度（默认 32）
 * @returns 随机密钥字符串
 */
export const generateRandomKey = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length / 2).toString();
};

/**
 * HMAC-SHA256 签名
 * @param data 待签名的数据
 * @param secretKey 密钥
 * @returns 签名字符串
 */
export const signHmacSHA256 = (
  data: string,
  secretKey: string = DEFAULT_SECRET_KEY
): string => {
  return CryptoJS.HmacSHA256(data, secretKey).toString();
};

/**
 * 验证 HMAC-SHA256 签名
 * @param data 原始数据
 * @param signature 签名
 * @param secretKey 密钥
 * @returns 是否验证通过
 */
export const verifyHmacSHA256 = (
  data: string,
  signature: string,
  secretKey: string = DEFAULT_SECRET_KEY
): boolean => {
  const computedSignature = signHmacSHA256(data, secretKey);
  return computedSignature === signature;
};

// 默认导出
export default {
  encryptAES,
  decryptAES,
  encryptMD5,
  encryptSHA256,
  encodeBase64,
  decodeBase64,
  encryptObject,
  decryptObject,
  generateRandomKey,
  signHmacSHA256,
  verifyHmacSHA256,
};
