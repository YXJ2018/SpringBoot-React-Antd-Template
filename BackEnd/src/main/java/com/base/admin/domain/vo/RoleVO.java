package com.base.admin.domain.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoleVO {
    private Long roleId;
    private String roleName;
    private String roleKey;
    private Integer sortOrder;
    private Integer status;
    private String remark;
    private LocalDateTime createTime;
    private List<Long> menuIds;
}
