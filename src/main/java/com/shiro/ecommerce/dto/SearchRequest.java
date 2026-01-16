package com.shiro.ecommerce.dto;

import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchRequest {

    private String query;

    private Map<String, Set<String>> filters;

    private PriceRange price;

    private String sort;

    private Integer page;

    private Integer limit;

    private List<String> contextCategoryPath;
}
