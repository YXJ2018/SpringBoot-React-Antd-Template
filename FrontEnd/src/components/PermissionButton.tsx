import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import { usePermission } from '@/hooks/usePermission';

interface PermissionButtonProps extends ButtonProps {
  perm: string;
}

export function PermissionButton({ perm, children, ...props }: PermissionButtonProps) {
  const { has } = usePermission();
  if (!has(perm)) return null;
  return <Button {...props}>{children}</Button>;
}
