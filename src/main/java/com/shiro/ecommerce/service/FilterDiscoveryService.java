package com.shiro.ecommerce.service;

import com.shiro.ecommerce.dto.SearchResponse;
import com.shiro.ecommerce.model.Product;

import java.util.List;

public interface FilterDiscoveryService {

    List<SearchResponse.Filter> discover(
            List<Product> products,
            List<String> contextCategoryPath
    );
}

