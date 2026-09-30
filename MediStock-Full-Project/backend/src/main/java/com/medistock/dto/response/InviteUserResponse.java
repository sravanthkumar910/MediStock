package com.medistock.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class InviteUserResponse {
    private UserResponse user;
    private String temporaryPassword;
}
