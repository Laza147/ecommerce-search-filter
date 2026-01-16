package com.shiro.ecommerce.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceRange {

    private Double min;
    private Double max;
}
