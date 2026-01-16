package com.shiro.ecommerce.controller;

import com.shiro.ecommerce.model.Cart;
import com.shiro.ecommerce.model.CartItem;
import com.shiro.ecommerce.repository.CartRepository;
import com.shiro.ecommerce.service.auth.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartRepository cartRepository;

    @PostMapping("/add")
    public Cart addToCart(
            @RequestHeader("X-USER-ID") String userId,
            @RequestBody CartItem incoming
    ) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUserId(userId);
                    return c;
                });

        // 🔥 merge logic (CRITICAL)
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(incoming.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(
                    existing.get().getQuantity() + incoming.getQuantity()
            );
        } else {
            cart.getItems().add(incoming);
        }

        cart.setUpdatedAt(Instant.now());
        return cartRepository.save(cart);
    }

    @GetMapping
    public Cart getCart(@RequestHeader("X-USER-ID") String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUserId(userId);
                    return cartRepository.save(c);
                });
    }

    @DeleteMapping("/remove/{productId}")
    public Cart removeItem(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable String productId
    ) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow();

        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        cart.setUpdatedAt(Instant.now());

        return cartRepository.save(cart);
    }
}

