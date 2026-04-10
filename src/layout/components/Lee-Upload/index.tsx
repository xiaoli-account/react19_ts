/** @format */

import React, { useMemo } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { message, Upload } from "antd";
import { $upload } from "@/layout/utils/request";
const { Dragger } = Upload;

interface LeeUploadProps extends Omit<UploadProps, "onChange"> {
  url?: string;
  params?: Record<string, any>;
  fileType?: string[];
  limit?: number;
  maxSize?: number;
  isDrop?: boolean;
  onSuccess?: (file: UploadFile, response: any) => void;
  onError?: (file: UploadFile, error: any) => void;
  onProgress?: (file: UploadFile, percent: number) => void;
  onChange?: (fileList: UploadFile[]) => void;
}

const LeeUpload: React.FC<LeeUploadProps> = ({
  url = "/api/file/upload",
  params,
  fileType,
  limit,
  maxSize = 10,
  isDrop = false,
  onSuccess,
  onError,
  onProgress,
  onChange,
  children,
  ...restProps
}) => {
  // 文件类型及大小校验
  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    if (fileType && fileType.length > 0) {
      const isValidType = fileType.some((type) => {
        if (type.endsWith("/*")) {
          const prefix = type.replace("/*", "");
          return file.type.startsWith(`${prefix}/`);
        }
        return file.type === type || file.name.endsWith(type.replace(".", ""));
      });

      if (!isValidType) {
        message.error(`只接受 ${fileType.join(", ")} 格式`);
        return Upload.LIST_IGNORE;
      }
    }

    if (maxSize && file.size > maxSize * 1024 * 1024) {
      message.error(`文件大小超过 ${maxSize}MB 限制`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // 使用 request.upload 上传，支持进度回调
  const customRequest: UploadProps["customRequest"] = (options) => {
    const {
      file,
      onSuccess: onUploadSuccess,
      onError: onUploadError,
      onProgress: onUploadProgress,
    } = options;

    $upload(url, file as File, {
      params,
      onUploadProgress: (progressEvent: any) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onUploadProgress?.({ percent } as any);
        onProgress?.(file as UploadFile, percent);
      },
    })
      .then((res) => {
        onUploadSuccess?.(res);
      })
      .catch((err) => {
        onUploadError?.(err);
        onError?.(file as UploadFile, err);
      });
  };

  // 处理上传状态及数量限制
  const handleChange: UploadProps["onChange"] = (info) => {
    const { file, fileList } = info;

    if (limit && fileList.length > limit) {
      message.warning(`最多上传 ${limit} 个文件`);
      const trimmedList = fileList.slice(0, limit);
      onChange?.(trimmedList);
      return;
    }

    onChange?.(fileList);

    if (file.status === "done") {
      message.success(`${file.name} 上传成功`);
      onSuccess?.(file, file.response);
    } else if (file.status === "error") {
      message.error(`${file.name} 上传失败`);
    }
  };

  const defaultChildren = (
    <>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件上传</p>
      <p className="ant-upload-hint">
        {fileType?.length ? `支持 ${fileType.join(", ")} 格式` : "支持任意格式"}
        {maxSize ? `，单文件不超过 ${maxSize}MB` : ""}
        {limit ? `，最多 ${limit} 个` : ""}
      </p>
    </>
  );

  return isDrop ? (
    <Dragger
      name="file"
      multiple={limit !== 1}
      action={url}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      onChange={handleChange}
      {...restProps}
    >
      {children || defaultChildren}
    </Dragger>
  ) : (
    <Upload
      name="file"
      multiple={limit !== 1}
      action={url}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      onChange={handleChange}
      {...restProps}
    >
      {children || defaultChildren}
    </Upload>
  );
};

export default LeeUpload;
