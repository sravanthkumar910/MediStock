package com.medistock.service;

import com.medistock.entity.Category;
import com.medistock.exception.BadRequestException;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MedicineRepository medicineRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void deleteCategory_WhenCategoryIsUsedByMedicine_ShouldRejectDelete() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Antibiotics");
        category.setDescription("Bacterial infection treatment");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(medicineRepository.existsByCategory_Id(1L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> categoryService.delete(1L));

        verify(categoryRepository, never()).delete(any(Category.class));
    }
}
