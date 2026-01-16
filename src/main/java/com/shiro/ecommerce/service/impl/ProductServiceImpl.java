package com.shiro.ecommerce.service.impl;

import com.shiro.ecommerce.dto.ProductResponse;
import com.shiro.ecommerce.exception.ProductNotFoundException;
import com.shiro.ecommerce.model.Product;
import com.shiro.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final MongoTemplate mongoTemplate;

    @Override
    public ProductResponse getById(String productId) {

        Product product =
                mongoTemplate.findById(productId, Product.class);

        if (product == null) {
            throw new ProductNotFoundException(productId);
        }

        return ProductResponse.from(product);
    }
}
