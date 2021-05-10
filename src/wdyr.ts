import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");

  whyDidYouRender(React, {
    // 值为true, 跟踪所有组件
    trackAllPureComponents: false,
  });
}
