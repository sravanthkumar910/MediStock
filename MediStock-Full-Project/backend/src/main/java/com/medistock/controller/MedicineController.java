package com.medistock.controller;

import com.medistock.dto.request.MedicineRequest;
import com.medistock.dto.request.StockAdjustmentRequest;
import com.medistock.dto.response.MedicineResponse;
import com.medistock.entity.User;
import com.medistock.entity.RoleName;
import com.medistock.entity.StockMovementType;
import com.medistock.service.MedicineService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Core medicine inventory endpoints.
 *   GET    /api/medicines                         - search/filter/paginate medicines
 *   GET    /api/medicines/{id}                     - get one medicine
 *   POST   /api/medicines                          - add a medicine (Admin/Pharmacist)
 *   PUT    /api/medicines/{id}                      - update a medicine (Admin/Pharmacist)
 *   DELETE /api/medicines/{id}                      - delete a medicine (Admin)
 *   POST   /api/medicines/{id}/stock                - stock in/out/adjustment (Admin/Pharmacist/Staff for STOCK_OUT)
 *   GET    /api/medicines/alerts/low-stock           - medicines at/under reorder level
 *   GET    /api/medicines/alerts/out-of-stock        - medicines with zero quantity
 *   GET    /api/medicines/alerts/near-expiry          - medicines expiring soon
 *   GET    /api/medicines/alerts/expired              - already-expired medicines
 */
@RestController
@RequestMapping("/medicines")
@RequiredArgsConstructor
@Tag(name = "Medicine Inventory")
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    public Page<MedicineResponse> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) String batchNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return medicineService.search(name, categoryId, supplierId, batchNumber, pageable);
    }

    @GetMapping("/{id}")
    public MedicineResponse getById(@PathVariable Long id) {
        return medicineService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<MedicineResponse> create(@Valid @RequestBody MedicineRequest request) {
        User actor = CurrentUserResolver.currentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(medicineService.create(request, actor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public MedicineResponse update(@PathVariable Long id, @Valid @RequestBody MedicineRequest request) {
        return medicineService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        medicineService.delete(id);
    }

    @PostMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public MedicineResponse adjustStock(@PathVariable Long id, @Valid @RequestBody StockAdjustmentRequest request) {
        User actor = CurrentUserResolver.currentUser();
        if (actor.getRole() == RoleName.STAFF && request.getMovementType() != StockMovementType.STOCK_OUT) {
            throw new org.springframework.security.access.AccessDeniedException("Staff may only remove stock");
        }
        return medicineService.adjustStock(id, request.getMovementType(), request.getQuantity(), request.getRemarks(), actor);
    }

    @GetMapping("/alerts/low-stock")
    public List<MedicineResponse> lowStock() {
        return medicineService.lowStock();
    }

    @GetMapping("/alerts/out-of-stock")
    public List<MedicineResponse> outOfStock() {
        return medicineService.outOfStock();
    }

    @GetMapping("/alerts/near-expiry")
    public List<MedicineResponse> nearExpiry() {
        return medicineService.nearExpiry();
    }

    @GetMapping("/alerts/expired")
    public List<MedicineResponse> expired() {
        return medicineService.expired();
    }
}
