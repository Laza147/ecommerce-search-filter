package com.shiro.ecommerce.service.intent.impl;

import com.shiro.ecommerce.dto.SearchResponse;
import com.shiro.ecommerce.model.AvailabilityStatus;
import com.shiro.ecommerce.model.Feature;
import com.shiro.ecommerce.model.Product;
import com.shiro.ecommerce.service.FilterDiscoveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilterDiscoveryServiceImpl implements FilterDiscoveryService {

    @Override
    public List<SearchResponse.Filter> discover(
            List<Product> products,
            List<String> contextCategoryPath
    ) {

        List<SearchResponse.Filter> filters = new ArrayList<>();

        // ---------------------------------------------------------
        // 1. BRAND
        // ---------------------------------------------------------
        Set<String> brands = products.stream()
                .map(Product::getBrand)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (brands.size() > 1) {
            filters.add(SearchResponse.Filter.builder()
                    .key("brand")
                    .type("checkbox")
                    .values(brands)
                    .build());
        }

        // ---------------------------------------------------------
        // 2. CATEGORY PATH (HIERARCHICAL) — CONTEXT AWARE
        // ---------------------------------------------------------
        Map<Integer, Set<String>> levels = new HashMap<>();

        for (Product p : products) {
            if (p.getCategoryPath() == null) continue;

            for (int i = 0; i < p.getCategoryPath().size(); i++) {
                levels
                        .computeIfAbsent(i, k -> new HashSet<>())
                        .add(p.getCategoryPath().get(i));
            }
        }

        if (!levels.isEmpty()) {

            int currentDepth =
                    contextCategoryPath == null
                            ? 0
                            : contextCategoryPath.size();

            Set<String> nextLevelValues =
                    levels.getOrDefault(currentDepth, Set.of());

            boolean isLeaf = nextLevelValues.size() <= 1;

            if (!isLeaf && !nextLevelValues.isEmpty()) {

                Map<Integer, Set<String>> visibleLevels = new HashMap<>();
                visibleLevels.put(currentDepth, nextLevelValues);

                filters.add(SearchResponse.Filter.builder()
                        .key("categoryPath")
                        .type("hierarchical")
                        .levels(visibleLevels)
                        .build());
            }
        }

        // ---------------------------------------------------------
        // 3. CATEGORY (FLAT) — ONLY IF NO HIERARCHY
        // ---------------------------------------------------------
        Set<String> categories = products.stream()
                .map(Product::getCategory)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (levels.isEmpty() && categories.size() > 1) {
            filters.add(SearchResponse.Filter.builder()
                    .key("category")
                    .type("checkbox")
                    .values(categories)
                    .build());
        }

        // ---------------------------------------------------------
        // 4. AVAILABILITY
        // ---------------------------------------------------------
        Set<String> availability = products.stream()
                .map(this::safeAvailability)
                .map(Enum::name)
                .collect(Collectors.toSet());

        if (availability.size() > 1) {
            filters.add(SearchResponse.Filter.builder()
                    .key("availability")
                    .type("checkbox")
                    .values(availability)
                    .build());
        }

        // ---------------------------------------------------------
        // 5. DYNAMIC FEATURES
        // ---------------------------------------------------------
        Map<String, Set<String>> featureMap = new HashMap<>();

        for (Product product : products) {
            if (product.getFeatures() == null) continue;

            for (Feature feature : product.getFeatures()) {
                featureMap
                        .computeIfAbsent(feature.getKey(), k -> new HashSet<>())
                        .add(feature.getValue());
            }
        }

        featureMap.forEach((key, values) -> {
            if (values.size() > 1) {
                filters.add(SearchResponse.Filter.builder()
                        .key(key)
                        .type("checkbox")
                        .values(values)
                        .build());
            }
        });

        return filters;
    }

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------
    private AvailabilityStatus safeAvailability(Product p) {
        return p.getAvailabilityStatus() != null
                ? p.getAvailabilityStatus()
                : AvailabilityStatus.OUT_OF_STOCK;
    }
}
