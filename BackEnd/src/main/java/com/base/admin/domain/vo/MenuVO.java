package com.base.admin.domain.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MenuVO {
    private Long menuId;
    private String menuName;
    private String path;
    private String component;
    private String icon;
    private Integer sortOrder;
    private Integer status;
    private boolean demoProtected;
    private List<MenuVO> children;
}
