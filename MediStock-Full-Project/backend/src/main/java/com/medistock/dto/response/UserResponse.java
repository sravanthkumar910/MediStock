package com.medistock.dto.response;

import com.medistock.entity.RoleName;
import com.medistock.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private RoleName role;
    private boolean enabled;

    public static UserResponse from(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .enabled(u.isEnabled())
                .build();
    }
}
