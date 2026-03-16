package com.main.modpla.controller;

import com.main.modpla.config.JwtUtil;
import com.main.modpla.model.Role;
import com.main.modpla.model.User;
import com.main.modpla.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController {
    @Autowired
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public void register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User userRequest) {
        try {
            User user = userService.loadUserByUsername(userRequest.getEmail());
            if (!passwordEncoder.matches(userRequest.getPassword(), user.getPassword())) {
                System.out.println("Wrong Password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("Username", user.getName());
            response.put("role", user.getRole());

            System.out.println("Token created: " + response);
            return ResponseEntity.ok(response);
        }

        catch (Exception e) {
            System.out.println(e.getMessage());
            throw new UsernameNotFoundException("Invalid email or password");
        }
    }
}
