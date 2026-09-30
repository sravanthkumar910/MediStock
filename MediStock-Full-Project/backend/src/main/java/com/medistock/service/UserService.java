package com.medistock.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medistock.dto.request.InviteUserRequest;
import com.medistock.dto.response.InviteUserResponse;
import com.medistock.dto.response.UserResponse;
import com.medistock.entity.RoleName;
import com.medistock.entity.User;
import com.medistock.exception.DuplicateResourceException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    public UserResponse getById(Long id) {
        return UserResponse.from(findEntity(id));
    }

    public InviteUserResponse invite(InviteUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getTemporaryPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();
        User saved = userRepository.save(user);
        return InviteUserResponse.builder()
                .user(UserResponse.from(saved))
                .temporaryPassword(request.getTemporaryPassword())
                .build();
    }

    public UserResponse updateRole(Long id, RoleName role) {
        User user = findEntity(id);
        user.setRole(role);
        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse setEnabled(Long id, boolean enabled) {
        User user = findEntity(id);
        user.setEnabled(enabled);
        return UserResponse.from(userRepository.save(user));
    }

    public void delete(Long id) {
        userRepository.delete(findEntity(id));
    }

    private User findEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
