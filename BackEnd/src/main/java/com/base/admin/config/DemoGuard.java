package com.base.admin.config;

import com.base.admin.mapper.SysMenuMapper;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DemoGuard {

    @Value("${demo.enabled:false}")
    @Getter
    private boolean enabled;

    private final SysMenuMapper menuMapper;

    /** 启动时快照：演示模式下所有已存在的菜单 ID，后续新增的不在此集合中，可自由操作 */
    private Set<Long> protectedMenuIds = Set.of();

    public static final Long ADMIN_USER_ID = 1L;
    public static final Long ADMIN_ROLE_ID = 1L;
    public static final String ADMIN_ROLE_KEY = "admin";

    @PostConstruct
    void snapshotProtectedMenus() {
        if (!enabled) return;
        this.protectedMenuIds = menuMapper.selectList(null).stream()
                .map(m -> m.getMenuId())
                .collect(Collectors.toUnmodifiableSet());
    }

    // ── 用户 ──

    public void checkModifyUser(Long userId, String action) {
        if (!enabled) return;
        if (ADMIN_USER_ID.equals(userId)) {
            throw new com.base.admin.exception.BusinessException("演示模式：不允许" + action + "超级管理员");
        }
    }

    public void checkAssignRoles(Long userId, java.util.List<Long> roleIds) {
        if (!enabled) return;
        // 非管理员用户不允许分配管理员角色
        if (!ADMIN_USER_ID.equals(userId)
                && roleIds != null
                && roleIds.contains(ADMIN_ROLE_ID)) {
            throw new com.base.admin.exception.BusinessException("演示模式：不允许将超级管理员角色分配给普通用户");
        }
    }

    // ── 角色 ──

    public void checkModifyRole(Long roleId, String action) {
        if (!enabled) return;
        if (ADMIN_ROLE_ID.equals(roleId)) {
            throw new com.base.admin.exception.BusinessException("演示模式：不允许" + action + "超级管理员角色");
        }
    }

    public void checkAssignMenus(Long roleId) {
        if (!enabled) return;
        if (ADMIN_ROLE_ID.equals(roleId)) {
            throw new com.base.admin.exception.BusinessException("演示模式：不允许修改超级管理员角色的权限配置");
        }
    }

    // ── 菜单 ──

    public void checkModifyMenu(Long menuId, String action) {
        if (!enabled) return;
        if (protectedMenuIds.contains(menuId)) {
            throw new com.base.admin.exception.BusinessException("演示模式：不允许" + action + "初始菜单");
        }
    }

    public void checkDeleteMenu(Long menuId) {
        checkModifyMenu(menuId, "删除");
    }

    public void checkUpdateMenu(Long menuId) {
        checkModifyMenu(menuId, "编辑");
    }

    public boolean isMenuProtected(Long menuId) {
        return enabled && protectedMenuIds.contains(menuId);
    }
}
