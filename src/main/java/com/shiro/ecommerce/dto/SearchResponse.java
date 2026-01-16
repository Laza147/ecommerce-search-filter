package com.shiro.ecommerce.dto;

import com.shiro.ecommerce.model.Product;
import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponse {

    private List<Product> products;

    private List<Filter> filters;

    private List<SortOption> sortOptions;

    private Meta meta;
    private List<String> breadcrumb;
    @Data
    @Builder
    public static class Filter {

        private String key;     // brand, availability, categoryPath, price
        private String type;    // checkbox | slider | hierarchical

        // checkbox
        private Set<String> values;
        // hierarchical
        private Map<Integer, Set<String>> levels;

        // slider (price)
        private Double min;
        private Double max;
    }
}
