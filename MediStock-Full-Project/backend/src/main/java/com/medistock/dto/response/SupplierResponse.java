package com.medistock.dto.response;

import com.medistock.entity.Supplier;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SupplierResponse {
    private Long id;
    private String name;
    private String contactNumber;
    private String email;
    private String address;
    private String notes;
    private int medicineCount;

    public static SupplierResponse from(Supplier s) {
        return SupplierResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .contactNumber(s.getContactNumber())
                .email(s.getEmail())
                .address(s.getAddress())
                .notes(s.getNotes())
                .medicineCount(s.getMedicines() != null ? s.getMedicines().size() : 0)
                .build();
    }
}
