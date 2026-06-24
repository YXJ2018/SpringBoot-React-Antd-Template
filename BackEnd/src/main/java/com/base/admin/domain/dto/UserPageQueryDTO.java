package com.base.admin.domain.dto;

import com.base.admin.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserPageQueryDTO extends PageQuery {

    private String username;
    private String nickname;
    private String phone;
    private String email;
    private List<Long> roleIds;
    private Integer status;
}
