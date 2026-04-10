/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LeeLogger } from "../utils/leeLogger";
import ReactLogo from "@/assets/react.svg";
import TechflameLogo from "@/assets/images/techflame-logo.png";
import APSLogo from "@/assets/images/aps-logo.png";

export interface SystemInfo {
  id: string;
  name: string;
  appId: string;
  description: string;
  icon?: string;
  url?: string;
}

export interface SwitchSystemState {
  currentSystem: SystemInfo;
  setCurrentSystem: (system: SystemInfo) => void;
}

// 模拟系统列表数据
export const SYSTEM_LIST: SystemInfo[] = [
  {
    id: "1",
    name: "React19_TS 后台管理系统",
    icon: ReactLogo,
    appId: "react19-admin",
    description: "基于 React 19 和 Ant Design 的企业级后台管理系统",
  },
  {
    id: "2",
    name: "数据中台系统",
    icon: TechflameLogo,
    appId: "data-center",
    description: "统一数据管理与分析平台",
  },
  {
    id: "3",
    name: "APS系统",
    icon: APSLogo,
    appId: "aps",
    description: "APS系统",
  },
];

const DEFAULT_SYSTEM = SYSTEM_LIST[0];

export const useSwitchSystemStore = create<SwitchSystemState>()(
  persist(
    (set) => ({
      currentSystem: DEFAULT_SYSTEM,
      setCurrentSystem: (system) => {
        set({ currentSystem: system });
        LeeLogger.info(
          `用户切换系统: [${system.appId}] ${system.name}`,
          system
        );
      },
    }),
    {
      name: "layout-system-switch-storage",
      partialize: (state) => ({
        currentSystem: state.currentSystem,
      }),
    }
  )
);
