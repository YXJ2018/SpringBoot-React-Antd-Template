package com.base.admin.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MenuDTO {

    private Long menuId;

    @NotBlank(message = "Menu name cannot be empty")
    private String menuName;

    private Long parentId;
    private Integer sortOrder;
    private String path;
    private String component;

    @NotBlank(message = "Menu type cannot be empty")
    private String menuType;

    private String perms;
    private String icon;
    private Integer visible;
    private Integer status;
    private String remark;
}
