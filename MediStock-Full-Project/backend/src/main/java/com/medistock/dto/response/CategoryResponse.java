package com.medistock.dto.response;

import com.medistock.entity.Category;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;

    public static CategoryResponse from(Category c) {
        return CategoryResponse.builder()
                .id(c.getId()).name(c.getName()).description(c.getDescription()).build();
    }
}
