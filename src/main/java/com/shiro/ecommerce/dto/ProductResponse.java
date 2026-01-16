package com.shiro.ecommerce.dto;

import com.shiro.ecommerce.model.Feature;
import com.shiro.ecommerce.model.Product;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
@Builder
public class ProductResponse {

    private String id;
    private String title;
    private String brand;
    private String category;
    private List<String> categoryPath;
    private double price;
    private double rating;
    private int reviewCount;
    private int stock;
    private String availabilityStatus;
    private List<Feature> features;
    private Instant createdAt;

    public static ProductResponse from(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .brand(p.getBrand())
                .category(p.getCategory())
                .categoryPath(p.getCategoryPath())
                .price(p.getPrice())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .stock(p.getStock())
                .availabilityStatus(
                        p.getAvailabilityStatus() != null
                                ? p.getAvailabilityStatus().name()
                                : "UNKNOWN"
                )
                .features(p.getFeatures())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
