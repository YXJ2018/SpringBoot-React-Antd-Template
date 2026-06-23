import { BetaSchemaForm } from '@ant-design/pro-components';
import type { FormSchema } from '@ant-design/pro-components/es/form/components/SchemaForm';
import defaultModalProps from '@/components/BaseModalForm/defaultModalProps';
import styles from './index.module.css';
import { useMemo } from 'react';

export default function DetailModal<T = Record<string, any>, ValueType = 'text'>(props: FormSchema<T, ValueType>) {
  const { modalProps: callerModalProps, className: callerClassName, columns: callerColumns, ...rest } = props as any;

  const adaptedColumns = useMemo(() => {
    if (!Array.isArray(callerColumns)) return callerColumns;
    return callerColumns
      .filter((col: any) => col.valueType !== 'option')
      .map(({ render: _, ...restCol }: any) => restCol);
  }, [callerColumns]);

  const mergedModalProps: FormSchema = {
    ...defaultModalProps,
    ...callerModalProps,
    className: [defaultModalProps?.className, callerModalProps?.className].filter(Boolean).join(' ') || undefined,
    classNames: {
      ...defaultModalProps?.classNames,
      ...callerModalProps?.classNames,
    },
  };

  const mergedProps = {
    readonly: true,
    submitter: false,
    grid: true,
    rowProps: { gutter: 32 },
    colProps: { span: 12 },
    layoutType: 'ModalForm',
    requiredMark: false,
    modalProps: mergedModalProps,
    className: [styles.detailForm, callerClassName].filter(Boolean).join(' '),
    columns: adaptedColumns,
    ...rest,
  } as FormSchema<T, ValueType>;

  return <BetaSchemaForm<T, ValueType> {...mergedProps} />;
}
