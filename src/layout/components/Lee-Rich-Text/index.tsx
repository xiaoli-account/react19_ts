/** @format */

import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // 使用 snow 主题
import "./index.scss"; // 用于覆盖可能存在的默认样式

// 注册全屏图标
const icons = Quill.import("ui/icons");
icons["fullscreen"] = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;

export interface LeeRichTextProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const LeeRichText: React.FC<LeeRichTextProps> = ({
  value = "",
  onChange,
  placeholder,
  readOnly = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 初始化 Quill 实例
  useEffect(() => {
    if (!containerRef.current) return;

    if (!quillInstanceRef.current) {
      // 创建实际挂载编辑器 DOM 的节点
      const editorTarget = document.createElement("div");
      containerRef.current.appendChild(editorTarget);

      const quill = new Quill(editorTarget, {
        theme: "snow",
        placeholder: placeholder || "请输入内容...",
        readOnly: readOnly,
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ["link", "image"],
              ["clean"], // 清除格式
              ["fullscreen"], // 全屏按钮
            ],
            handlers: {
              fullscreen: () => {
                setIsFullscreen((prev) => !prev);
              },
            },
          },
        },
      });

      quillInstanceRef.current = quill;

      // 监听内容变化并同步给父组件的 onChange (用于驱动 antd Form 表单取值)
      quill.on("text-change", () => {
        // 由于 Quill 默认保留空的回车 <p><br></p>，为了能在 Form 表单 required 校验里通过判断空，可以做额外过滤
        const html = quill.root.innerHTML;
        const currentHtml = html === "<p><br></p>" ? "" : html;
        onChange?.(currentHtml);
      });
    }

    return () => {
      // 销毁时清理 DOM
      if (containerRef.current && quillInstanceRef.current) {
        containerRef.current.innerHTML = "";
        quillInstanceRef.current = null;
      }
    };
  }, []); // 仅挂载时执行一次

  // 监听外部注入进来的值回显 (一般用于编辑页回显数据)，并防止与内部输入冲突
  useEffect(() => {
    if (quillInstanceRef.current) {
      const quill = quillInstanceRef.current;
      const currentHtml = quill.root.innerHTML;

      // 如果外部赋的值与当前编辑器不一样，则更新编辑器 UI，防抖避免光标闪烁跳动
      if (value && value !== currentHtml) {
        quill.root.innerHTML = value;
      } else if (!value && currentHtml !== "<p><br></p>") {
        quill.root.innerHTML = "";
      }
    }
  }, [value]);

  // 监听外部对于 readOnly 的动态变化（比如详情页只读控制）
  useEffect(() => {
    if (quillInstanceRef.current) {
      quillInstanceRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div
      className={`lee-rich-text-wrapper ${isFullscreen ? "fullscreen-mode" : ""}`}
      style={!isFullscreen ? { lineHeight: "normal", minHeight: "200px" } : { lineHeight: "normal" }}
    >
      <div
        ref={containerRef}
        className="lee-rich-text-container"
      />
    </div>
  );
};

export default LeeRichText;
