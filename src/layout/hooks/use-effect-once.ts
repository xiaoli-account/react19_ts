/** @format */

import React, { useEffect } from "react";

/**
 * 解决useEffect开发环境执行两次，生产环境执行一次的问题
 * @param effect
 */
export const useEffectOnce = (effect: any) => {
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;
    return effect();
  }, []);
};
