package com.shiro.ecommerce.controller;

import com.shiro.ecommerce.dto.SearchRequest;
import com.shiro.ecommerce.dto.SearchResponse;
import com.shiro.ecommerce.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @PostMapping("/search")
    public SearchResponse search(@RequestBody SearchRequest request) {
        return searchService.search(request);
    }
}

