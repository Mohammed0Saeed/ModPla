package com.main.modpla.service;

import com.main.modpla.model.User;
import com.main.modpla.repo.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class UserService implements UserDetailsService {
    UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public User loadUserByUsername(String email) {
        return userRepository.findByEmail(email);
    }

    // Get the roles
    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    public void registerUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User is empty");
        }
        userRepository.save(user);
    }

    public User findUserById(long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
