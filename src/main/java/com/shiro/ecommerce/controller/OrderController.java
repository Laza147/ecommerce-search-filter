package com.shiro.ecommerce.controller;

import com.shiro.ecommerce.model.*;
import com.shiro.ecommerce.repository.CartRepository;
import com.shiro.ecommerce.repository.OrderRepository;
import com.shiro.ecommerce.repository.ProductRepository;
import com.shiro.ecommerce.service.auth.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final JwtUtil jwtUtil;
    @GetMapping
    public List<Order> getOrders(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return orderRepository.findByUserId(userId);
    }

    @PostMapping("/checkout")
    public Order checkout(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody List<OrderItem> items
    ) {
        // 🔒 BASIC VALIDATION
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Order cannot be empty");
        }
        System.out.println("AUTH HEADER = " + authHeader);
        System.out.println("ITEMS = " + items);

        // 🔐 Extract userId from JWT
        String token = authHeader.substring(7); // remove "Bearer "
        String userId = jwtUtil.extractUserId(token);

        double total = 0;

        // 🔒 STOCK VALIDATION + PRICE NORMALIZATION
        for (OrderItem item : items) {

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found: " + item.getProductId())
                    );

            // 🧮 STOCK CHECK
            if (product.getStock() == null || product.getStock() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for " + product.getTitle()
                );
            }

            // ✅ NEVER TRUST FRONTEND PRICE
            double price = product.getPrice();
            int qty = item.getQuantity();

            total += price * qty;

            // 📦 DEDUCT INVENTORY
            product.setStock(product.getStock() - qty);

            if (product.getStock() == 0) {
                product.setAvailabilityStatus(AvailabilityStatus.OUT_OF_STOCK);
            }

            productRepository.save(product);

            // 🧾 NORMALIZE ORDER ITEM (SAFE COPY)
            item.setTitle(product.getTitle());
            item.setPrice(price);
        }

        // 🧾 CREATE ORDER
        Order order = new Order();
        order.setUserId(userId);
        order.setItems(items);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(Instant.now());

        Order savedOrder = orderRepository.save(order);

        // 🧹 CLEAR USER CART AFTER SUCCESSFUL CHECKOUT
        cartRepository.deleteByUserId(userId);

        return savedOrder;
    }
}
