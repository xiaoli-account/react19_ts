/** @format */

import { Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMenu } from "@/layout/hooks/use-menu";
import type { MenuItem } from "@/layout/router/router-type";
import "./index.scss";

const { Option } = Select;

const SearchMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { menus } = useMenu();
  const [value, setValue] = useState<string>();
  const [options, setOptions] = useState<MenuItem[]>([]);

  // 扁平化菜单数据用于搜索
  const flatMenus = useMemo(() => {
    const flatten = (items: any[]): any[] => {
      let result: any[] = [];
      items.forEach((item) => {
        if (item) {
          result.push(item);
          if (item.children) {
            result = result.concat(flatten(item.children));
          }
        }
      });
      return result;
    };
    return flatten(menus);
  }, [menus]);

  // 搜索处理
  const handleSearch = (newValue: string) => {
    if (newValue) {
      const filtered = flatMenus.filter(
        (item) =>
          item.label &&
          item.key &&
          // 只搜索有路径的叶子节点，排除目录
          !item.children &&
          item.label.toLowerCase().includes(newValue.toLowerCase())
      );
      setOptions(filtered);
    } else {
      setOptions([]);
    }
  };

  // 选择处理
  const handleChange = (newValue: string) => {
    setValue(newValue);
    navigate(newValue);
    setValue(undefined); // 跳转后清空搜索框
    setOptions([]);
  };

  return (
    <div className="header-search-wrapper">
      <div className="header-search">
        <SearchOutlined className="search-icon" />
        <Select
          showSearch
          allowClear
          value={value}
          placeholder={t("lee-layout-header.searchMenuPlaceholder")}
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={null}
          className="search-select"
          popupMatchSelectWidth={false} // 允许下拉框宽度自适应
          style={{ width: "100%" }}
        >
          {options.map((item) => (
            <Option key={item.key} value={item.key}>
              {item.label}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default SearchMenu;
