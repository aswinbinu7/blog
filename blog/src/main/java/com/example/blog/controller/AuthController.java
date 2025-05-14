package com.example.blog.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.model.User;
import com.example.blog.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully.");
    }

    // Login and store session + authentication
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest, HttpSession session) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            // Store session manually
            session.setAttribute("userId", user.get().getId());
            session.setAttribute("userEmail", user.get().getEmail());


            // Create Spring Security authentication
            Authentication auth = new UsernamePasswordAuthenticationToken(
                user.get().getEmail(), null,
                List.of(new SimpleGrantedAuthority("ROLE_USER")) // or customize roles
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Return user email in the response
            return ResponseEntity.ok(new LoginResponse(user.get().getEmail()));  // Return the email
        }
        return ResponseEntity.status(401).body("Invalid email or password.");
    }

    // Logout and clear session + context
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext(); // clears Spring context
        return ResponseEntity.ok("Logged out successfully.");
    }

    // Protected route
    @GetMapping("/protected")
    public ResponseEntity<?> protectedRoute(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok("Welcome to the protected route, user ID: " + userId);
    }
}

// Add a LoginResponse DTO class
class LoginResponse {
    private String email;

    public LoginResponse(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
