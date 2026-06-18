package com.base.admin.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class UserDTO {

    private Long userId;

    @NotBlank(message = "Username cannot be empty")
    private String username;

    private String password;
    private String nickname;
    private String email;
    private String phone;
    private Integer gender;
    private Integer status;
    private String remark;
    private List<Long> roleIds;
}
