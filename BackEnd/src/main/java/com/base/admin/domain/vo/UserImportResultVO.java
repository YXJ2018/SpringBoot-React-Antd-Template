package com.base.admin.domain.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserImportResultVO {

    private int totalCount;
    private int successCount;
    private int failureCount;
    private List<UserImportErrorVO> errors = new ArrayList<>();

    @Data
    @AllArgsConstructor
    public static class UserImportErrorVO {
        private int rowIndex;
        private String field;
        private String message;
    }
}
