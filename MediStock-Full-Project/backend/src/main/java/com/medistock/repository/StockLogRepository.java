package com.medistock.repository;

import com.medistock.entity.StockLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    Page<StockLog> findByMedicineIdOrderByCreatedAtDesc(Long medicineId, Pageable pageable);
    Page<StockLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
