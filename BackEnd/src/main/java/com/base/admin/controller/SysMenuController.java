package com.base.admin.controller;

import com.base.admin.annotation.Log;
import com.base.admin.annotation.RequiresPermission;
import com.base.admin.common.Result;
import com.base.admin.domain.dto.MenuDTO;
import com.base.admin.domain.entity.SysMenu;
import com.base.admin.domain.vo.MenuVO;
import com.base.admin.service.SysMenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system/menu")
@RequiredArgsConstructor
public class SysMenuController {

    private final SysMenuService menuService;

    @GetMapping("/list")
    @RequiresPermission("system:menu:list")
    public Result<List<SysMenu>> list() {
        return Result.ok(menuService.list());
    }

    @GetMapping("/tree")
    @RequiresPermission("system:menu:list")
    public Result<List<MenuVO>> tree() {
        return Result.ok(menuService.tree());
    }

    @GetMapping("/{menuId}")
    @RequiresPermission("system:menu:list")
    public Result<SysMenu> getById(@PathVariable Long menuId) {
        return Result.ok(menuService.getById(menuId));
    }

    @PostMapping
    @RequiresPermission("system:menu:add")
    @Log(title = "菜单管理", businessType = 1)
    public Result<Void> create(@Valid @RequestBody MenuDTO dto) {
        menuService.create(dto);
        return Result.ok();
    }

    @PutMapping
    @RequiresPermission("system:menu:edit")
    @Log(title = "菜单管理", businessType = 2)
    public Result<Void> update(@Valid @RequestBody MenuDTO dto) {
        menuService.update(dto);
        return Result.ok();
    }

    @DeleteMapping("/{menuId}")
    @RequiresPermission("system:menu:delete")
    @Log(title = "菜单管理", businessType = 3)
    public Result<Void> delete(@PathVariable Long menuId) {
        menuService.delete(menuId);
        return Result.ok();
    }
}
