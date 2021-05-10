import { Select } from "antd";
import React, { FC } from "react";
import { Raw } from "typing";

type SelectProps = React.ComponentProps<typeof Select>;

interface IProps extends Omit<SelectProps, "value" | "onChange" | "options"> {
  value: Raw | undefined | null;
  onChange: (value?: number) => void;
  defaultOptionName: string;
  options?: { name: string; id: number }[];
}

/**
 *  value 可以传入多种类型的值
 *  onChange 只会回调, number | undefined 类型
 *  当 isNaN(Number(value)) 为true的时候, 代表默认类型
 *  当选择默认类型的时候, onChange会回调 undefined
 */

const IdSelect: FC<IProps> = ({
  value,
  onChange,
  defaultOptionName,
  options,
  ...restProps
}) => {
  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}

      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));

export default IdSelect;
