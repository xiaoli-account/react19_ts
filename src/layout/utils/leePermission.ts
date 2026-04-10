/** @format */

import type { RouteItem } from "../router/router-type";
import { permission } from "@/config/react19_ts_config.json";

/**
 * api权限开关
 * @description true开启校验 false关闭校验
 */
let apiPermEnabled = false;
/**
 * 按钮级权限开关
 * @description true开启校验 false关闭校验
 */
let btnPermEnabled = true;
/**
 * 路由级权限开关
 * @description true开启校验 false关闭校验
 */
let routePermEnabled = true;
/**
 * 最大数据量限制
 * < maxLimit. 小数据 for
 * > maxLimit. 中数据 map
 * > 10k. 大数据 set
 */
const maxLimit = 100;
/**
 * 是否已经初始化权限系统
 */
let isInit = false;
/**
 * 白名单配置
 */
const whiteList = {
  api: [
    "/login",
    "/logout",
    "/user/registerUser",
    "/getUserInfo",
    "/validateToken",
    "/user/validateUserPassword",
    "/user/updatePassword",
    "/user/findUserById",
    "/user/update",
    "/user/pageList",
    "/user/saveOrUpdateUser",
    "/user/deleteUserCascade",
  ],
  btn: [
    "btn:login:login",
    "btn:login:logout",
    "btn:register:registerUser",
    "btn:profile:getUserInfo",
    "btn:profile:editUserInfo",
  ],
  page: [
    "page:loading",
    "page:login",
    "page:register",
    "page:login-dark",
    "page:error401",
    "page:error403",
    "page:error404",
    "page:error500",
    "page:error502",
    "page:error503",
    "page:error504",
    "page:profile",
    "page:layout",
    "page:dashboard",

    "page:system-management",
    "page:system:user",
    "page:system:role",
    "page:system:menu",
    "page:system:sso",
    "page:system:dict",
    "page:system:dict-data",
    "page:system:notice",
    "page:system:log",
    "page:system:document-center",
    "page:examples",
    "page:examples:basic",
    "page:examples:ajax",
    "page:examples:sse",
    "page:examples:websocket",
    "page:examples:logicflow",
    "page:examples:reactflow",
    "page:examples:large-screen-visualization",
    "page:examples:table",
    "page:examples:form",
    "page:examples:chart",
  ],
};

/**
 * 权限控制文件
 * 当前查询方式：小数据数组变历，100+数据Map查询，可拓展：10000+数据Set查询
 *
 * 页面级权限控制使用说明：
 * const allRoutes = filterRoutesByPerm(staticWebRoutes, asyncServerRoutes); // 1、后台动态路由控制模式
 * const allRoutes = filterRoutesByPerm(staticWebRoutes); // 2、后台权限标识控制模式
 *
 * 按钮级权限控制使用说明
 * const hasPermission = hasPermission("page:profile");
 *
 * API接口权限控制使用说明
 * const hasApiPermission = hasApiPermission("api:/login");
 */

/**
 * 静态路由权限列表
 */
let staticRoutesPermissionList: string[] = [...whiteList.page];
/**
 * 动态路由权限列表
 * 以下数据为系统内置路由权限标识，如需添加请在permission配置中添加
 * 下方数据仅作使用参考，如需内置权限请通过 initLeePermission初始化函数或whiteList.page白名单配置
 */
let asyncRoutesPermissionList: string[] = [
  "page:system-management",
  "page:system:user",
  "page:system:role",
  "page:system:menu",
  "page:system:sso",
  "page:system:dict",
  "page:system:dict-data",
  "page:system:notice",
  "page:system:log",
  "page:system:document-center",
  "page:examples",
  "page:examples:basic",
  "page:examples:ajax",
  "page:examples:sse",
  "page:examples:websocket",
  "page:examples:logicflow",
  "page:examples:reactflow",
  "page:examples:large-screen-visualization",
  "page:examples:table",
  "page:examples:form",
  "page:examples:chart",
  // TODO: *** 业务路由权限标识
];

// Map 映射字段，便于大数据量时高效查找
let staticRoutesPermissionMap: Map<string, true> = new Map();
let asyncRoutesPermissionMap: Map<string, true> = new Map();
let routesPermissionUseMap = false; // 是否使用map模式
/**
 * 按钮级权限列表
 * 1、按钮级权限控制使用说明
 * const hasBtnPermission = hasBtnPermission("btn:profile:getUserInfo");
 * 2、权限标识符命名规范
 * 按钮级权限标识符命名规范为：btn:模块名:方法名/按钮名/API接口名称
 */
let btnPermissionList: string[] = [...whiteList.btn];
// Map映射字段，便于大数据量时高效查找
let btnPermissionMap: Map<string, true> = new Map();
let btnPermissionUseMap = false; // 是否使用map模式
/**
 * API接口权限列表-接口级权限(⚠️当按钮调用接口时⚠️)会与按钮级权限作用重合，需要根据实际情况谨慎使用
 * 1、API接口权限控制使用说明
 * const hasApiPermission = hasApiPermission("api:/login");
 * 2、权限标识符命名规范
 * API接口权限标识符命名规范为：api:/API接口全称
 */
let apiPermissionList: string[] = [
  "/login",
  "/logout",
  "/user/registerUser",
  "/getUserInfo",
  "/validateToken",
  "/user/validateUserPassword",
  "/user/updatePassword",
  "/user/findUserById",
  "/user/update",
  "/user/pageList",
  "/user/saveOrUpdateUser",
  "/user/deleteUserCascade",
];
let apiPermissionMap: Map<string, true> = new Map();
let apiPermissionUseMap = false; // 是否使用map模式

/**
 * API接口白名单
 * 合并配置文件中的白名单和默认白名单
 */
const apiWhiteList: string[] = [
  ...new Set([...whiteList.api, ...(permission?.apiWhiteList || [])]),
];

/**
 * 清理字符串中的零宽字符（zero-width characters）
 * @param str 输入字符串
 * @returns 清理后的字符串
 */
const cleanZeroWidthChars = (str: string): string => {
  // 移除零宽字符：U+200B (ZWSP), U+200C (ZWNJ), U+200D (ZWJ), U+FEFF (BOM) 等
  return str.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
};

/**
 * 权限系统初始化配置类型
 */
export interface InitLeePermissionConfigType {
  /**
   * 路由页面权限列表
   */
  pagePermissionList?: string[];
  /**
   * 按钮级权限列表
   */
  btnPermissionList?: string[];
  /**
   * API接口权限列表
   */
  apiPermissionList?: string[];
  /**
   * API接口白名单
   */
  apiWhiteList?: string[];
  /**
   * API接口权限校验开关
   * true开启 false关闭
   */
  apiPermEnabled?: boolean;
  /**
   * 按钮级权限校验开关
   * true开启 false关闭
   */
  btnPermEnabled?: boolean;
  /**
   * 页面级权限校验开关
   * true开启 false关闭
   */
  routePermEnabled?: boolean;
  /**
   * 权限系统初始化类型
   */
  type?: "layout" | "refresh";
}

/**
 * 权限系统初始化配置
 * @param option 权限系统初始化配置
 */
export function initLeePermission(option?: InitLeePermissionConfigType) {
  if (isInit && option?.type === "refresh") {
    console.warn(
      "权限系统已经初始化，跳过初始化"
      // asyncRoutesPermissionMap,
      // asyncRoutesPermissionList
    );
    return;
  }
  isInit = true;
  console.warn("查看权限系统初始化配置", option);

  // 集中合并权限配置，避免重复合并
  if (option?.pagePermissionList) {
    option.pagePermissionList = [
      ...whiteList.page,
      ...(permission?.pageWhiteList || []),
      ...option.pagePermissionList.map(cleanZeroWidthChars), // 清理零宽字符
    ];
  }
  if (option?.btnPermissionList) {
    option.btnPermissionList = [
      ...whiteList.btn,
      ...(permission?.btnWhiteList || []),
      ...option.btnPermissionList.map(cleanZeroWidthChars), // 清理零宽字符
    ];
  }
  if (option?.apiPermissionList) {
    option.apiPermissionList = [
      ...apiWhiteList,
      ...option.apiPermissionList.map(cleanZeroWidthChars), // 清理零宽字符
    ];
  }

  // 注意：这里需要修改全局变量，而不是 shadowing 局部变量
  if (option?.pagePermissionList) {
    routesPermissionUseMap = false;
    asyncRoutesPermissionList = [];
    asyncRoutesPermissionList.length = 0;

    if (option.pagePermissionList.length > maxLimit) {
      routesPermissionUseMap = true;
      // 只用Map存储
      asyncRoutesPermissionMap = new Map(
        option.pagePermissionList.map((k) => [k, true])
      );
    } else {
      option.pagePermissionList.forEach((p) => {
        asyncRoutesPermissionList.push(p);
      });
    }
  }
  if (option?.btnPermissionList) {
    btnPermissionUseMap = false;
    btnPermissionList = [];
    btnPermissionList.length = 0;

    // 先判断数据量，直接决定用数组还是Map
    if (option.btnPermissionList.length > maxLimit) {
      btnPermissionUseMap = true;
      btnPermissionMap = new Map(
        option.btnPermissionList.map((k) => [k, true])
      );
      // 只用Map存储
    } else {
      option.btnPermissionList.forEach((p) => {
        btnPermissionList.push(p);
      });
    }
  }
  if (option?.apiPermissionList) {
    apiPermissionUseMap = false;
    apiPermissionList = [];
    apiPermissionList.length = 0;
    if (option.apiPermissionList.length > maxLimit) {
      apiPermissionUseMap = true;
      apiPermissionMap = new Map(
        option.apiPermissionList.map((k) => [k, true])
      );
    } else {
      option.apiPermissionList.forEach((p) => {
        apiPermissionList.push(p);
      });
    }
  }

  // 权限是否使用-开关
  if (option?.apiPermEnabled) {
    apiPermEnabled = true;
  } else {
    apiPermEnabled = false;
  }
  if (option?.btnPermEnabled) {
    btnPermEnabled = true;
  } else {
    btnPermEnabled = false;
  }
  if (option?.routePermEnabled) {
    routePermEnabled = true;
  } else {
    routePermEnabled = false;
  }

  console.warn("权限系统初始化配置=>success");
}

/**
 * 权限码判空专用
 * @param value 权限码
 * @returns boolean
 */
const isPermissionNull = (value: string | Array<string>) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return ["", "null", "undefined", null, undefined].includes(value);
  }
};

/**
 * 判断是否有页面级路由权限
 * @param permission 路由权限标识
 * @returns boolean
 */
export function hasRoutePermission(permission: string): boolean {
  if (!routePermEnabled) return true;
  if (isPermissionNull(permission)) return false;
  // 数据量大于maxLimit时用Map，否则用includes
  if (routesPermissionUseMap) {
    return (
      staticRoutesPermissionMap.has(permission) ||
      asyncRoutesPermissionMap.has(permission)
    );
  } else {
    return (
      staticRoutesPermissionList.includes(permission) ||
      asyncRoutesPermissionList.includes(permission)
    );
  }
}
/**
 * 判断是否有按钮级权限
 * @param permission 按钮权限标识
 * @returns boolean
 */
export function hasBtnPermission(permission: string): boolean {
  if (!btnPermEnabled) return true;
  if (isPermissionNull(permission)) return false;
  if (btnPermissionUseMap) {
    return btnPermissionMap.has(permission);
  } else {
    return btnPermissionList.includes(permission);
  }
}

/**
 * 判断是否有**任意一个**按钮级权限
 * @param permissions 按钮权限标识数组
 * @returns boolean
 */
export function hasAnyBtnPermission(permissions: string[]): boolean {
  if (!btnPermEnabled) return true;
  if (isPermissionNull(permissions)) return false;
  if (btnPermissionUseMap) {
    return permissions.some((p) => btnPermissionMap.has(p));
  } else {
    return permissions.some((p) => btnPermissionList.includes(p));
  }
}

/**
 * 判断是否有**所有**按钮级权限
 * @param permissions 按钮权限标识数组
 * @returns boolean
 */
export function hasAllBtnPermission(permissions: string[]): boolean {
  if (!btnPermEnabled) return true;
  if (isPermissionNull(permissions)) return false;
  if (btnPermissionUseMap) {
    return permissions.every((p) => btnPermissionMap.has(p));
  } else {
    return permissions.every((p) => btnPermissionList.includes(p));
  }
}

/**
 * 判断是否有接口级权限
 * @param permission api权限标识
 * @returns boolean
 */
export function hasApiPermission(permission: string): boolean {
  if (!apiPermEnabled) return true;
  if (!permission) return false;

  // 1. 处理请求路径（去除查询参数，确保匹配精确）
  const path = permission.split("?")[0];

  // 2. 检查是否在白名单中，白名单中的接口跳过权限验证
  // 支持前缀匹配判断，用于兼容像 /system/menu/detail/1 或 /system/menu/update/1 这种带动态参数的 RESTful URL
  const isWhiteListed = apiWhiteList.some(
    (whiteUrl) =>
      path === whiteUrl ||
      permission === whiteUrl ||
      // 如果白名单项支持类似模板结构，做对应的匹配兼容
      (whiteUrl.endsWith("/{*}")
        ? path.startsWith(whiteUrl.replace("/{*}", "/"))
        : path.startsWith(whiteUrl + "/"))
  );

  if (isWhiteListed) {
    // console.log(`[API Permission] 接口 ${path} 在白名单中，跳过权限验证`);
    return true;
  }

  if (apiPermissionUseMap) {
    return apiPermissionMap.has(path) || apiPermissionMap.has(permission);
  } else {
    return (
      apiPermissionList.includes(path) || apiPermissionList.includes(permission)
    );
  }
}

/**
 * API接口权限注解装饰器
 * 用于在方法调用前检查是否有对应的 API 接口权限
 * @warn ⚠️⚠️⚠️当前注解为一级注解，注解装饰器执行顺序是由上到下执行，所以必须在函数的最外层，否则会发生校验生效但接口仍调用问题
 * @warn ⚠️⚠️⚠️当前注解为一级注解，注解装饰器执行顺序是由上到下执行，所以必须在函数的最外层，否则会发生校验生效但接口仍调用问题
 * @warn ⚠️⚠️⚠️当前注解为一级注解，注解装饰器执行顺序是由上到下执行，所以必须在函数的最外层，否则会发生校验生效但接口仍调用问题
 * @param permission API权限标识符（格式：以api调用时的接口路径为准，如： /login）
 * @returns 装饰器函数
 *
 * @example
 * ```typescript
 * class LoginService {
 *   @RequireApiPermission("/login")
 *   login(data: LoginInfo) {
 *     return $post("/login", data);
 *   }
 * }
 * ```
 */
export function LeeApiPermission(permission: string) {
  return function <This, Args extends any[], Return>(
    originalMethod: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: This, ...args: Args): Return {
      // 1. 检查权限
      const hasPermission = hasApiPermission(permission);

      if (!hasPermission) {
        // 记录权限检查失败日志
        // console.warn(
        //   `[API Permission Denied] Method: ${methodName}, Permission: ${permission}`
        // );

        // 构造权限错误
        const error = new Error(`您没有权限访问此接口: ${permission}`);
        (error as any).code = "PERMISSION_DENIED";
        (error as any).permission = permission;
        (error as any).method = methodName;

        throw error;
      }

      // 3. 有权限，正常执行方法
      // console.log(
      //   `[API Permission] Method: ${methodName}, Permission: ${permission} - 验证通过`
      // );
      return originalMethod.call(this, ...args);
    }

    return replacementMethod;
  };
}

/**
 * 过滤路由-权限控制-使用有权限的路由
 * 两种页面级权限控制模式，分别是权限标识控制（前端存储全部路由配置，由后台传入的权限标识进行过滤路由配置）和动态路由控制（后端存储全部路由配置）
 * 1、前端控制路由配置 filterRoutesByPerm(staticWebRoutes)
 * 2、后端控制路由配置 filterRoutesByPerm(staticWebRoutes，asyncServerRoutes)
 * @param routes 路由
 * @returns 权限过滤后的路由
 */
export function filterRoutesByPerm(
  staticWebRoutes: RouteItem[],
  asyncServerRoutes?: RouteItem[]
): RouteItem[] {
  // 合并前端静态路由和后端动态路由
  const allRoutes = [...staticWebRoutes, ...(asyncServerRoutes ?? [])];
  // 有后端路由参与则默认取后端路由权限标识，否则取前端路由权限标识
  // console.log("过滤有权限的路由", allRoutes);
  // 开始过滤路由，筛选出有权限的路由，返回过滤后的路由配置使用
  const dfs = (rs: RouteItem[]): RouteItem[] =>
    rs
      .map((r) => {
        const children = r.children ? dfs(r.children) : undefined;
        const ok =
          !r.meta?.pagePermission || hasRoutePermission(r.meta.pagePermission);
        if (!ok) return null;
        return { ...r, children };
      })
      .filter(Boolean) as RouteItem[];

  return dfs(allRoutes);
}
