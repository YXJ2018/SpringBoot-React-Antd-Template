package com.base.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.base.admin.common.PageResult;
import com.base.admin.domain.dto.UserDTO;
import com.base.admin.domain.dto.UserRoleDTO;
import com.base.admin.domain.entity.SysRole;
import com.base.admin.domain.entity.SysUser;
import com.base.admin.domain.entity.SysUserRole;
import com.base.admin.domain.vo.RoleSimpleVO;
import com.base.admin.domain.vo.UserVO;
import com.base.admin.exception.BusinessException;
import com.base.admin.config.DemoGuard;
import com.base.admin.mapper.SysRoleMapper;
import com.base.admin.mapper.SysUserMapper;
import com.base.admin.mapper.SysUserRoleMapper;
import com.base.admin.service.SysUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SysUserServiceImpl implements SysUserService {

    private final SysUserMapper userMapper;
    private final SysUserRoleMapper userRoleMapper;
    private final SysRoleMapper roleMapper;
    private final PasswordEncoder passwordEncoder;
    private final DemoGuard demoGuard;

    @Override
    public PageResult<UserVO> list(String username, String nickname, String phone, Integer status,
                                   Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(username), SysUser::getUsername, username)
                .like(StringUtils.hasText(nickname), SysUser::getNickname, nickname)
                .like(StringUtils.hasText(phone), SysUser::getPhone, phone)
                .eq(status != null, SysUser::getStatus, status)
                .orderByDesc(SysUser::getCreateTime);

        Page<SysUser> page = userMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
        List<UserVO> rows = page.getRecords().stream().map(this::toUserVO).collect(Collectors.toList());
        return new PageResult<>(page.getTotal(), rows);
    }

    @Override
    public UserVO getById(Long userId) {
        SysUser user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return toUserVO(user);
    }

    @Override
    @Transactional
    public void create(UserDTO dto) {
        // 演示模式：禁止把管理员角色分配给普通用户
        demoGuard.checkAssignRoles(null, dto.getRoleIds());

        long count = userMapper.selectCount(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, dto.getUsername()));
        if (count > 0) {
            throw new BusinessException("用户名不能重复");
        }
        SysUser user = new SysUser();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender() != null ? dto.getGender() : 0);
        user.setStatus(dto.getStatus() != null ? dto.getStatus() : 0);
        user.setRemark(dto.getRemark());
        userMapper.insert(user);

        saveUserRoles(user.getUserId(), dto.getRoleIds());
    }

    @Override
    @Transactional
    public void update(UserDTO dto) {
        demoGuard.checkModifyUser(dto.getUserId(), "编辑");
        // 演示模式：非管理员不允许分配管理员角色
        demoGuard.checkAssignRoles(dto.getUserId(), dto.getRoleIds());

        SysUser user = userMapper.selectById(dto.getUserId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setNickname(dto.getNickname());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setStatus(dto.getStatus());
        user.setRemark(dto.getRemark());
        userMapper.updateById(user);

        if (dto.getRoleIds() != null) {
            saveUserRoles(user.getUserId(), dto.getRoleIds());
        }
    }

    @Override
    @Transactional
    public void delete(Long userId) {
        demoGuard.checkModifyUser(userId, "删除");
        userMapper.deleteById(userId);
        userRoleMapper.deleteByUserId(userId);
    }

    @Override
    public void resetPwd(Long userId, String password) {
        demoGuard.checkModifyUser(userId, "重置密码");
        SysUser user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setPassword(passwordEncoder.encode(password));
        userMapper.updateById(user);
    }

    @Override
    public void changeStatus(Long userId, Integer status) {
        demoGuard.checkModifyUser(userId, "修改状态");
        SysUser user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setStatus(status);
        userMapper.updateById(user);
    }

    @Override
    @Transactional
    public void assignRoles(UserRoleDTO dto) {
        demoGuard.checkModifyUser(dto.getUserId(), "分配角色");
        demoGuard.checkAssignRoles(dto.getUserId(), dto.getRoleIds());
        saveUserRoles(dto.getUserId(), dto.getRoleIds());
    }

    private void saveUserRoles(Long userId, List<Long> roleIds) {
        userRoleMapper.deleteByUserId(userId);
        if (roleIds != null) {
            for (Long roleId : roleIds) {
                SysUserRole ur = new SysUserRole();
                ur.setUserId(userId);
                ur.setRoleId(roleId);
                userRoleMapper.insert(ur);
            }
        }
    }

    private UserVO toUserVO(SysUser user) {
        UserVO vo = new UserVO();
        vo.setUserId(user.getUserId());
        vo.setUsername(user.getUsername());
        vo.setNickname(user.getNickname());
        vo.setEmail(user.getEmail());
        vo.setPhone(user.getPhone());
        vo.setGender(user.getGender());
        vo.setStatus(user.getStatus());
        vo.setRemark(user.getRemark());
        vo.setCreateTime(user.getCreateTime());

        List<SysUserRole> userRoles = userRoleMapper.selectList(
                new LambdaQueryWrapper<SysUserRole>().eq(SysUserRole::getUserId, user.getUserId()));
        List<Long> roleIds = userRoles.stream().map(SysUserRole::getRoleId).collect(Collectors.toList());
        if (!roleIds.isEmpty()) {
            List<SysRole> roles = roleMapper.selectBatchIds(roleIds);
            vo.setRoles(roles.stream().map(r -> {
                RoleSimpleVO rvo = new RoleSimpleVO();
                rvo.setRoleId(r.getRoleId());
                rvo.setRoleName(r.getRoleName());
                return rvo;
            }).collect(Collectors.toList()));
        }
        return vo;
    }
}
