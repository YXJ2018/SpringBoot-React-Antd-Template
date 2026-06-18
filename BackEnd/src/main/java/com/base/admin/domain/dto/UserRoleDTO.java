package com.base.admin.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UserRoleDTO {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    private List<Long> roleIds;
}
