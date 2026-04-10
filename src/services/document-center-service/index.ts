/** @format */

import {
  LeeLoggerMethod,
  OPERATION_TYPE,
  LOG_LEVEL,
} from "@/layout/utils/leeLogger";

export interface DocumentRecord {
  id: string;
  name: string;
  path: string;
  type: "Project" | "AI";
  contentLoader: () => Promise<string>;
}

export class DocumentService {
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  async getDocuments(): Promise<DocumentRecord[]> {
    // 使用 import.meta.glob 获取文件
    // 注意：glob 的 pattern 必须是静态字符串
    const projectDocs = import.meta.glob(
      ["../../../docs/**/*.md", "!../../../docs/ai_docs/**/*.md"],
      {
        query: "?raw",
        import: "default",
      }
    );

    const aiDocs = import.meta.glob("../../../docs/ai_docs/**/*.md", {
      query: "?raw",
      import: "default",
    });

    const docs: DocumentRecord[] = [];

    // 处理项目文档
    for (const [path, loader] of Object.entries(projectDocs)) {
      const name = path.split("/").pop() || "";
      // 移除相对路径前缀，使其更美观
      const displayPath = path.replace("../../../", "");

      docs.push({
        id: path,
        name,
        path: displayPath,
        type: "Project",
        contentLoader: loader as () => Promise<string>,
      });
    }

    // 处理 AI 文档
    for (const [path, loader] of Object.entries(aiDocs)) {
      const name = path.split("/").pop() || "";
      const displayPath = path.replace("../../../", "");

      docs.push({
        id: path,
        name,
        path: displayPath,
        type: "AI",
        contentLoader: loader as () => Promise<string>,
      });
    }

    return docs;
  }
}
