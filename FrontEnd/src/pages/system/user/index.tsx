import { useRef, useState, useMemo, useEffect } from 'react';
import { ProFormText, ProFormSelect } from '@ant-design/pro-components';
import type { ActionType, ProColumnType } from '@ant-design/pro-components';
import BaseProTable from '@/components/BaseProTable';
import BaseModalForm from '@/components/BaseModalForm/index';
import { message, Tag } from 'antd';
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi, resetPwdApi, assignRolesApi } from '@/api/user';
import { getRoleListApi } from '@/api/role';
import PermissionButton from '@/components/Buttons/PermissionButton';
import ActionButtons from '@/components/Buttons/ActionButtons';
import TableModal from '@/components/TableModal';
import dictionary from '@/dictionary';
import IconStatus from '@/components/IconStatus';
import type { UserVO } from '@/types/user';

export default function UserManage() {
  const actionRef = useRef<ActionType>(null);
  const [editingUser, setEditingUser] = useState<UserVO | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [resetPwdUserId, setResetPwdUserId] = useState<number>(0);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [assignRoleUserId, setAssignRoleUserId] = useState<number>(0);
  const [initialRoleIds, setInitialRoleIds] = useState<number[]>([]);
  const [allRoles, setAllRoles] = useState<{ key: string; title: string }[]>([]);

  const openUserModal = async (user?: UserVO) => {
    setEditingUser(user ?? null);
  };

  /** 页面挂载时预加载角色列表，避免弹窗打开时下拉数据为空 */
  useEffect(() => {
    getRoleListApi({ pageNum: 1, pageSize: 100 }).then((res) => {
      setAllRoles(res.rows?.map((r) => ({ key: String(r.roleId), title: r.roleName })));
    });
  }, []);

  /** 统一列配置：表格 + 详情（只读表单）+ 新增/编辑（可编辑表单）共用 */
  const columns: ProColumnType<UserVO>[] = useMemo(() => {
    const result: ProColumnType<UserVO>[] = [
      // 搜索框disabled会被编辑弹窗的disabled影响，需要写2个配置
      {
        title: '用户名',
        dataIndex: 'username',
        width: 100,
        hideInForm: true,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        hideInTable: true,
        formItemProps: { rules: [{ required: true, message: '请输入用户名' }] },
        fieldProps: editingUser ? { disabled: true } : undefined,
        search: false,
      },
      ...(!editingUser
        ? [
            {
              title: '密码',
              dataIndex: 'password',
              valueType: 'password',
              hideInTable: true,
              search: false,
              formItemProps: { rules: [{ required: true, message: '请输入密码' }] },
            } as ProColumnType<UserVO>,
          ]
        : []),
      { title: '昵称', dataIndex: 'nickname', width: 100, ellipsis: true },
      { title: '手机号', dataIndex: 'phone', width: 140 },
      { title: '邮箱', dataIndex: 'email', width: 140 },
      {
        title: '角色',
        dataIndex: 'roles',
        hideInForm: true,
        width: 200,
        search: false,
        render: (_, record) =>
          (record.roles?.length && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {record.roles?.map((r) => (
                <Tag
                  key={r.roleId}
                  color='blue'
                >
                  {r.roleName}
                </Tag>
              ))}
            </div>
          )) ||
          '-',
      },
      {
        title: '角色',
        dataIndex: 'roleIds',
        width: 200,
        hideInTable: true,
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
          placeholder: '请选择角色',
          options: allRoles?.map((r) => ({ value: Number(r.key), label: r.title })),
        },
        formItemProps: { rules: [{ required: true, message: '请选择角色' }] },
      },
      {
        title: '性别',
        dataIndex: 'gender',
        search: false,
        valueType: 'select',
        hideInTable: true,
        fieldProps: { options: dictionary.gender },
      },
      {
        title: '账户状态',
        dataIndex: 'status',
        width: 80,
        valueType: 'select',
        hideInForm: true,
        fieldProps: {
          options: [{ label: '全部', value: '' }, ...dictionary.userStatus],
        },
        render: (_, { status }) => (
          <IconStatus
            type='userStatus'
            value={status}
          />
        ),
      },
      {
        title: '账户状态',
        dataIndex: 'status',
        search: false,
        hideInTable: true,
        valueType: 'select',
        fieldProps: {
          options: dictionary.userStatus,
        },
        formItemProps: { rules: [{ required: true, message: '请选择状态' }] },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 160,
        search: false,
        valueType: 'dateTime',
        hideInForm: true,
      },
      {
        title: '操作',
        valueType: 'option',
        width: 200,
        fixed: 'right',
        render: (_, record) => (
          <ActionButtons
            items={[
              {
                key: 'edit',
                perm: 'system:user:edit',
                label: '编辑',
                onClick: () => {
                  openUserModal(record);
                  setFormOpen(true);
                },
              },
              {
                key: 'resetPwd',
                perm: 'system:user:resetPwd',
                label: '重置密码',
                onClick: () => {
                  setResetPwdUserId(record.userId);
                  setResetPwdOpen(true);
                },
              },

              {
                key: 'assignRole',
                perm: 'system:user:role-management',
                label: '分配角色',
                onClick: async () => {
                  setAssignRoleUserId(record.userId);
                  setInitialRoleIds(record.roles?.map((r) => r.roleId));
                  const res = await getRoleListApi({ pageNum: 1, pageSize: 100 });
                  setAllRoles(res.rows?.map((r) => ({ key: String(r.roleId), title: r.roleName })));
                  setAssignRoleOpen(true);
                },
              },
              {
                key: 'detail',
                label: '详情',
                onClick: () => {
                  openUserModal(record);
                  setDetailOpen(true);
                },
              },
              {
                key: 'delete',
                perm: 'system:user:delete',
                label: '删除',
                onClick: async () => {
                  await deleteUserApi(record.userId);
                  message.success('已删除');
                  actionRef.current?.reload();
                },
                confirmTitle: '确定删除吗?',
              },
            ]}
          />
        ),
      },
    ];
    return result;
  }, [allRoles, editingUser]);

  return (
    <>
      <BaseProTable<UserVO>
        headerTitle='用户列表'
        actionRef={actionRef}
        rowKey='userId'
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          const res = await getUserListApi({
            pageNum: params.current,
            pageSize: params.pageSize,
            ...params,
          });
          return { data: res.rows, total: res.total, success: true };
        }}
        columns={columns}
        toolBarRender={() => [
          <PermissionButton
            key='add'
            perm='system:user:add'
            type='primary'
            onClick={() => {
              openUserModal();
              setFormOpen(true);
            }}
          >
            添加
          </PermissionButton>,
        ]}
      />

      {/* 新增 / 编辑 — 与详情共用 columns，TableModal 自动过滤 option 列 */}
      <TableModal
        readonly={false}
        title={editingUser ? '编辑用户' : '添加用户'}
        columns={columns as any}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={
          editingUser
            ? ({ ...editingUser, roleIds: editingUser.roles?.map((r) => r.roleId) } as any)
            : ({ status: 0 } as any)
        }
        onFinish={async (values) => {
          const dto = { ...values } as any;
          if (editingUser) {
            dto.userId = editingUser.userId;
            await updateUserApi(dto);
            message.success('已更新');
          } else {
            await createUserApi(dto);
            message.success('创建成功');
          }
          actionRef.current?.reload();
          return true;
        }}
      />

      {/* 详情 — 只读，columns 中 hideInForm: true 的列自动隐藏 */}
      <TableModal
        title='用户详情'
        columns={columns as any}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        modalProps={{ destroyOnHidden: true }}
        initialValues={{
          ...editingUser,
          roleIds: editingUser?.roles?.map((r) => r.roleId),
        }}
      />

      {/* 重置密码 / 分配角色 — ProForm children 模式，继续使用 BaseModalForm */}
      <BaseModalForm
        title='重置密码'
        width={400}
        open={resetPwdOpen}
        onOpenChange={setResetPwdOpen}
        onFinish={async (values) => {
          await resetPwdApi(resetPwdUserId, values.password);
          message.success('密码已重置');
          return true;
        }}
      >
        <ProFormText.Password
          name='password'
          label='新密码'
          rules={[{ required: true, message: '请输入新密码' }]}
        />
        <ProFormText.Password
          name='confirm'
          label='确认密码'
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        />
      </BaseModalForm>

      <BaseModalForm
        title='分配角色'
        width={400}
        open={assignRoleOpen}
        onOpenChange={setAssignRoleOpen}
        modalProps={{ styles: { body: { paddingBottom: '50px' } } }}
        initialValues={{ roleIds: initialRoleIds }}
        onFinish={async (values) => {
          await assignRolesApi(assignRoleUserId, values.roleIds);
          message.success('已分配');
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormSelect
          name='roleIds'
          label='角色'
          rules={[{ required: true, message: '请选择角色' }]}
          mode='multiple'
          placeholder='请选择角色'
          options={allRoles?.map((r) => ({ value: Number(r.key), label: r.title }))}
        />
      </BaseModalForm>
    </>
  );
}
