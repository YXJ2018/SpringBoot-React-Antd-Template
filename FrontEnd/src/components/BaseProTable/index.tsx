import { ProTable } from '@ant-design/pro-components';
import type { ParamsType, ProTableProps } from '@ant-design/pro-components';

/**
 * 扩展ProTable，添加一些公共属性
 * @param props 与原本ProTable保持一致
 * @returns ProTable
 */
export default function BaseProTable<T extends Record<string, any>, U extends ParamsType = any>(
  props: ProTableProps<T, U>,
) {
  return (
    <ProTable<T, U>
      options={false}
      scroll={{ x: 'max-content' }}
      {...props}
    />
  );
}
