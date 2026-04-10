/** @format */

import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Timeline,
  Avatar,
  Badge,
  Button,
  Space,
  Tag,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  RiseOutlined,
  BellOutlined,
  SettingOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";
import { useUserStore } from "@/store/user";
import "./styles.scss";
import TechFlameLogo from "@/assets/images/techflame-logo.png";
import { LeeLogger } from "@/layout/utils/leeLogger";
import type { LogRecord } from "@/layout/utils/leeLogger";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { userInfo } = useUserStore();
  const navigate = useNavigate();

  // 初始化图表
  useEffect(() => {
    initCharts();

    return () => {
      // 销毁所有图表实例
      ["visitChart", "categoryChart", "trendChart"].forEach((id) => {
        const dom = document.getElementById(id);
        if (dom) {
          const instance = echarts.getInstanceByDom(dom);
          instance?.dispose();
        }
      });
    };
  }, []);

  // 初始化所有图表
  const initCharts = () => {
    initVisitChart();
    initCategoryChart();
    initTrendChart();
  };

  // 访问量趋势图
  const initVisitChart = () => {
    const chartDom = document.getElementById("visitChart");
    if (!chartDom) return;

    // 检查是否已经存在实例
    let myChart = echarts.getInstanceByDom(chartDom);
    if (!myChart) {
      myChart = echarts.init(chartDom);
    }
    const option = {
      title: {
        text: "访问量趋势",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        axisLine: {
          lineStyle: {
            color: "#999",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#999",
          },
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      series: [
        {
          name: "访问量",
          type: "line",
          smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          itemStyle: {
            color: "#1890ff",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(24, 144, 255, 0.3)" },
              { offset: 1, color: "rgba(24, 144, 255, 0.05)" },
            ]),
          },
        },
      ],
    };
    myChart.setOption(option);

    // 响应式
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };

  // 分类统计图
  const initCategoryChart = () => {
    const chartDom = document.getElementById("categoryChart");
    if (!chartDom) return;

    let myChart = echarts.getInstanceByDom(chartDom);
    if (!myChart) {
      myChart = echarts.init(chartDom);
    }

    // 获取日志数据并统计模块使用次数
    const logs = LeeLogger.getLogs();
    const moduleCounts: Record<string, number> = {};

    logs.forEach((log: LogRecord) => {
      const mod = log.module || "未知模块";
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });

    // 转换数据格式
    const colors = [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
    ];
    const chartData = Object.keys(moduleCounts).map((key, index) => ({
      value: moduleCounts[key],
      name: key,
      itemStyle: { color: colors[index % colors.length] },
    }));

    // 如果没有数据，显示暂无数据
    if (chartData.length === 0) {
      chartData.push({
        value: 0,
        name: "暂无数据",
        itemStyle: { color: "#ccc" },
      });
    }

    const option = {
      title: {
        text: "功能模块使用统计",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "middle",
      },
      series: [
        {
          name: "使用次数",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
    };
    myChart.setOption(option);

    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };

  // 数据趋势对比图
  const initTrendChart = () => {
    const chartDom = document.getElementById("trendChart");
    if (!chartDom) return;

    let myChart = echarts.getInstanceByDom(chartDom);
    if (!myChart) {
      myChart = echarts.init(chartDom);
    }
    const option = {
      title: {
        text: "月度数据对比",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["本月", "上月"],
        top: 40,
      },
      grid: {
        top: 80,
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["1日", "5日", "10日", "15日", "20日", "25日", "30日"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "本月",
          type: "line",
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210],
          itemStyle: { color: "#1890ff" },
        },
        {
          name: "上月",
          type: "line",
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
          itemStyle: { color: "#52c41a" },
        },
      ],
    };
    myChart.setOption(option);

    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };

  // 统计数据
  const statisticsData = [
    {
      title: "总用户数",
      value: 7,
      prefix: <UserOutlined />,
      suffix: "人",
      color: "#1890ff",
    },
    {
      title: "活跃用户",
      value: 1,
      prefix: <TeamOutlined />,
      suffix: "人",
      color: "#52c41a",
    },
    {
      title: "文档总数",
      value: 42,
      prefix: <FileTextOutlined />,
      suffix: "篇",
      color: "#faad14",
    },
    {
      title: "增长率",
      value: 28.5,
      prefix: <RiseOutlined />,
      suffix: "%",
      color: "#f5222d",
    },
  ];

  // 快捷菜单
  const quickMenus = [
    {
      icon: <img src={TechFlameLogo} alt="TechFlame" style={{ width: 38 }} />,
      title: "智能体平台",
      color: "transparent",
      onClick: () => {
        // 打开新浏览器标签前往 http://192.168.0.194/login
        window.open("http://192.168.0.194", "_blank");
      },
    },
    {
      icon: <UserOutlined />,
      title: "用户管理",
      color: "#52c41a",
      onClick: () => {
        navigate("/system-management/user-management");
      },
    },
    {
      icon: <TeamOutlined />,
      title: "角色管理",
      color: "#13c2c2",
      onClick: () => {
        navigate("/system-management/role-management");
      },
    },
    {
      icon: <AppstoreOutlined />,
      title: "菜单管理",
      color: "#f5222d",
      onClick: () => {
        navigate("/system-management/menu-management");
      },
    },
    {
      icon: <SettingOutlined />,
      title: "字典管理",
      color: "#faad14",
      onClick: () => {
        navigate("/system-management/dict-management");
      },
    },
    {
      icon: <SettingOutlined />,
      title: "日志管理",
      color: "#2f54eb",
      onClick: () => {
        navigate("/system-management/log-management");
      },
    },
    {
      icon: <SyncOutlined />,
      title: "SSO 管理",
      color: "#eb2f96",
      onClick: () => {
        navigate("/system-management/sso-management");
      },
    },
    {
      icon: <FileTextOutlined />,
      title: "文档中心",
      color: "#722ed1",
      onClick: () => {
        navigate("/system-management/document-center");
      },
    },
  ];

  // 操作日志
  const [recentLogs, setRecentLogs] = useState<LogRecord[]>([]);

  useEffect(() => {
    // 获取最近的8条日志
    const logs = LeeLogger.getLogs();
    setRecentLogs([...logs].reverse().slice(0, 8));
  }, []);

  const logColumns = [
    {
      title: "用户",
      dataIndex: "userName",
      key: "userName",
      render: (text: string) => text || "未知用户",
    },
    {
      title: "模块",
      dataIndex: "module",
      key: "module",
      render: (text: string) => <Tag color="blue">{text || "系统"}</Tag>,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
    },
    {
      title: "时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 160,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status: string) => {
        const color =
          status === "SUCCESS"
            ? "success"
            : status === "FAILURE"
              ? "error"
              : "default";
        const text =
          status === "SUCCESS"
            ? "成功"
            : status === "FAILURE"
              ? "失败"
              : status || "未知";
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // 通知信息
  const notifications = [
    {
      title: "系统更新通知",
      description: "系统将于今晚22:00进行版本升级，预计耗时30分钟",
      time: "2小时前",
      type: "info",
    },
    {
      title: "安全提醒",
      description: "检测到异常登录行为，请及时修改密码",
      time: "5小时前",
      type: "warning",
    },
    {
      title: "功能上线",
      description: "新增数据导出功能，支持多种格式导出",
      time: "1天前",
      type: "success",
    },
    {
      title: "维护通知",
      description: "数据库维护完成，所有服务已恢复正常",
      time: "2天前",
      type: "success",
    },
  ];

  // 项目版本时间轴
  const projectVersions = [
    {
      version: "API Service 版",
      description: "前后端分离架构，支持完整的后端服务对接",
      features: ["RESTful API", "权限管理", "数据持久化", "生产环境部署"],
      status: "planned",
      color: "gray",
      icon: <ClockCircleOutlined />,
    },
    {
      version: "Koa + SQLite 版",
      description: "大前端解决方案，集成轻量级后端服务",
      features: ["Node.js 后端", "SQLite 数据库", "完整 CRUD", "本地部署"],
      status: "processing",
      color: "blue",
      icon: <SyncOutlined spin />,
    },
    {
      version: "Mock 版",
      description: "使用 Mock 数据模拟真实业务场景",
      features: ["Mock.js", "模拟接口", "数据模拟", "开发调试"],
      status: "completed",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    {
      version: "基础版",
      description: "纯前端展示版本，包含完整的 UI 交互",
      features: ["React 19", "TypeScript", "Ant Design", "响应式布局"],
      status: "completed",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* 用户信息卡片 */}
      <Card className="user-info-card" variant="borderless">
        <div className="user-info-content">
          <Avatar size={64} icon={<UserOutlined />} src={userInfo?.avatar} />
          <div className="user-details">
            <h2>
              欢迎回来，{userInfo?.nickname || userInfo?.loginName || "访客"}
            </h2>
            <p className="user-meta">
              <span>角色: {userInfo?.roles?.join(", ") || "普通用户"}</span>
              <span className="divider">|</span>
              <span>邮箱: {userInfo?.email || "未设置"}</span>
              <span className="divider">|</span>
              <span>上次登录: {new Date().toLocaleString("zh-CN")}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* 统计数据卡片 */}
      <Row gutter={[16, 16]} className="statistics-row">
        {statisticsData.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card variant="borderless" className="statistic-card">
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                suffix={item.suffix}
                styles={{ content: { color: item.color } }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷菜单 */}
      <Card title="快捷入口" variant="borderless" className="quick-menu-card">
        <div className="quick-menu-list">
          {quickMenus.map((menu, index) => (
            <div className="quick-menu-item" key={index} onClick={menu.onClick}>
              <div
                className="menu-icon"
                style={{ backgroundColor: menu.color }}
              >
                {menu.icon}
              </div>
              <div className="menu-title">{menu.title}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 图表展示区 */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={12}>
          <Card variant="borderless" className="chart-card">
            <div
              id="visitChart"
              style={{ width: "100%", height: "300px" }}
            ></div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card variant="borderless" className="chart-card">
            <div
              id="categoryChart"
              style={{ width: "100%", height: "300px" }}
            ></div>
          </Card>
        </Col>
        <Col xs={24}>
          <Card variant="borderless" className="chart-card">
            <div
              id="trendChart"
              style={{ width: "100%", height: "300px" }}
            ></div>
          </Card>
        </Col>
      </Row>

      {/* 操作日志和通知信息 */}
      <Row gutter={[16, 16]} className="info-row">
        <Col xs={24} lg={12}>
          <Card
            title="操作日志"
            variant="borderless"
            className="log-card"
            extra={
              <Button
                type="link"
                onClick={() => navigate("/system-management/log-management")}
              >
                查看更多
              </Button>
            }
          >
            <Table
              columns={logColumns}
              dataSource={recentLogs}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BellOutlined />
                <span>通知信息</span>
                <Badge count={notifications.length} />
              </Space>
            }
            variant="borderless"
            className="notification-card"
            extra={<Button type="link">查看全部</Button>}
          >
            <div className="notification-list">
              {notifications.map((item, index) => (
                <div
                  key={index}
                  className="notification-item"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "12px 0",
                    borderBottom:
                      index === notifications.length - 1
                        ? "none"
                        : "1px solid #f0f0f0",
                  }}
                >
                  <div style={{ marginRight: 16 }}>
                    <Badge
                      status={
                        item.type === "warning"
                          ? "warning"
                          : item.type === "success"
                            ? "success"
                            : "processing"
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ color: "rgba(0,0,0,0.45)", fontSize: 14 }}>
                      <div>{item.description}</div>
                      <div className="notification-time">{item.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 项目功能介绍和版本时间轴 */}
      <Row gutter={[16, 16]} className="project-row">
        <Col xs={24} lg={12}>
          <Card
            title="项目功能介绍"
            variant="borderless"
            className="feature-card"
          >
            <div className="feature-content">
              <h3>🚀 React 19 + TypeScript 管理系统</h3>
              <p className="feature-description">
                基于最新的 React 19 和 TypeScript 构建的现代化管理系统， 采用
                Ant Design 组件库，提供完整的前端解决方案。
              </p>

              <h4>✨ 核心特性</h4>
              <ul className="feature-list">
                <li>🎨 现代化的 UI 设计，支持主题切换</li>
                <li>🌍 完整的国际化支持（中文/英文）</li>
                <li>🔐 完善的权限管理系统</li>
                <li>📊 丰富的数据可视化图表</li>
                <li>📱 响应式布局，支持多端适配</li>
                <li>🔄 状态管理（Zustand）</li>
                <li>🛡️ TypeScript 类型安全</li>
                <li>⚡ Vite 构建工具，开发体验极佳</li>
              </ul>

              <h4>🛠️ 技术栈</h4>
              <Space wrap className="tech-stack">
                <Tag color="blue">React 19</Tag>
                <Tag color="cyan">TypeScript</Tag>
                <Tag color="purple">Ant Design</Tag>
                <Tag color="green">Zustand</Tag>
                <Tag color="orange">ECharts</Tag>
                <Tag color="red">Vite</Tag>
                <Tag color="geekblue">React Router</Tag>
                <Tag color="magenta">i18next</Tag>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="项目版本规划"
            variant="borderless"
            className="version-card"
          >
            <Timeline
              items={projectVersions.map((version) => ({
                color: version.color,
                icon: version.icon,
                content: (
                  <div className="version-item">
                    <div className="version-header">
                      <h4>{version.version}</h4>
                      <Tag color={version.color}>
                        {version.status === "completed"
                          ? "已完成"
                          : version.status === "processing"
                            ? "进行中"
                            : "计划中"}
                      </Tag>
                    </div>
                    <p className="version-description">{version.description}</p>
                    <div className="version-features">
                      {version.features.map((feature, idx) => (
                        <Tag key={idx} className="feature-tag">
                          {feature}
                        </Tag>
                      ))}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
