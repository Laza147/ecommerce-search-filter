package com.shiro.ecommerce.config;

import com.shiro.ecommerce.model.Product;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;

@Configuration
public class MongoIndexConfig {

    private final MongoTemplate mongoTemplate;

    public MongoIndexConfig(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void createIndexes() {

        IndexOperations indexOps = mongoTemplate.indexOps(Product.class);

        // -------------------------------------------------
        // TEXT SEARCH (UPDATED)
        // -------------------------------------------------
        // Was only title earlier — now includes description
        indexOps.createIndex(
                new TextIndexDefinition.TextIndexDefinitionBuilder()
                        .onField("title")
                        .onField("description") // 🔥 NEW
                        .build()
        );

        // -------------------------------------------------
        // CATEGORY + BRAND
        // -------------------------------------------------
        indexOps.createIndex(
                new Index()
                        .on("category", Sort.Direction.ASC)
                        .on("brand", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // CATEGORY PATH (🔥 NEW — MOST IMPORTANT)
        // -------------------------------------------------
        // Supports categoryPath.0, categoryPath.1 prefix queries
        indexOps.createIndex(
                new Index()
                        .on("categoryPath", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // PRICE SLIDER
        // -------------------------------------------------
        indexOps.createIndex(
                new Index().on("price", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // RATING SORT
        // -------------------------------------------------
        indexOps.createIndex(
                new Index()
                        .on("rating", Sort.Direction.DESC)
                        .on("_id", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // NEWEST ARRIVALS
        // -------------------------------------------------
        indexOps.createIndex(
                new Index()
                        .on("createdAt", Sort.Direction.DESC)
                        .on("_id", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // BEST SELLERS
        // -------------------------------------------------
        indexOps.createIndex(
                new Index()
                        .on("salesCount", Sort.Direction.DESC)
                        .on("_id", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // AVAILABILITY
        // -------------------------------------------------
        indexOps.createIndex(
                new Index()
                        .on("availabilityStatus", Sort.Direction.ASC)
                        .on("stock", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // FEATURE FILTERS
        // -------------------------------------------------
        indexOps.createIndex(
                new Index()
                        .on("features.key", Sort.Direction.ASC)
                        .on("features.value", Sort.Direction.ASC)
        );

        // -------------------------------------------------
        // DISCOUNTS
        // -------------------------------------------------
        indexOps.createIndex(
                new Index().on("discountPercentage", Sort.Direction.DESC)
        );
    }
}
