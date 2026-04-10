/** @format */

import React from "react";
import { Dropdown, Space, Typography, theme, type MenuProps } from "antd";
import {
  DownOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useSwitchSystemStore,
  SYSTEM_LIST,
} from "@/layout/stores/switch-system-store";

const { Text } = Typography;

interface SystemSwitcherProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 系统切换组件
 * 显示当前系统名称，点击可下拉切换其他系统
 */
export const SystemSwitcher: React.FC<SystemSwitcherProps> = ({
  className,
  style,
}) => {
  const { currentSystem, setCurrentSystem } = useSwitchSystemStore();
  const { token } = theme.useToken();

  const handleMenuClick: MenuProps["onClick"] = (info) => {
    const selected = SYSTEM_LIST.find((item) => item.id === info.key);
    if (selected) {
      setCurrentSystem(selected);
    }
  };

  const items: MenuProps["items"] = SYSTEM_LIST.map((system) => ({
    key: system.id,
    label: (
      <div style={{ maxWidth: 220, padding: "4px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ fontSize: 14 }}>
            {system.name}
          </Text>
          {currentSystem.id === system.id && (
            <CheckCircleOutlined style={{ color: token.colorSuccess }} />
          )}
        </div>
        <div
          style={{
            fontSize: 10,
            color: token.colorTextSecondary,
            marginTop: 4,
            lineHeight: 1.5,
          }}
        >
          {system.description}
        </div>
      </div>
    ),
    icon: system.icon ? (
      <img src={system.icon} alt="icon" style={{ width: 30, height: 30 }} />
    ) : (
      <AppstoreOutlined style={{ fontSize: 16, marginTop: 4 }} />
    ),
  }));

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        selectedKeys: [currentSystem.id],
      }}
      trigger={["click"]}
      placement="bottomLeft"
      className="!h-full"
    >
      <div
        className={`${className} !h-full !flex !items-center cursor-pointer`}
        title="点击切换系统"
      >
        <div className="w-full flex items-center gap-2 hover:bg-gray-200 px-2 rounded-md box-border transition-all duration-300">
          <div className="text-base w-[160px] truncate">
            {currentSystem.name}
          </div>
          <DownOutlined className="text-xs ml-1" />
        </div>
      </div>
    </Dropdown>
  );
};
