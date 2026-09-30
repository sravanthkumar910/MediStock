package com.medistock.service;

import com.medistock.dto.request.MedicineRequest;
import com.medistock.entity.Medicine;
import com.medistock.exception.DuplicateResourceException;
import com.medistock.repository.MedicineRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicineServiceTest {

    @Mock
    private MedicineRepository medicineRepository;

    @InjectMocks
    private MedicineService medicineService;

    @Test
    void create_WhenMedicineBatchAlreadyExists_ShouldRejectCreate() {
        MedicineRequest request = request("  Aspirin  ", " BATCH-1 ");
        when(medicineRepository.existsByNameIgnoreCaseAndBatchNumberIgnoreCase("Aspirin", "BATCH-1"))
                .thenReturn(true);

        DuplicateResourceException exception = assertThrows(
            DuplicateResourceException.class, () -> medicineService.create(request, null));
        assertEquals("Medicine 'Aspirin' with batch 'BATCH-1' already exists", exception.getMessage());

        verify(medicineRepository, never()).save(any(Medicine.class));
    }

    @Test
    void update_WhenAnotherMedicineHasSameBatch_ShouldRejectUpdate() {
        Medicine existing = new Medicine();
        existing.setId(7L);
        when(medicineRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(medicineRepository.existsByNameIgnoreCaseAndBatchNumberIgnoreCaseAndIdNot(
                "Aspirin", "BATCH-1", 7L)).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class,
                () -> medicineService.update(7L, request("Aspirin", "BATCH-1")));
        assertEquals("Medicine 'Aspirin' with batch 'BATCH-1' already exists", exception.getMessage());

        verify(medicineRepository, never()).save(any(Medicine.class));
    }

    private MedicineRequest request(String name, String batchNumber) {
        MedicineRequest request = new MedicineRequest();
        request.setName(name);
        request.setBatchNumber(batchNumber);
        return request;
    }
}