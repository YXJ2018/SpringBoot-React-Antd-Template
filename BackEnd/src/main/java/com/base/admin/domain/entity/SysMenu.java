package com.base.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.base.admin.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_menu")
public class SysMenu extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long menuId;
    private String menuName;
    private Long parentId;
    private Integer sortOrder;
    private String path;
    private String component;
    private String menuType;
    private String perms;
    private String icon;
    private Integer visible;
    private Integer status;
    private String remark;

    /** 演示模式下是否受保护（不可编辑/删除），非数据库字段 */
    @TableField(exist = false)
    private boolean demoProtected;
}
