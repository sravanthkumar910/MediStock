package com.medistock.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierRequest {
    @NotBlank
    private String name;
    private String contactNumber;
    private String email;
    private String address;
    private String notes;
}
