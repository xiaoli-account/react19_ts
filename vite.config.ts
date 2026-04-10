import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';
import { viteObfuscateFile } from 'vite-plugin-obfuscator';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());
  const outDir = env.VITE_DIST_PATH || 'dist';
  const runMode = mode;
  const isDev = runMode === "development";
  const isProd = runMode === "production";
  const isMock = runMode === "mock";
  const isOther = runMode !== "development" && runMode !== "production";
  console.log("正在运行环境:" + runMode);
  console.log(new Date(), "读取" + runMode + "环境变量:", env);

  return {
    // 设置相对路径 HashRouter哈希路由模式
    // base: './',
    // 设置绝对路径  BrowserRouter 路由模式
    base: '/react19_ts/',
    // 配置 esbuild 支持新版装饰器（Stage 3）
    esbuild: {
      target: 'es2022',
      // 发布环境移除 console 和 debugger
      drop: isProd ? ['console', 'debugger'] : [],
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: false,
          useDefineForClassFields: true,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      // 生产环境代码混淆
      // 暂时注释掉混淆插件
      // 混淆插件 vite-plugin-obfuscator 与 Vite 7 存在兼容性问题
      // isProd &&
      //   ((options) => {
      //     const plugin = viteObfuscateFile(options);
      //     if (plugin.transformIndexHtml && (plugin.transformIndexHtml as any).transform) {
      //       (plugin.transformIndexHtml as any).handler = (plugin.transformIndexHtml as any).transform;
      //     }
      //     return plugin;
      //   })({
      //     options: {
      //       compact: true, // 压缩代码
      //       controlFlowFlattening: false, // 控制流扁平化（会增加体积）
      //       deadCodeInjection: false, // 死代码注入（会增加体积）
      //       debugProtection: false, // 调试保护
      //       debugProtectionInterval: 0,
      //       disableConsoleOutput: true, // 禁用 console 输出
      //       identifierNamesGenerator: 'hexadecimal' as any, // 标识符名称生成器
      //       log: false,
      //       numbersToExpressions: false, // 数字转表达式
      //       renameGlobals: false, // 重命名全局变量
      //       selfDefending: true, // 自我防御
      //       simplify: true, // 简化代码
      //       splitStrings: false, // 分割字符串
      //       stringArray: true, // 字符串数组化
      //       stringArrayCallsTransform: false,
      //       stringArrayEncoding: ['base64'] as any, // 字符串数组编码
      //       stringArrayIndexShift: true,
      //       stringArrayRotate: true,
      //       stringArrayShuffle: true,
      //       stringArrayWrappersCount: 1,
      //       stringArrayWrappersChainedCalls: true,
      //       stringArrayWrappersParametersMaxCount: 2,
      //       stringArrayWrappersType: 'variable',
      //       stringArrayThreshold: 0.75, // 字符串数组化阈值
      //       unicodeEscapeSequence: false, // Unicode 转义
      //     },
      //   } as any),
      // 自定义插件：打包完成后拷贝 package.json 文件
      {
        name: 'copy-package-json-plugin',
        apply: 'build' as const,
        closeBundle() {
          const src = path.resolve(__dirname, 'package.json');
          const dest = path.resolve(__dirname, outDir, 'package.json');

          if (fs.existsSync(src)) {
            try {
              fs.copyFileSync(src, dest);
              console.log(`\n✨ [copy-package-json-plugin] Successfully copied "package.json" to "${outDir}/package.json"`);
            } catch (err) {
              console.error(`\n❌ [copy-package-json-plugin] Failed to copy "package.json":`, err);
            }
          }
        },
      },
      // 自定义插件：打包完成后拷贝 docs 目录
      {
        name: 'copy-docs-plugin',
        apply: 'build' as const, // 明确指定为 'build' 类型
        closeBundle() {
          const src = path.resolve(__dirname, 'docs');
          const dest = path.resolve(__dirname, outDir, 'docs');
          // 校验目录是否存在 dist/docs
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }

          if (fs.existsSync(src)) {
            try {
              // recursive: true 表示递归拷贝，force: true 表示强制覆盖
              fs.cpSync(src, dest, { recursive: true, force: true });
              console.log(`\n✨ [copy-docs-plugin] Successfully copied "docs" to "${outDir}/docs"`);
            } catch (err) {
              console.error(`\n❌ [copy-docs-plugin] Failed to copy "docs":`, err);
            }
          }
        },
      },
      // 自定义插件：打包完成后继续将webview目录下的外部资源拷贝到dist目录下，为项目提供iframe网页嵌入容器
      {
        name: 'copy-webview-plugin',
        // 制定插件仅在生产环境执行
        // apply: 'build' as const,

        // 开发环境代理：拦截并处理所有包含 webview 的请求，支持路径转换以避免 404
        configureServer(server: any) {

          // 获取文件内容类型
          const getContentType = (filePath: string) => {
            const ext = path.extname(filePath).toLowerCase();
            const mimeMap: Record<string, string> = {
              '.html': 'text/html',
              '.js': 'application/javascript',
              '.ts': 'application/javascript', // 处理可能的 .ts 文件请求
              '.css': 'text/css',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
              '.ico': 'image/x-icon',
              '.json': 'application/json',
              '.md': 'text/markdown',
            };
            return mimeMap[ext] || 'application/octet-stream';
          };

          server.middlewares.use((req: any, res: any, next: any) => {
            const url = decodeURIComponent(req.url || '');
            
            // 使用正则匹配 webview 及其后续路径
            // 兼容多种前缀情况：/webview/..., /login/webview/..., webview/...
            const match = url.match(/(?:\/|^)webview\/(.*)/);
            
            if (match) {
              const relativePath = match[1].split('?')[0]; // 移除查询参数
              const filePath = path.join(__dirname, 'src/webview', relativePath);
              
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                res.setHeader('Content-Type', getContentType(filePath));
                res.end(fs.readFileSync(filePath));
                return;
              } else if (url.includes('/webview/')) {
                 console.warn(`\n⚠️ [webview-dev-proxy] Resource not found: ${filePath} (URL: ${url})`);
              }
            }
            next();
          });
        },
        closeBundle() {
          const src = path.resolve(__dirname, 'src/webview');
          const dest = path.resolve(__dirname, outDir, 'webview');

          if (fs.existsSync(src)) {
            try {
          // 校验目录是否存在 dist/webview
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
              // 仅递归拷贝 html\js\ts\css 文件
              fs.cpSync(src, dest, {
                recursive: true,
                force: true,
                filter: (srcPath) => {
                  if (fs.statSync(srcPath).isDirectory()) return true;
                  return ['.html', '.js', '.ts', '.css'].includes(path.extname(srcPath));
                },
              });
              console.log(`\n✨ [copy-webview-plugin] Successfully copied "webview" to "${outDir}/webview"`);
            } catch (err) {
              console.error(`\n❌ [copy-webview-plugin] Failed to copy "webview":`, err);
            }
          }
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@AI': path.resolve(__dirname, './src_ai'),
        '@ai': path.resolve(__dirname, './src_ai'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT) || 4200,
      open: true,
      proxy: {
        // 代理 /dev-api 的请求
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => {
              // 判断当前环境模式
            if (isDev) {
              let requsetUrl = path.replace(new RegExp('^' + env.VITE_API_BASE_URL), '')
              console.log("开发环境代理,接口请求路径：" + env.VITE_APP_API_URL + requsetUrl);
              return requsetUrl;
            } else if (isProd) {
              // console.log("生产环境代理");
              return path;
            } else if (isMock) {
              let requsetUrl = path.replace(new RegExp("^" + env.VITE_API_BASE_URL), "");
              console.log("mock环境代理,接口请求路径：" + env.VITE_APP_API_URL + requsetUrl);
              return requsetUrl;
            } else {
              console.log("其他环境代理,接口请求路径：" + env.VITE_APP_API_URL + path);
              return path;
            }
          }
        },
        // WebSocket 代理
        ...(env.VITE_APP_WS_ENDPOINT && {
          [env.VITE_WS_BASE_URL]: {
            target: env.VITE_APP_WS_ENDPOINT.replace('wss://', 'https://').replace('ws://', 'http://'),
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(new RegExp('^' + env.VITE_WS_BASE_URL), ''),
          },
        }),
        // SSE 代理
        ...(env.VITE_APP_SSE_ENDPOINT && {
          [env.VITE_SSE_BASE_URL]: {
            target: env.VITE_APP_SSE_ENDPOINT,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(new RegExp('^' + env.VITE_SSE_BASE_URL), ''),
          },
        }),
      },
    },
    build: {
      outDir: env.VITE_DIST_PATH || 'dist',
      sourcemap: !isProd,
      // 消除打包大小超过 1000kb 警告
      chunkSizeWarningLimit: 1000,
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 防止大量的静态资源导致过多的 http 请求
      assetsInlineLimit: 4096,
      // Rollup 打包配置
      rollupOptions: {
        external: ["mock","koa-ts-server"], // 忽略指定目录，不会被打包，这里添加koa-ts-server
        output: {
          // 静态资源分类打包
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // 更加细致的分包策略
          manualChunks(id) {

            // 自定义打包插件
            if (id.includes('node_modules')) {
              // 核心框架
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-vendor';
              }
              // UI 组件库
              if (id.includes('antd') || id.includes('@ant-design')) {
                return 'antd-vendor';
              }
              // 图表库 (体积较大)
              if (id.includes('echarts')) {
                return 'echarts-vendor';
              }
              // 流程图库
              if (id.includes('@logicflow')) {
                return 'logicflow-vendor';
              }
              // Markdown/编辑器相关
              if (id.includes('react-markdown') || id.includes('remark-gfm')) {
                return 'markdown-vendor';
              }
              // 国际化
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'i18n-vendor';
              }
              // 通用工具库
              if (
                id.includes('axios') ||
                id.includes('lodash-es') ||
                id.includes('zustand') ||
                id.includes('crypto-js') ||
                id.includes('localforage') ||
                id.includes('js-cookie')
              ) {
                return 'utils-vendor';
              }
              // 其他第三方库
              return 'vendor';
            }
          },
        },
      },
      // 使用 esbuild 压缩（默认，更迅速）
      minify: 'esbuild',
    },
  };
});
