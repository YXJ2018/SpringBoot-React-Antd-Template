import type { ReactNode } from 'react';

export type OptionItemType = {
  /**
   * label 属性名
   */
  label: string;
  /**
   * value 属性值
   */
  value: string | number;
  /**
   * color 主色，背景色根据主色自动生成
   */
  color?: string;
  /**
   * iconfont 传入一个图标组件或者iconfont项目中自定义图标名称
   */
  iconfont?: ReactNode | string;
};
