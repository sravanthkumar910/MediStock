package com.medistock.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medistock.dto.response.StockLogResponse;
import com.medistock.entity.Medicine;
import com.medistock.entity.StockLog;
import com.medistock.entity.StockMovementType;
import com.medistock.entity.User;
import com.medistock.repository.StockLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StockLogService {

    private final StockLogRepository stockLogRepository;

    public StockLog record(Medicine medicine, StockMovementType type, int quantityChanged, User actor, String remarks) {
        StockLog log = StockLog.builder()
                .medicine(medicine)
                .movementType(type)
                .quantityChanged(quantityChanged)
                .quantityAfter(medicine.getQuantity())
                .performedBy(actor)
                .remarks(remarks)
                .build();
        return stockLogRepository.save(log);
    }

    public Page<StockLogResponse> history(Long medicineId, Pageable pageable) {
        Page<StockLog> logs;
        if (medicineId != null) {
            logs = stockLogRepository.findByMedicineIdOrderByCreatedAtDesc(medicineId, pageable);
        } else {
            logs = stockLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        return logs.map(StockLogResponse::from);
    }
}
