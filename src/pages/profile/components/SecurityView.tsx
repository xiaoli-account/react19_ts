/** @format */

import { Button } from "antd";
import "../styles.scss";

const SecurityView = () => {
  const data = [
    {
      title: "账户密码",
      description: "当前密码强度：强",
      action: "修改",
    },
    {
      title: "绑定手机",
      description: "已绑定手机：187****6017",
      action: "修改",
    },
    {
      title: "绑定邮箱",
      description: "已绑定邮箱：li601******@gmail.com",
      action: "修改",
    },
  ];

  return (
    <>
      <div className="profile-header">
        <h2>安全设置</h2>
      </div>
      <div className="security-list">
        {data.map((item) => (
          <div key={item.title} className="security-list-item">
            <div className="security-list-item-content">
              <div className="security-list-item-title">{item.title}</div>
              <div className="security-list-item-description">
                {item.description}
              </div>
            </div>
            <div className="security-list-item-action">
              <Button type="link">{item.action}</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SecurityView;
