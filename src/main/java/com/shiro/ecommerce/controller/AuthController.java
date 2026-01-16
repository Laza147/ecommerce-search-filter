package com.shiro.ecommerce.controller;

import com.shiro.ecommerce.model.User;
import com.shiro.ecommerce.repository.UserRepository;
import com.shiro.ecommerce.service.auth.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            UserRepository userRepository,
            BCryptPasswordEncoder encoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");

        if (email == null || password == null || name == null) {
            throw new RuntimeException("Invalid request");
        }

        // ✅ Gmail only
        if (!email.endsWith("@gmail.com")) {
            throw new RuntimeException("Email must be a valid @gmail.com address");
        }

        // ✅ Only minimum length (ANY characters allowed)
        if (password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));

        userRepository.save(user);

        return Map.of(
                "token", jwtUtil.generateToken(email)
        );
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {

        System.out.println("LOGIN BODY: " + body);

        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return Map.of(
                "token", jwtUtil.generateToken(email)
        );
    }
}
