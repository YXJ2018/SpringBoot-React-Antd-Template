import { useRef, useState } from 'react';
import { ProFormText, ProFormSelect } from '@ant-design/pro-components';
import type { ActionType, ProColumnType } from '@ant-design/pro-components';
import BaseProTable from '@/components/BaseProTable';
import BaseModalForm from '@/components/BaseModalForm/index';
import { message, Tag } from 'antd';
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi, resetPwdApi, assignRolesApi } from '@/api/user';
import { getRoleListApi } from '@/api/role';
import PermissionButton from '@/components/Buttons/PermissionButton';
import ActionButtons from '@/components/Buttons/ActionButtons';
import DetailModal from '@/components/DetailModal';
import dictionary from '@/dictionary';
import IconStatus from '@/components/IconStatus';
import type { UserVO } from '@/types/user';

export default function UserManage() {
  const actionRef = useRef<ActionType>(null);
  const [editingUser, setEditingUser] = useState<UserVO | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [resetPwdUserId, setResetPwdUserId] = useState<number>(0);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [assignRoleUserId, setAssignRoleUserId] = useState<number>(0);
  const [initialRoleIds, setInitialRoleIds] = useState<number[]>([]);
  const [allRoles, setAllRoles] = useState<{ key: string; title: string }[]>([]);

  const openUserModal = async (user?: UserVO) => {
    setEditingUser(user ?? null);
    const res = await getRoleListApi({ pageNum: 1, pageSize: 100 });
    setAllRoles(res.rows?.map((r) => ({ key: String(r.roleId), title: r.roleName })));
  };

  const columns: ProColumnType<UserVO>[] = [
    { title: '用户名', dataIndex: 'username', width: 100 },
    { title: '昵称', dataIndex: 'nickname', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 140, search: false },
    { title: '邮箱', dataIndex: 'email', width: 140, search: false },
    {
      title: '角色类别',
      dataIndex: 'roles',
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
      title: '账户状态',
      dataIndex: 'status',
      width: 80,
      valueType: 'select',
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
    { title: '创建时间', dataIndex: 'createTime', width: 160, search: false, valueType: 'dateTime' },
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
                setModalOpen(true);
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
            // 详情不需要权限
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
            username: params.username,
            nickname: params.nickname,
            status: params.status,
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
              setModalOpen(true);
            }}
          >
            添加
          </PermissionButton>,
        ]}
      />

      {/* 详情弹窗使用schemaForm组件配置形式 */}
      <DetailModal
        title='用户详情'
        columns={columns as any}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        initialValues={{
          ...editingUser,
          roles: editingUser?.roles?.map((r) => r.roleName).join('、'),
        }}
      />

      {/* 编辑和新增使用ProForm组件形式 */}
      <BaseModalForm
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialValues={
          (editingUser ? { ...editingUser, roleIds: editingUser.roles?.map((r) => r.roleId) } : { status: 0 }) as any
        }
        grid
        rowProps={{ gutter: 32 }}
        colProps={{ span: 12 }}
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
      >
        <ProFormText
          name='username'
          label='用户名'
          rules={[{ required: true }]}
          disabled={!!editingUser}
        />
        {!editingUser && (
          <ProFormText.Password
            name='password'
            label='密码'
            rules={[{ required: true }]}
          />
        )}
        <ProFormSelect
          name='roleIds'
          label='分配角色'
          mode='multiple'
          placeholder='请选择角色'
          rules={[{ required: true, message: '请选择角色' }]}
          options={allRoles?.map((r) => ({ value: Number(r.key), label: r.title }))}
        />
        <ProFormText
          name='nickname'
          label='昵称'
        />
        <ProFormText
          name='phone'
          label='手机号'
        />
        <ProFormText
          name='email'
          label='邮箱'
        />
        <ProFormSelect
          name='gender'
          label='性别'
          options={dictionary.gender}
        />
        <ProFormSelect
          name='status'
          label='账户状态'
          rules={[{ required: true, message: '请选择状态' }]}
          options={dictionary.userStatus}
        />
      </BaseModalForm>

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
