package com.base.admin.domain.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserVO {
    private Long userId;
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private Integer gender;
    private Integer status;
    private String remark;
    private LocalDateTime createTime;
    private List<RoleSimpleVO> roles;
}
