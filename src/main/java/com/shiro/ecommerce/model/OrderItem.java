package com.shiro.ecommerce.model;

import lombok.Data;

@Data
public class OrderItem {
    private String productId;
    private String title;
    private Double price;
    private Integer quantity;
}
