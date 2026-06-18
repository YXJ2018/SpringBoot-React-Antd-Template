package com.base.admin.controller;

import com.base.admin.annotation.Log;
import com.base.admin.annotation.RequiresPermission;
import com.base.admin.common.PageResult;
import com.base.admin.common.Result;
import com.base.admin.domain.dto.RoleDTO;
import com.base.admin.domain.dto.RoleMenuDTO;
import com.base.admin.domain.vo.RoleVO;
import com.base.admin.service.SysRoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/system/role")
@RequiredArgsConstructor
public class SysRoleController {

    private final SysRoleService roleService;

    @GetMapping("/list")
    @RequiresPermission("system:role:list")
    public Result<PageResult<RoleVO>> list(
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false) String roleKey,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.ok(roleService.list(roleName, roleKey, status, pageNum, pageSize));
    }

    @GetMapping("/{roleId}")
    @RequiresPermission("system:role:list")
    public Result<RoleVO> getById(@PathVariable Long roleId) {
        return Result.ok(roleService.getById(roleId));
    }

    @PostMapping
    @RequiresPermission("system:role:add")
    @Log(title = "角色管理", businessType = 1)
    public Result<Void> create(@Valid @RequestBody RoleDTO dto) {
        roleService.create(dto);
        return Result.ok();
    }

    @PutMapping
    @RequiresPermission("system:role:edit")
    @Log(title = "角色管理", businessType = 2)
    public Result<Void> update(@Valid @RequestBody RoleDTO dto) {
        roleService.update(dto);
        return Result.ok();
    }

    @DeleteMapping("/{roleId}")
    @RequiresPermission("system:role:delete")
    @Log(title = "角色管理", businessType = 3)
    public Result<Void> delete(@PathVariable Long roleId) {
        roleService.delete(roleId);
        return Result.ok();
    }

    @PutMapping("/assignMenus")
    @RequiresPermission("system:role:edit")
    @Log(title = "角色管理-分配菜单", businessType = 2)
    public Result<Void> assignMenus(@Valid @RequestBody RoleMenuDTO dto) {
        roleService.assignMenus(dto);
        return Result.ok();
    }
}
