import { ModalForm, type ModalFormProps } from '@ant-design/pro-components';
import styles from './index.module.css';

/**
 * 修改弹窗默认样式
 */
const defaultModalProps = {
  destroyOnHidden: true,
  className: styles.modal,
  classNames: {
    container: styles.container,
    header: styles.header,
    body: styles.body,
    footer: styles.footer,
  },
} as const;

/**
 * 扩展ModalForm组件，修改了modalProps的默认样式
 * @param props 和ModalForm保持一致
 * @returns ModalForm
 */
export default function BaseModalForm<T = Record<string, any>, U = Record<string, any>>(props: ModalFormProps<T, U>) {
  const callerModalProps = props.modalProps ?? {};

  const mergedModalProps = {
    ...defaultModalProps,
    ...callerModalProps,
    className: [defaultModalProps.className, callerModalProps.className].filter(Boolean).join(' '),
    classNames: {
      ...defaultModalProps.classNames,
      ...callerModalProps.classNames,
    },
  };

  return (
    <ModalForm<T, U>
      {...props}
      modalProps={mergedModalProps}
    />
  );
}
