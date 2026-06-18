package com.base.admin.domain.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Builder
public class UserInfoVO {
    private Long userId;
    private String username;
    private String nickname;
    private String avatar;
    private List<String> roles;
    private Set<String> permissions;
    private List<MenuVO> menus;
}
