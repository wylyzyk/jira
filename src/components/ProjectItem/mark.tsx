import React from "react";

/**
 * name: "管理界面注册开发"
 * keywords: "管理"
 * arr = ["", "界面注册开发"]
 *
 * @param param0
 * @returns
 */
const Mark = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword) {
    return <>{name}</>;
  }

  const arr = name.split(keyword);

  return (
    <>
      {arr.map((str: string, index: number) => (
        <span key={index}>
          {str}
          {index === arr.length - 1 ? null : (
            <span style={{ color: "#257afd" }}>{keyword}</span>
          )}
        </span>
      ))}
    </>
  );
};

export default Mark;
