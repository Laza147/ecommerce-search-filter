package com.shiro.ecommerce.model;

import lombok.Data;

@Data
public class CartItem {

    private String productId;
    private String title;
    private String image;
    private Double price;
    private Integer quantity;
}

