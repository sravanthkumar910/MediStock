package com.medistock.service;

import com.medistock.dto.request.MedicineRequest;
import com.medistock.dto.response.MedicineResponse;
import com.medistock.entity.*;
import com.medistock.exception.DuplicateResourceException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final StockLogService stockLogService;

    @Value("${medistock.alerts.expiry-warning-days}")
    private int expiryWarningDays;

    public Page<MedicineResponse> search(String name, Long categoryId, Long supplierId, String batchNumber, Pageable pageable) {
        return medicineRepository.search(name, categoryId, supplierId, batchNumber, pageable)
                .map(this::toResponse);
    }

    public MedicineResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public MedicineResponse create(MedicineRequest request, User actor) {
        ensureUniqueBatch(request, null);
        Medicine medicine = new Medicine();
        applyRequest(medicine, request);
        medicine = medicineRepository.save(medicine);

        if (medicine.getQuantity() > 0) {
            stockLogService.record(medicine, StockMovementType.STOCK_IN, medicine.getQuantity(), actor,
                    "Initial stock on medicine creation");
        }
        return toResponse(medicine);
    }

    public MedicineResponse update(Long id, MedicineRequest request) {
        Medicine medicine = findEntity(id);
        ensureUniqueBatch(request, id);
        applyRequest(medicine, request);
        return toResponse(medicineRepository.save(medicine));
    }

    public void delete(Long id) {
        medicineRepository.delete(findEntity(id));
    }

    public MedicineResponse adjustStock(Long id, StockMovementType type, int quantity, String remarks, User actor) {
        Medicine medicine = findEntity(id);
        int newQty;
        int delta;
        switch (type) {
            case STOCK_IN -> {
                newQty = medicine.getQuantity() + quantity;
                delta = quantity;
            }
            case STOCK_OUT, EXPIRED_REMOVAL -> {
                if (quantity > medicine.getQuantity()) {
                    throw new IllegalArgumentException("Cannot remove more stock than currently available");
                }
                newQty = medicine.getQuantity() - quantity;
                delta = -quantity;
            }
            case ADJUSTMENT -> {
                newQty = quantity; // treat as absolute new value for manual adjustments
                delta = quantity - medicine.getQuantity();
            }
            default -> throw new IllegalArgumentException("Unsupported movement type");
        }
        medicine.setQuantity(newQty);
        medicineRepository.save(medicine);
        stockLogService.record(medicine, type, delta, actor, remarks);
        return toResponse(medicine);
    }

    public java.util.List<MedicineResponse> lowStock() {
        return medicineRepository.findLowStock().stream().map(this::toResponse).toList();
    }

    public java.util.List<MedicineResponse> outOfStock() {
        return medicineRepository.findOutOfStock().stream().map(this::toResponse).toList();
    }

    public java.util.List<MedicineResponse> nearExpiry() {
        return medicineRepository.findExpiringBefore(java.time.LocalDate.now().plusDays(expiryWarningDays))
                .stream().map(this::toResponse).toList();
    }

    public java.util.List<MedicineResponse> expired() {
        return medicineRepository.findExpired().stream().map(this::toResponse).toList();
    }

    private void applyRequest(Medicine medicine, MedicineRequest request) {
        medicine.setName(request.getName().trim());
        medicine.setBatchNumber(request.getBatchNumber().trim());
        medicine.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        medicine.setReorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : 20);
        medicine.setManufacturingDate(request.getManufacturingDate());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setPrice(request.getPrice());
        medicine.setUnit(request.getUnit());
        medicine.setDescription(request.getDescription());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));
            medicine.setCategory(category);
        } else {
            medicine.setCategory(null);
        }

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + request.getSupplierId()));
            medicine.setSupplier(supplier);
        } else {
            medicine.setSupplier(null);
        }
    }

    private void ensureUniqueBatch(MedicineRequest request, Long excludedId) {
        String name = request.getName().trim();
        String batchNumber = request.getBatchNumber().trim();
        boolean exists = excludedId == null
                ? medicineRepository.existsByNameIgnoreCaseAndBatchNumberIgnoreCase(name, batchNumber)
                : medicineRepository.existsByNameIgnoreCaseAndBatchNumberIgnoreCaseAndIdNot(name, batchNumber, excludedId);

        if (exists) {
            throw new DuplicateResourceException(
                    "Medicine '" + name + "' with batch '" + batchNumber + "' already exists");
        }
    }

    private Medicine findEntity(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
    }

    private MedicineResponse toResponse(Medicine medicine) {
        return MedicineResponse.from(medicine, expiryWarningDays);
    }
}
