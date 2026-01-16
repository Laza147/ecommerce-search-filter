package com.shiro.ecommerce.service;

import com.shiro.ecommerce.model.Cart;
import com.shiro.ecommerce.model.CartItem;
import com.shiro.ecommerce.model.Order;
import com.shiro.ecommerce.model.OrderItem;
import com.shiro.ecommerce.model.Product;
import com.shiro.ecommerce.repository.CartRepository;
import com.shiro.ecommerce.repository.OrderRepository;
import com.shiro.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    public OrderService(
            ProductRepository productRepository,
            OrderRepository orderRepository,
            CartRepository cartRepository
    ) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    public Order checkout(String userId, Cart cart) {

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // ✅ Validate & deduct inventory
        for (CartItem item : cart.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for " + product.getTitle()
                );
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        // ✅ Convert Cart → Order
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(i -> {
                    OrderItem oi = new OrderItem();
                    oi.setProductId(i.getProductId());
                    oi.setTitle(i.getTitle());
                    oi.setPrice(i.getPrice());
                    oi.setQuantity(i.getQuantity());
                    return oi;
                })
                .collect(Collectors.toList());


        Order order = new Order();
        order.setUserId(userId);
        order.setItems(orderItems);
        order.setCreatedAt(Instant.now());

        Order saved = orderRepository.save(order);

        // 🧹 Clear cart after checkout
        cartRepository.deleteByUserId(userId);

        return saved;
    }
}
