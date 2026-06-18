package com.base.admin.controller;

import com.base.admin.annotation.Log;
import com.base.admin.annotation.RequiresPermission;
import com.base.admin.common.PageResult;
import com.base.admin.common.Result;
import com.base.admin.domain.dto.UserDTO;
import com.base.admin.domain.dto.UserRoleDTO;
import com.base.admin.domain.vo.UserVO;
import com.base.admin.service.SysUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/system/user")
@RequiredArgsConstructor
public class SysUserController {

    private final SysUserService userService;

    @GetMapping("/list")
    @RequiresPermission("system:user:list")
    public Result<PageResult<UserVO>> list(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.ok(userService.list(username, nickname, phone, status, pageNum, pageSize));
    }

    @GetMapping("/{userId}")
    @RequiresPermission("system:user:list")
    public Result<UserVO> getById(@PathVariable Long userId) {
        return Result.ok(userService.getById(userId));
    }

    @PostMapping
    @RequiresPermission("system:user:add")
    @Log(title = "用户管理", businessType = 1)
    public Result<Void> create(@Valid @RequestBody UserDTO dto) {
        userService.create(dto);
        return Result.ok();
    }

    @PutMapping
    @RequiresPermission("system:user:edit")
    @Log(title = "用户管理", businessType = 2)
    public Result<Void> update(@Valid @RequestBody UserDTO dto) {
        userService.update(dto);
        return Result.ok();
    }

    @DeleteMapping("/{userId}")
    @RequiresPermission("system:user:delete")
    @Log(title = "用户管理", businessType = 3)
    public Result<Void> delete(@PathVariable Long userId) {
        userService.delete(userId);
        return Result.ok();
    }

    @PutMapping("/resetPwd")
    @RequiresPermission("system:user:resetPwd")
    @Log(title = "用户管理-重置密码", businessType = 2)
    public Result<Void> resetPwd(@RequestBody Map<String, Object> params) {
        Long userId = Long.parseLong(params.get("userId").toString());
        String password = params.get("password").toString();
        userService.resetPwd(userId, password);
        return Result.ok();
    }

    @PutMapping("/changeStatus")
    @RequiresPermission("system:user:edit")
    public Result<Void> changeStatus(@RequestBody Map<String, Object> params) {
        Long userId = Long.parseLong(params.get("userId").toString());
        Integer status = Integer.parseInt(params.get("status").toString());
        userService.changeStatus(userId, status);
        return Result.ok();
    }

    @PutMapping("/assignRoles")
    @RequiresPermission("system:user:edit")
    @Log(title = "用户管理-分配角色", businessType = 2)
    public Result<Void> assignRoles(@Valid @RequestBody UserRoleDTO dto) {
        userService.assignRoles(dto);
        return Result.ok();
    }
}
