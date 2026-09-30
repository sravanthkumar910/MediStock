package com.medistock.controller;

import com.medistock.entity.User;
import com.medistock.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** Small helper to pull the authenticated User entity out of the SecurityContext inside controllers. */
public class CurrentUserResolver {
    public static User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails cud)) {
            return null;
        }
        return cud.getUser();
    }
}
