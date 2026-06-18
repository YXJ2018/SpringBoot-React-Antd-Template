package com.base.admin.controller;

import com.base.admin.common.Result;
import com.base.admin.domain.dto.LoginDTO;
import com.base.admin.domain.vo.LoginVO;
import com.base.admin.domain.vo.UserInfoVO;
import com.base.admin.security.LoginUser;
import com.base.admin.service.SysLoginService;
import com.base.admin.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SysLoginController {

    private final SysLoginService loginService;

    @PostMapping("/auth/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO dto) {
        LoginVO vo = loginService.login(dto);
        return Result.ok(vo);
    }

    @GetMapping("/auth/info")
    public Result<UserInfoVO> getUserInfo() {
        LoginUser currentUser = SecurityUtils.getCurrentUser();
        UserInfoVO info = loginService.getUserInfo(currentUser.getUserId());
        return Result.ok(info);
    }
}
