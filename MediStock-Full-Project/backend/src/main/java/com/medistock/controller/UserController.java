package com.medistock.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.dto.request.InviteUserRequest;
import com.medistock.dto.response.InviteUserResponse;
import com.medistock.dto.response.UserResponse;
import com.medistock.entity.RoleName;
import com.medistock.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Admin-only user management.
 *   GET    /api/users            - list all users
 *   GET    /api/users/{id}       - get a user
 *   PATCH  /api/users/{id}/role  - change a user's role
 *   PATCH  /api/users/{id}/status- enable/disable a user
 *   DELETE /api/users/{id}       - remove a user
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User Management (Admin)")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getAll() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PostMapping("/invite")
    public InviteUserResponse invite(@Valid @RequestBody InviteUserRequest request) {
        return userService.invite(request);
    }

    @PatchMapping("/{id}/role")
    public UserResponse updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userService.updateRole(id, RoleName.valueOf(body.get("role")));
    }

    @PatchMapping("/{id}/status")
    public UserResponse setEnabled(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return userService.setEnabled(id, body.getOrDefault("enabled", true));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
