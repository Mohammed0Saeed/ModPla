package com.main.modpla.config;

import com.main.modpla.model.Role;
import com.main.modpla.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // secret key (Base64 encoded)
    private final String SECRET = "QW1hemluZ1NlY3JldEtleU5ldmVyVXNlVGhpcyEhMTIzITQ1Ng==";

    // Helper method to generate the correct SecretKey object from your Base64 string
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // generate a token after a successful login
    public String generateToken(String username, Role role) {
        return Jwts.builder()
                .subject(username) // updated from setSubject
                .claim("role", "ROLE_" + role)
                .issuedAt(new Date()) // updated from setIssuedAt
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // updated from setExpiration
                .signWith(getSigningKey()) // updated to use SecretKey (HS256 is automatically inferred)
                .compact();
    }

    // extract the username from the sent token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject(); // Extract subject from the Claims payload
    }

    // validate if the token holds the right username AND is not expired
    public boolean validateToken(String token, User userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getEmail()) && !isTokenExpired(token));
    }

    // --- Private Helper Methods ---

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // updated to use SecretKey
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }
}