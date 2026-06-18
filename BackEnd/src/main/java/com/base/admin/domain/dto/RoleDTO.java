package com.base.admin.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleDTO {

    private Long roleId;

    @NotBlank(message = "Role name cannot be empty")
    private String roleName;

    @NotBlank(message = "Role key cannot be empty")
    private String roleKey;

    private Integer sortOrder;
    private Integer status;
    private String remark;
}
