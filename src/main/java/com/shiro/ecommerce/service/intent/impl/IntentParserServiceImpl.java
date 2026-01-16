package com.shiro.ecommerce.service.intent.impl;

import com.shiro.ecommerce.service.intent.IntentParserService;
import com.shiro.ecommerce.service.intent.SearchIntent;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class IntentParserServiceImpl implements IntentParserService {

    // Temporary vocab (can move to DB later)
    private static final Set<String> CATEGORIES =
            Set.of("mobiles", "laptops", "electronics", "shoes", "fashion");

    private static final Set<String> BRANDS =
            Set.of("samsung", "apple", "sony", "nike", "adidas");

    @Override
    public SearchIntent parse(String rawQuery) {

        if (rawQuery == null || rawQuery.isBlank()) {
            return SearchIntent.builder().build();
        }

        String query = rawQuery.toLowerCase().trim();
        String[] tokens = query.split("\\s+");

        String category = null;
        String brand = null;
        StringBuilder keywordBuilder = new StringBuilder();

        for (String token : tokens) {

            if (category == null && CATEGORIES.contains(token)) {
                category = capitalize(token);

            } else if (brand == null && BRANDS.contains(token)) {
                brand = capitalize(token);

            } else {
                keywordBuilder.append(token).append(" ");
            }
        }

        String keyword =
                keywordBuilder.toString().trim().isEmpty()
                        ? null
                        : keywordBuilder.toString().trim();

        return SearchIntent.builder()
                .category(category)   // e.g. "Mobiles"
                .brand(brand)         // e.g. "Samsung"
                .keyword(keyword)     // null or actual keyword
                .build();
    }

    private String capitalize(String value) {
        if (value == null || value.isEmpty()) return value;
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }
}
