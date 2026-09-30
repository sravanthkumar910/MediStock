package com.medistock.dto.response;

import java.time.LocalDateTime;

import com.medistock.entity.StockLog;
import com.medistock.entity.StockMovementType;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StockLogResponse {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private StockMovementType movementType;
    private Integer quantityChanged;
    private Integer quantityAfter;
    private UserResponse performedBy;
    private String remarks;
    private LocalDateTime createdAt;

    public static StockLogResponse from(StockLog log) {
        return StockLogResponse.builder()
                .id(log.getId())
                .medicineId(log.getMedicine().getId())
                .medicineName(log.getMedicine().getName())
                .movementType(log.getMovementType())
                .quantityChanged(log.getQuantityChanged())
                .quantityAfter(log.getQuantityAfter())
                .performedBy(log.getPerformedBy() == null ? null : UserResponse.from(log.getPerformedBy()))
                .remarks(log.getRemarks())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
