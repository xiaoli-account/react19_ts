/** @format */

import { Tabs, type TabsProps } from "antd";
import BaseView from "./components/BaseView";
import SecurityView from "./components/SecurityView";
import "./styles.scss";
import { useState } from "react";

const Profile = () => {
  const [tabPlacement] = useState<TabsProps["tabPlacement"]>("start");
  const items = [
    {
      key: "1",
      label: "基本信息",
      children: <BaseView />,
    },
    {
      key: "2",
      label: "安全设置",
      children: <SecurityView />,
    },
  ];

  return (
    <div className="profile-container">
      <Tabs
        defaultActiveKey="1"
        tabPlacement={tabPlacement}
        items={items}
        className="profile-tabs"
      />
    </div>
  );
};

export default Profile;
