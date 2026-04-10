/**
 * vite-plugin-obfuscator 类型声明
 *
 * @format
 */

declare module "vite-plugin-obfuscator" {
  import { Plugin } from "vite";

  interface ObfuscatorOptions {
    compact?: boolean;
    controlFlowFlattening?: boolean;
    controlFlowFlatteningThreshold?: number;
    deadCodeInjection?: boolean;
    deadCodeInjectionThreshold?: number;
    debugProtection?: boolean;
    debugProtectionInterval?: number;
    disableConsoleOutput?: boolean;
    identifierNamesGenerator?: "hexadecimal" | "mangled" | "dictionary";
    identifiersDictionary?: string[];
    identifiersPrefix?: string;
    inputFileName?: string;
    log?: boolean;
    numbersToExpressions?: boolean;
    renameGlobals?: boolean;
    renameProperties?: boolean;
    renamePropertiesMode?: "safe" | "unsafe";
    reservedNames?: string[];
    reservedStrings?: string[];
    seed?: number;
    selfDefending?: boolean;
    simplify?: boolean;
    sourceMap?: boolean;
    sourceMapBaseUrl?: string;
    sourceMapFileName?: string;
    sourceMapMode?: "separate" | "inline";
    sourceMapSourcesMode?: "sources-content" | "sources";
    splitStrings?: boolean;
    splitStringsChunkLength?: number;
    stringArray?: boolean;
    stringArrayCallsTransform?: boolean;
    stringArrayCallsTransformThreshold?: number;
    stringArrayEncoding?: Array<"none" | "base64" | "rc4">;
    stringArrayIndexesType?: Array<
      "hexadecimal-number" | "hexadecimal-numeric-string"
    >;
    stringArrayIndexShift?: boolean;
    stringArrayRotate?: boolean;
    stringArrayShuffle?: boolean;
    stringArrayWrappersCount?: number;
    stringArrayWrappersChainedCalls?: boolean;
    stringArrayWrappersParametersMaxCount?: number;
    stringArrayWrappersType?: "variable" | "function";
    stringArrayThreshold?: number;
    target?: "browser" | "browser-no-eval" | "node";
    transformObjectKeys?: boolean;
    unicodeEscapeSequence?: boolean;
  }

  interface ObfuscatorConfig {
    options?: ObfuscatorOptions;
    include?: string | RegExp | Array<string | RegExp>;
    exclude?: string | RegExp | Array<string | RegExp>;
    apply?: "build" | "serve";
  }

  export function viteObfuscateFile(config?: ObfuscatorConfig): Plugin;
}
