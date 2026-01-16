package com.shiro.ecommerce.service;

import com.shiro.ecommerce.dto.ProductResponse;

public interface ProductService {
    ProductResponse getById(String productId);
}
