/** @format */

// uuid.ts 由ai生成，使用时需注意
// UUID 工具模块，基于 uuid 包 (https://www.npmjs.com/package/uuid)
// 版本: 13.0.0

import {
  v4 as uuidv4,
  v7 as uuidv7,
  v1 as uuidv1,
  v6 as uuidv6,
  v3 as uuidv3,
  v5 as uuidv5,
  validate as uuidValidate,
  version as uuidVersion,
  NIL as NIL_UUID,
  MAX as MAX_UUID,
  parse as uuidParse,
  stringify as uuidStringify,
  v1ToV6,
  v6ToV1,
} from "uuid";

/**
 * UUID 工具类
 * 提供常见的 UUID 生成、验证和转换功能
 */
export class UUID {
  /**
   * 生成一个随机的版本 4 UUID
   * @returns 版本 4 UUID 字符串
   * @example
   * const id = UUID.v4(); // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
   */
  static v4(): string {
    return uuidv4();
  }

  /**
   * 生成一个基于时间戳的版本 7 UUID
   * 推荐用于数据库主键，具有时间排序特性
   * @returns 版本 7 UUID 字符串
   * @example
   * const id = UUID.v7(); // '01695553-c90c-745a-b76f-770d7b3dcb6d'
   */
  static v7(): string {
    return uuidv7();
  }

  /**
   * 生成一个基于时间戳和 MAC 地址的版本 1 UUID
   * @returns 版本 1 UUID 字符串
   */
  static v1(): string {
    return uuidv1();
  }

  /**
   * 生成一个时间戳重排序的版本 6 UUID
   * @returns 版本 6 UUID 字符串
   */
  static v6(): string {
    return uuidv6();
  }

  /**
   * 生成基于命名空间和 MD5 哈希的版本 3 UUID
   * @param name - 名称字符串
   * @param namespace - 命名空间 UUID
   * @returns 版本 3 UUID 字符串
   */
  static v3(name: string, namespace: string): string {
    return uuidv3(name, namespace);
  }

  /**
   * 生成基于命名空间和 SHA-1 哈希的版本 5 UUID
   * @param name - 名称字符串
   * @param namespace - 命名空间 UUID
   * @returns 版本 5 UUID 字符串
   */
  static v5(name: string, namespace: string): string {
    return uuidv5(name, namespace);
  }

  /**
   * 验证字符串是否为有效的 UUID
   * @param uuid - 要验证的字符串
   * @returns 是否为有效 UUID
   * @example
   * UUID.validate('invalid'); // false
   * UUID.validate('6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b'); // true
   */
  static validate(uuid: string): boolean {
    return uuidValidate(uuid);
  }

  /**
   * 检测 UUID 的版本
   * @param uuid - UUID 字符串
   * @returns RFC 版本号 (1-7, 8为实验性)
   * @throws 如果字符串不是有效的 UUID
   */
  static version(uuid: string): number {
    return uuidVersion(uuid);
  }

  /**
   * 专门验证版本 4 (随机) UUID
   * @param uuid - 要验证的 UUID 字符串
   * @returns 是否为有效的版本 4 UUID
   */
  static validateV4(uuid: string): boolean {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
  }

  /**
   * 专门验证版本 7 (时间戳) UUID
   * @param uuid - 要验证的 UUID 字符串
   * @returns 是否为有效的版本 7 UUID
   */
  static validateV7(uuid: string): boolean {
    return uuidValidate(uuid) && uuidVersion(uuid) === 7;
  }

  /**
   * 获取 nil UUID (全零)
   */
  static get NIL(): string {
    return NIL_UUID;
  }

  /**
   * 获取 max UUID (全一)
   */
  static get MAX(): string {
    return MAX_UUID;
  }

  /**
   * 将 UUID 字符串解析为字节数组
   * @param str - UUID 字符串
   * @returns 16字节的 Uint8Array
   */
  static parse(str: string): Uint8Array {
    return uuidParse(str);
  }

  /**
   * 将字节数组转换为 UUID 字符串
   * @param arr - 字节数组
   * @returns UUID 字符串
   */
  static stringify(arr: Uint8Array): string {
    return uuidStringify(arr);
  }

  /**
   * 将版本 1 UUID 转换为版本 6 UUID
   * @param uuid - 版本 1 UUID
   * @returns 版本 6 UUID
   */
  static v1ToV6(uuid: string): string {
    return v1ToV6(uuid);
  }

  /**
   * 将版本 6 UUID 转换为版本 1 UUID
   * @param uuid - 版本 6 UUID
   * @returns 版本 1 UUID
   */
  static v6ToV1(uuid: string): string {
    return v6ToV1(uuid);
  }

  /**
   * 生成多个 UUID
   * @param count - 生成数量
   * @param version - UUID 版本 (默认为 4)
   * @returns UUID 数组
   */
  static generateMultiple(count: number, version: 4 | 7 = 4): string[] {
    const uuids: string[] = [];
    const generator = version === 7 ? uuidv7 : uuidv4;

    for (let i = 0; i < count; i++) {
      uuids.push(generator());
    }

    return uuids;
  }
}

/**
 * 预定义命名空间 (遵循 RFC 标准)
 */
export const UUIDNamespaces = {
  /**
   * DNS 命名空间 (用于 v3/v5 UUID)
   */
  DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" as const,

  /**
   * URL 命名空间 (用于 v3/v5 UUID)
   */
  URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8" as const,

  /**
   * OID 命名空间 (用于 v3/v5 UUID)
   */
  OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8" as const,

  /**
   * X500 命名空间 (用于 v3/v5 UUID)
   */
  X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8" as const,
};

/**
 * 默认导出 UUID 工具类
 */
export default UUID;

// 常用函数的直接导出，方便按需导入
export {
  uuidv4,
  uuidv7,
  uuidv1,
  uuidv6,
  uuidv3,
  uuidv5,
  uuidValidate,
  uuidVersion,
  NIL_UUID,
  MAX_UUID,
  uuidParse,
  uuidStringify,
  v1ToV6,
  v6ToV1,
};
