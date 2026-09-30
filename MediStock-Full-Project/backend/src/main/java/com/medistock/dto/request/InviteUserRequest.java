package com.medistock.dto.request;

import com.medistock.entity.RoleName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InviteUserRequest {
    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    private String phone;

    @NotNull
    private RoleName role;

    @NotBlank
    @Size(min = 6, message = "Temporary password must be at least 6 characters")
    private String temporaryPassword;
}
