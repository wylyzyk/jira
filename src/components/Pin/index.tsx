import { Rate } from "antd";
import React, { FC } from "react";

interface IProps extends React.ComponentProps<typeof Rate> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Pin: FC<IProps> = ({ checked, onCheckedChange, ...restProps }) => {
  /**
   * count 表示 个数
   * value 表示 是否点亮
   * onChange 接收一个 number 类型的参数, !!num 同于  Boolean(num)  ?. 表示onCheckedChange 是 undefined时 return
   */
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      onChange={(num) => onCheckedChange?.(!!num)}
      {...restProps}
    />
  );
};

export default Pin;
