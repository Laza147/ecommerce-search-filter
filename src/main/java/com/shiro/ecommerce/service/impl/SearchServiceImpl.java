package com.shiro.ecommerce.service.impl;

import com.shiro.ecommerce.dto.*;
import com.shiro.ecommerce.exception.*;
import com.shiro.ecommerce.model.Product;
import com.shiro.ecommerce.service.FilterDiscoveryService;
import com.shiro.ecommerce.service.SearchService;
import com.shiro.ecommerce.service.intent.IntentParserService;
import com.shiro.ecommerce.service.intent.SearchIntent;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final MongoTemplate mongoTemplate;
    private final IntentParserService intentParserService;
    private final FilterDiscoveryService filterDiscoveryService;

    @Override
    public SearchResponse search(SearchRequest request) {

        if (request == null) {
            throw new BadSearchRequestException("Search request cannot be null");
        }

        if (request.getPage() < 0 || request.getLimit() < 0) {
            throw new InvalidPaginationException(
                    request.getPage(),
                    request.getLimit()
            );
        }

        try {
            SearchIntent intent = intentParserService.parse(request.getQuery());

            Query query = new Query();
            List<Criteria> criteriaList = new ArrayList<>();

            /* =====================================================
               1️⃣ STRICT CATEGORY PATH (CORE NAVIGATION)
               ===================================================== */
            if (request.getContextCategoryPath() != null &&
                    !request.getContextCategoryPath().isEmpty()) {

                criteriaList.add(
                        Criteria.where("categoryPath")
                                .exists(true)
                                .ne(null)
                );

                List<String> ctxPath = request.getContextCategoryPath()
                        .stream()
                        .map(String::toLowerCase)
                        .toList();

                for (int i = 0; i < ctxPath.size(); i++) {
                    criteriaList.add(
                            Criteria.where("categoryPath." + i)
                                    .regex("^" + ctxPath.get(i) + "$", "i")

                    );
                }
            }


            /* =====================================================
               2️⃣ SOFT CATEGORY FROM INTENT
               ===================================================== */
            if ((request.getContextCategoryPath() == null ||
                    request.getContextCategoryPath().isEmpty())
                    && intent.getCategory() != null
                    && !intent.getCategory().isBlank()) {

                criteriaList.add(
                        Criteria.where("category")
                                .is(intent.getCategory())
                );
            }

            /* =====================================================
               3️⃣ BRAND INTENT
               ===================================================== */
            if (intent.getBrand() != null && !intent.getBrand().isBlank()) {
                criteriaList.add(
                        Criteria.where("brand")
                                .is(intent.getBrand())
                );
            }

            /* =====================================================
               4️⃣ KEYWORD SEARCH (TEXT ONLY — SAFE)
               ===================================================== */
            if (intent.getKeyword() != null && !intent.getKeyword().isBlank()) {
                criteriaList.add(
                        new Criteria().orOperator(
                                Criteria.where("title")
                                        .regex(intent.getKeyword(), "i"),
                                Criteria.where("description")
                                        .regex(intent.getKeyword(), "i")
                        )
                );
            }

            /* =====================================================
               5️⃣ CHECKBOX FILTERS
               ===================================================== */
            applyCheckboxFilters(criteriaList, request);

            /* =====================================================
               6️⃣ PRICE FILTER
               ===================================================== */
            applyPriceFilter(criteriaList, request.getPrice());

            /* =====================================================
               7️⃣ APPLY ALL CRITERIA ONCE
               ===================================================== */
            if (!criteriaList.isEmpty()) {
                query.addCriteria(
                        new Criteria().andOperator(
                                criteriaList.toArray(new Criteria[0])
                        )
                );
            }

            /* =====================================================
               8️⃣ PRICE SLIDER RANGE
               ===================================================== */
            PriceRange sliderRange = computePriceRange(query);

            /* =====================================================
               9️⃣ SORTING (ONLY IF EXPLICIT)
               ===================================================== */
            applySorting(query, request.getSort());

            /* =====================================================
               🔟 EXECUTE QUERY
               ===================================================== */
            List<Product> allProducts =
                    mongoTemplate.find(query, Product.class);

            /* =====================================================
               1️⃣1️⃣ DEFAULT RANKING
               ===================================================== */
            if (request.getSort() == null || request.getSort().isBlank()) {
                allProducts.sort(
                        Comparator.comparingDouble(this::computeRankingScore)
                                .reversed()
                                .thenComparing(Product::getId)
                );
            }

            /* =====================================================
               1️⃣2️⃣ PAGINATION
               ===================================================== */
            int page = Math.max(request.getPage(), 0);
            int limit = request.getLimit() > 0 ? request.getLimit() : 20;

            int fromIndex = Math.min(page * limit, allProducts.size());
            int toIndex = Math.min(fromIndex + limit, allProducts.size());

            List<Product> products =
                    allProducts.subList(fromIndex, toIndex);

            long total = allProducts.size();

            /* =====================================================
               1️⃣3️⃣ FILTER DISCOVERY
               ===================================================== */
            List<SearchResponse.Filter> filters =
                    new ArrayList<>(
                            filterDiscoveryService.discover(
                                    products,
                                    request.getContextCategoryPath()
                            )
                    );

            if (sliderRange.getMin() != null && sliderRange.getMax() != null) {
                filters.add(
                        SearchResponse.Filter.builder()
                                .key("price")
                                .type("slider")
                                .min(sliderRange.getMin())
                                .max(sliderRange.getMax())
                                .build()
                );
            }

            /* =====================================================
               1️⃣4️⃣ BREADCRUMB
               ===================================================== */
            List<String> breadcrumb =
                    request.getContextCategoryPath() != null
                            ? request.getContextCategoryPath()
                            : computeBreadcrumb(products);

            boolean filtersApplied =
                    (request.getFilters() != null &&
                            !request.getFilters().isEmpty())
                            || (request.getContextCategoryPath() != null &&
                            !request.getContextCategoryPath().isEmpty());

            /* =====================================================
               1️⃣5️⃣ RESPONSE
               ===================================================== */
            return SearchResponse.builder()
                    .products(products)
                    .filters(filters)
                    .breadcrumb(breadcrumb)
                    .sortOptions(List.of(
                            SortOption.builder().key("price_asc").label("Price: Low to High").build(),
                            SortOption.builder().key("price_desc").label("Price: High to Low").build(),
                            SortOption.builder().key("rating_desc").label("Customer Rating").build(),
                            SortOption.builder().key("newest").label("Newest Arrivals").build(),
                            SortOption.builder().key("best_sellers").label("Best Sellers").build()
                    ))
                    .meta(Meta.builder()
                            .totalResults(total)
                            .page(page)
                            .limit(limit)
                            .filtersApplied(filtersApplied)
                            .relaxed(false)
                            .build())
                    .build();

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new SearchExecutionException(e);
        }
    }

    /* ================= HELPERS ================= */

    private void applyCheckboxFilters(
            List<Criteria> criteriaList,
            SearchRequest request
    ) {
        if (request.getFilters() == null) return;

        request.getFilters().forEach((key, values) -> {
            if (values == null || values.isEmpty()) return;

            switch (key) {
                case "brand" ->
                        criteriaList.add(
                                Criteria.where("brand").in(values)
                        );
                case "category" ->
                        criteriaList.add(
                                Criteria.where("category").in(values)
                        );
                case "availability" ->
                        criteriaList.add(
                                Criteria.where("availabilityStatus").in(values)
                        );
                case "discount" ->
                        criteriaList.add(
                                Criteria.where("discountPercentage")
                                        .gte(parseDiscount(values))
                        );
                default ->
                        criteriaList.add(
                                Criteria.where("features")
                                        .elemMatch(
                                                Criteria.where("key").is(key)
                                                        .and("value").in(values)
                                        )
                        );
            }
        });
    }

    private void applyPriceFilter(
            List<Criteria> criteriaList,
            PriceRange price
    ) {
        if (price == null) return;

        Criteria c = Criteria.where("price");

        if (price.getMin() != null) c.gte(price.getMin());
        if (price.getMax() != null) c.lte(price.getMax());

        criteriaList.add(c);
    }

    private PriceRange computePriceRange(Query baseQuery) {

        List<Document> pipeline = new ArrayList<>();

        if (!baseQuery.getQueryObject().isEmpty()) {
            pipeline.add(new Document("$match", baseQuery.getQueryObject()));
        }

        pipeline.add(
                new Document("$group",
                        new Document("_id", null)
                                .append("min", new Document("$min", "$price"))
                                .append("max", new Document("$max", "$price"))
                )
        );

        List<Document> result = mongoTemplate
                .getCollection("products")
                .aggregate(pipeline)
                .into(new ArrayList<>());

        if (result.isEmpty()) return PriceRange.builder().build();

        Document doc = result.get(0);

        return PriceRange.builder()
                .min(((Number) doc.get("min")).doubleValue())
                .max(((Number) doc.get("max")).doubleValue())
                .build();
    }

    private int parseDiscount(Set<String> values) {
        return values.stream()
                .map(v -> v.replace("+", ""))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
    }

    private void applySorting(Query query, String sortKey) {

        if (sortKey == null || sortKey.isBlank()) return;

        switch (sortKey) {
            case "price_asc" ->
                    query.with(Sort.by(Sort.Direction.ASC, "price"));
            case "price_desc" ->
                    query.with(Sort.by(Sort.Direction.DESC, "price"));
            case "rating_desc" ->
                    query.with(Sort.by(Sort.Direction.DESC, "rating"));
            case "newest" ->
                    query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "best_sellers" ->
                    query.with(Sort.by(Sort.Direction.DESC, "salesCount"));
        }
    }

    private List<String> computeBreadcrumb(List<Product> products) {

        if (products == null || products.isEmpty()) return List.of();

        List<List<String>> paths = products.stream()
                .map(Product::getCategoryPath)
                .filter(Objects::nonNull)
                .toList();

        if (paths.isEmpty()) return List.of();

        List<String> first = paths.get(0);
        List<String> breadcrumb = new ArrayList<>();

        for (int i = 0; i < first.size(); i++) {
            int idx = i;
            String val = first.get(i);

            boolean allMatch = paths.stream()
                    .allMatch(p -> p.size() > idx && p.get(idx).equals(val));

            if (allMatch) breadcrumb.add(val);
            else break;
        }
        return breadcrumb;
    }

    private double computeRankingScore(Product p) {

        double salesScore = p.getSalesCount() * 0.4;
        double ratingScore = p.getRating() * 0.3;
        double reviewScore = p.getReviewCount() * 0.2;
        double freshnessScore = freshnessScore(p) * 0.1;

        return salesScore + ratingScore + reviewScore + freshnessScore;
    }

    private double freshnessScore(Product p) {

        if (p.getCreatedAt() == null) return 0.0;

        Instant created =
                p.getCreatedAt()
                        .atZone(ZoneId.systemDefault())
                        .toInstant();

        long daysOld =
                Duration.between(created, Instant.now()).toDays();

        if (daysOld <= 7) return 1.0;
        if (daysOld <= 30) return 0.7;
        if (daysOld <= 90) return 0.4;
        return 0.1;
    }
}
