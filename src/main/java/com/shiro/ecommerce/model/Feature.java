package com.shiro.ecommerce.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feature {

    private String key;        // e.g. "ram", "storage", "color"
    private String value;      // e.g. "8GB", "256GB", "Black"

    /*
     * IMPORTANT:
     * All features are CHECKBOX-based.
     * No ranges here.
     * Price is handled separately.
     */
}
