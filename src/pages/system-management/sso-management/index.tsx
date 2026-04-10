/** @format */

import { Button, Card, Col, Masonry, Row, Typography } from "antd";
import TechFlameLogo from "@/assets/images/techflame-logo.png";
import React19_ts_aiLogo from "@/assets/react.svg";
import ApsLogo from "@/assets/images/aps-logo.png";
import DataPlatformLogo from "@/assets/images/data-platform-logo.png";

const { Title } = Typography;

const DifyLogo = "https://cloud.dify.ai/logo/logo.svg";
const CozeLogo =
  "https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png";
const GitlabLogo =
  "http://192.168.0.194:8001/htsz_code/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png";
const PhabricatorLogo =
  "https://task.hongtai-idi.com/file/data/bg76s6d4pwhdgomibuoc/PHID-FILE-546e6feavfiwhijevf2z/favicon";

const SsoManagement = () => {
  // 统计数据
  const SSOList = [
    {
      id: "techflame",
      title: "灵焰智能体搭建平台",
      description: "灵焰智能体搭建平台,是一款依赖于流程编排的智能体搭建平台",
      path: "http://192.168.0.194",
      logo: (
        <img
          src={TechFlameLogo}
          alt="灵焰智能体搭建平台"
          className="w-12 h-12 mr-4"
        />
      ),
    },
    {
      id: "data-platform",
      title: "数据中台",
      description: "数据中台,致力于数据提取、整合、分析和应用",
      path: "http://192.168.0.194",
      logo: (
        <img src={DataPlatformLogo} alt="数据中台" className="w-12 h-12 mr-4" />
      ),
    },
    {
      id: "aps-frontend",
      title: "APS智能排产系统",
      description:
        "APS智能排产系统,接入MES系统，实现生产计划的智能排产，帮助企业提高生产效率，降低生产成本，提升企业竞争力",
      path: "http://192.168.0.194",
      logo: (
        <img src={ApsLogo} alt="APS智能排产系统" className="w-12 h-12 mr-4" />
      ),
    },
    {
      id: "dify",
      title: "Dify智能体平台",
      description:
        "Dify智能体平台,是一款依赖于大模型驱动的智能体搭建平台，具有行业领先的智能体搭建能力，可以帮助企业快速构建智能体，提升企业竞争力，简化智能体开发流程",
      path: "https://cloud.dify.ai/signin",
      logo: (
        <img src={DifyLogo} alt="Dify智能体平台" className="w-12 h-12 mr-4" />
      ),
    },
    {
      id: "coze",
      title: "扣子智能体",
      description:
        "扣子智能体,是一款依赖于大模型驱动的智能体搭建平台，具有行业领先的智能体搭建能力，可以帮助企业快速构建智能体，提升企业竞争力，简化智能体开发流程",
      path: "https://www.coze.cn/",
      logo: <img src={CozeLogo} alt="扣子智能体" className="w-12 h-12 mr-4" />,
    },
    {
      id: "react19_ts_ai",
      title: "React19_ts_ai",
      description:
        "React19_ts_ai,是一款为ai 开发工具制定的用户库管理系统，采用双src系统开发，兼容传统开发与 AI 辅助开发 。",
      path: "http://192.168.0.194:4200",
      logo: (
        <img
          src={React19_ts_aiLogo}
          alt="React19_ts_ai"
          className="w-12 h-12 mr-4"
        />
      ),
    },
    {
      id: "gitlab",
      title: "Gitlab仓库",
      description: "Gitlab,是一款代码仓库管理平台",
      path: "http://192.168.0.194:8001/htsz_code/users/sign_in",
      logo: (
        <img src={GitlabLogo} alt="Gitlab仓库" className="w-12 h-12 mr-4" />
      ),
    },
    {
      id: "Phabricator任务视图",
      title: "Phabricator任务视图",
      description:
        "Phabricator任务视图,是一款任务视图产品，用于开发人员管理任务，支持任务的创建、编辑、删除、分配、评论等操作",
      path: "https://task.hongtai-idi.com/",
      logo: (
        <img
          src={PhabricatorLogo}
          alt="Phabricator任务视图"
          className="w-12 h-12 mr-4"
        />
      ),
    },
  ];
  return (
    <div>
      <Masonry
        columns={4}
        gutter={16}
        items={SSOList.map((item, index) => ({
          key: `item-${index}`,
          data: item,
        }))}
        itemRender={({ data }) => (
          <Card variant="borderless" className="sso-card">
            <div className="flex flex-col justify-between">
              <div className="flex items-center  pb-1">
                {data.logo}
                <Title level={4} style={{ marginBottom: 0 }}>
                  {data.title}
                </Title>
              </div>
              <div className="text-gray-500 pb-4">{data.description}</div>
              <div className="flex justify-end items-center border-t border-gray-200 pt-4">
                <Button
                  type="primary"
                  onClick={() => window.open(data.path, "_blank")}
                >
                  立即前往
                </Button>
              </div>
            </div>
          </Card>
        )}
      />
      {/* <Row gutter={[16, 16]}>
        {SSOList.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card variant="borderless" className="sso-card">
              <div className="flex flex-col justify-between">
                <div className="flex items-center  pb-1">
                  {item.logo}
                  <Title level={4} style={{ marginBottom: 0 }}>
                    {item.title}
                  </Title>
                </div>
                <div className="text-gray-500 pb-4">{item.description}</div>
                <div className="flex justify-end items-center border-t border-gray-200 pt-4">
                  <Button type="primary">立即前往</Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

export default SsoManagement;
