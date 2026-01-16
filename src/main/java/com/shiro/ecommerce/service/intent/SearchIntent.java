package com.shiro.ecommerce.service.intent;

import lombok.*;
import org.springframework.stereotype.Component;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Component
public class SearchIntent {

    private String category;   // resolved category or null
    private String brand;      // resolved brand or null
    private String keyword;    // remaining keyword text
}
