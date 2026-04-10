/** @format */

import { Popover, Spin, Tabs, Avatar, Empty, Flex } from "antd";
import { useState } from "react";
import "./index.scss";

interface NoticeItem {
  id: string;
  avatar?: string;
  title: string;
  datetime: string;
  type: "notification" | "message" | "event";
  description?: string;
  status?: string;
  read?: boolean;
}

const defaultNotices: NoticeItem[] = [
  {
    id: "000000001",
    avatar:
      "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/MSbDR4fr2MUAAAAAAAAAAAAAFl94AQBr",
    title: "你收到了 14 份新周报",
    datetime: "2024-01-09",
    type: "notification",
  },
  {
    id: "000000002",
    avatar:
      "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/hX-PTavYIq4AAAAAAAAAAAAAFl94AQBr",
    title: "你推荐的 曲妮妮 已通过第三轮面试",
    datetime: "2024-01-08",
    type: "notification",
  },
  {
    id: "000000003",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
    title: "曲丽丽 评论了你",
    description: "描述信息描述信息描述信息",
    datetime: "2024-01-07",
    type: "message",
    read: false,
  },
  {
    id: "000000004",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
    title: "朱偏右 回复了你",
    description: "这种模板用于提醒谁与你发生了互动",
    datetime: "2024-01-07",
    type: "message",
    read: true,
  },
  {
    id: "000000005",
    title: "任务名称",
    description: "任务需要在 2024-01-12 20:00 前启动",
    datetime: "2024-01-12 20:00",
    type: "event",
    status: "todo",
  },
];

interface NoticePopoverProps {
  children: React.ReactNode;
}

const NoticePopover = ({ children }: NoticePopoverProps) => {
  const [loading] = useState(false);
  const [notices] = useState<NoticeItem[]>(defaultNotices);

  const getNoticeData = (notices: NoticeItem[]) => {
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.reduce(
      (pre, data) => {
        if (!pre[data.type]) {
          pre[data.type] = [];
        }
        pre[data.type].push(data);
        return pre;
      },
      {} as Record<string, NoticeItem[]>
    );
    return newNotices;
  };

  const noticeData = getNoticeData(notices);

  const TabPane = ({
    type,
    emptyText,
  }: {
    type: string;
    emptyText: string;
  }) => {
    const list = noticeData[type] || [];

    if (list.length === 0) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
      );
    }

    return (
      <Flex vertical className="notice-list">
        {list.map((item) => (
          <div
            key={item.id}
            className={`notice-list-item ${item.read ? "read" : ""}`}
          >
            <Flex gap={16} align="start" className="notice-list-item-meta">
              {item.avatar && (
                <div className="notice-list-item-meta-avatar">
                  <Avatar src={item.avatar} />
                </div>
              )}
              <div className="notice-list-item-meta-content">
                <div className="notice-list-item-meta-title">
                  <div className="title">
                    {item.title}
                    <div className="extra-time">{item.datetime}</div>
                  </div>
                </div>
                {item.description && (
                  <div className="notice-list-item-meta-description">
                    {item.description}
                  </div>
                )}
              </div>
            </Flex>
          </div>
        ))}
      </Flex>
    );
  };

  const tabs = [
    {
      key: "notification",
      label: `通知 (${(noticeData.notification || []).length})`,
      children: <TabPane type="notification" emptyText="你已查看所有通知" />,
    },
    {
      key: "message",
      label: `消息 (${(noticeData.message || []).length})`,
      children: <TabPane type="message" emptyText="您已读完所有消息" />,
    },
    {
      key: "event",
      label: `待办 (${(noticeData.event || []).length})`,
      children: <TabPane type="event" emptyText="你已完成所有待办" />,
    },
  ];

  const content = (
    <div className="notice-list-container">
      <Spin spinning={loading}>
        <Tabs items={tabs} />
        <div className="bottom-actions">
          <div>清空</div>
          <div>查看更多</div>
        </div>
      </Spin>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomLeft"
      classNames={{
        root: "notice-popover",
      }}
      destroyOnHidden={true}
    >
      {children}
    </Popover>
  );
};

export default NoticePopover;
