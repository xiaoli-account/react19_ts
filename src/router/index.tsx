/** @format */

import LeeRouter from "@/layout/router";
import routes from "./routes";

const AppRouter = () => {
  return (
    <>
      <LeeRouter routes={routes} />
    </>
  );
};

export default AppRouter;
