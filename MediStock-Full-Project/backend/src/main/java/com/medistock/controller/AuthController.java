package com.medistock.controller;

import com.medistock.dto.request.LoginRequest;
import com.medistock.dto.request.RefreshTokenRequest;
import com.medistock.dto.request.RegisterRequest;
import com.medistock.dto.response.AuthResponse;
import com.medistock.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints:
 *   POST /api/auth/register  - create a new user account (Admin/Pharmacist/Staff)
 *   POST /api/auth/login     - authenticate and receive JWT access + refresh tokens
 *   POST /api/auth/refresh   - exchange a refresh token for a new access token
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }
}
