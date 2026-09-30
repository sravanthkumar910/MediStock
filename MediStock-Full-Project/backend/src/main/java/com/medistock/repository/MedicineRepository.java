package com.medistock.repository;

import com.medistock.entity.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE " +
           "(:name IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId IS NULL OR m.category.id = :categoryId) AND " +
           "(:supplierId IS NULL OR m.supplier.id = :supplierId) AND " +
           "(:batchNumber IS NULL OR LOWER(m.batchNumber) LIKE LOWER(CONCAT('%', :batchNumber, '%')))")
    Page<Medicine> search(@Param("name") String name,
                           @Param("categoryId") Long categoryId,
                           @Param("supplierId") Long supplierId,
                           @Param("batchNumber") String batchNumber,
                           Pageable pageable);

    boolean existsByNameIgnoreCaseAndBatchNumberIgnoreCase(String name, String batchNumber);

    boolean existsByNameIgnoreCaseAndBatchNumberIgnoreCaseAndIdNot(String name, String batchNumber, Long id);

    @Query("SELECT m FROM Medicine m WHERE m.quantity <= m.reorderLevel")
    List<Medicine> findLowStock();

    @Query("SELECT m FROM Medicine m WHERE m.quantity = 0")
    List<Medicine> findOutOfStock();

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate BETWEEN CURRENT_DATE AND :cutoff")
    List<Medicine> findExpiringBefore(@Param("cutoff") LocalDate cutoff);

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate < CURRENT_DATE")
    List<Medicine> findExpired();

    boolean existsByCategory_Id(Long categoryId);

    long countBySupplierId(Long supplierId);
}
