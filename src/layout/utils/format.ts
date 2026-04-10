/**
 * 格式化工具
 *
 * @format
 */

// 日期格式化
export const formatDate = (
  date: Date | string,
  format = "YYYY-MM-DD HH:mm:ss"
): string => {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

// 数字格式化
export const formatNumber = (num: number | string): string => {
  const n = Number(num);
  if (isNaN(n)) return "0";

  return n.toLocaleString();
};

// 文件大小格式化
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 金额格式化
export const formatCurrency = (
  amount: number | string,
  currency = "¥"
): string => {
  const num = Number(amount);
  if (isNaN(num)) return "0.00";

  return `${currency}${num.toFixed(2).replace(/\B(?=(\d{3})+)$/g, ",$1")}`;
};

// 百分比格式化
export const formatPercent = (num: number | string): string => {
  const n = Number(num);
  if (isNaN(n)) return "0%";

  return `${(n * 100).toFixed(2)}%`;
};

// 手机号格式化
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return phone;
};

// 身份证号格式化
export const formatIdCard = (idCard: string): string => {
  // 简单的身份证号格式化，实际应用中需要更严格的验证
  const cleaned = idCard.replace(/\D/g, "");
  return cleaned.replace(/(\d{6})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
};
