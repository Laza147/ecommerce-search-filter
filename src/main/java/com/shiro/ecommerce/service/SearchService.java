package com.shiro.ecommerce.service;

import com.shiro.ecommerce.dto.SearchRequest;
import com.shiro.ecommerce.dto.SearchResponse;

public interface SearchService {

    SearchResponse search(SearchRequest request);
}
