# 上传组件

## 使用示例

```tsx
<LeeUpload
  url="/system/user/current/avatar/upload"
  fileType={["image/*"]}
  maxSize={10}
  limit={5}
  showUploadList={false}
  pastable={false}
  onSuccess={(file, response) => {
    console.log("上传成功", file, response);
  }}
  onError={(file, error) => {
    console.log("上传失败", file, error);
  }}
  onProgress={(file, percent) => {
    console.log("上传进度", file, percent);
  }}
  onChange={(fileList) => {
    console.log("文件列表变化", fileList);
  }}
>
  <Button icon={<UploadOutlined />}>更换头像</Button>
</LeeUpload>
```


# 创建时间：2026-03-23 11:51