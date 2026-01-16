package com.shiro.ecommerce.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meta {

    private long totalResults;
    private int page;
    private int limit;
    private boolean filtersApplied;
    /*
     * Indicates if query relaxation was applied
     */
    private boolean relaxed;
}
