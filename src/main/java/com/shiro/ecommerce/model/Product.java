package com.shiro.ecommerce.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private List<String> images;
    private String title;
    private String brand;
    private String category;
    private Double price;
    private Double discountPercentage;
    private Integer stock;
    private String description;
    // ✅ DEFAULT VALUE (CRITICAL)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.IN_STOCK;

    private Double rating;
    private Integer reviewCount;
    private Integer salesCount;
    private Integer viewsCount;

    private List<Feature> features;

    private Instant createdAt;
    private Instant updatedAt;             // leaf (existing)
    private List<String> categoryPath;
}
