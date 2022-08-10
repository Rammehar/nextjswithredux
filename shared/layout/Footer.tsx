import React from "react";
import CopyRight from "./CopyRight";

const Footer: React.FunctionComponent = () => {
  return (
    <footer
      style={{ color: "gray", left: 0, right: 0, position: "fixed", bottom: 0 }}
    >
      <CopyRight />
    </footer>
  );
};

export default Footer;
