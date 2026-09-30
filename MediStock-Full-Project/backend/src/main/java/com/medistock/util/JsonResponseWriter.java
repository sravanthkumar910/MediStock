package com.medistock.util;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;

/** Small helper to write a consistent JSON error body from filters (outside the DispatcherServlet). */
public class JsonResponseWriter {
    public static void writeError(HttpServletResponse response, int status, String message) {
        response.setStatus(status);
        response.setContentType("application/json");
        try {
            response.getWriter().write(String.format(
                    "{\"timestamp\":\"%s\",\"status\":%d,\"message\":\"%s\"}",
                    LocalDateTime.now(), status, message));
        } catch (IOException ignored) {
        }
    }
}
