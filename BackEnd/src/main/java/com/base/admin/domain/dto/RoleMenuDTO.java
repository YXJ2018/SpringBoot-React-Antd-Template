package com.base.admin.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RoleMenuDTO {

    @NotNull(message = "Role ID cannot be null")
    private Long roleId;

    private List<Long> menuIds;
}
