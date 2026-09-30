package com.medistock.bootstrap;

import com.medistock.entity.RoleName;
import com.medistock.entity.Category;
import com.medistock.entity.Medicine;
import com.medistock.entity.Supplier;
import com.medistock.entity.User;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Seeds a default Admin account on first startup so the app is usable
 * immediately without a manual SQL insert.
 *
 * Default login (CHANGE THE PASSWORD after first login in production):
 *   email:    admin@medistock.com
 *   password: Admin@123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;

    @Value("${medistock.bootstrap.admin-email}")
    private String adminEmail;

    @Value("${medistock.bootstrap.admin-password}")
    private String adminPassword;

    @Value("${medistock.bootstrap.seed-demo-inventory:true}")
    private boolean seedDemoInventoryEnabled;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(RoleName.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }
        if (seedDemoInventoryEnabled) seedDemoInventory();
    }

    private void seedDemoInventory() {
        if (medicineRepository.count() > 0) return;

        Category analgesics = category("Analgesics", "Pain relief medication");
        Category antibiotics = category("Antibiotics", "Bacterial infection treatment");
        Category vitamins = category("Vitamins & Supplements", "Nutritional supplements");
        Supplier medSupply = supplier("MedSupply Co.", "+91-9876543210", "contact@medsupply.com");
        Supplier pharmaDirect = supplier("PharmaDirect Ltd.", "+91-9123456780", "sales@pharmadirect.com");
        LocalDate today = LocalDate.now();

        medicineRepository.saveAll(List.of(
                Medicine.builder().name("Paracetamol 500mg").batchNumber("BATCH-PARA-001")
                        .category(analgesics).supplier(medSupply).quantity(500).reorderLevel(50)
                        .manufacturingDate(today.minusMonths(8)).expiryDate(today.plusMonths(16))
                        .price(new BigDecimal("2.50")).unit("tablets").build(),
                Medicine.builder().name("Amoxicillin 250mg").batchNumber("BATCH-AMOX-014")
                        .category(antibiotics).supplier(pharmaDirect).quantity(15).reorderLevel(30)
                        .manufacturingDate(today.minusMonths(6)).expiryDate(today.plusDays(25))
                        .price(new BigDecimal("6.75")).unit("capsules").build(),
                Medicine.builder().name("Vitamin C 1000mg").batchNumber("BATCH-VITC-022")
                        .category(vitamins).supplier(pharmaDirect).quantity(200).reorderLevel(40)
                        .manufacturingDate(today.minusMonths(4)).expiryDate(today.plusMonths(10))
                        .price(new BigDecimal("8.25")).unit("tablets").build()
        ));
    }

    private Category category(String name, String description) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(Category.builder().name(name).description(description).build()));
    }

    private Supplier supplier(String name, String contact, String email) {
        return supplierRepository.findAll().stream().filter(existing -> existing.getName().equalsIgnoreCase(name)).findFirst()
                .orElseGet(() -> supplierRepository.save(Supplier.builder().name(name).contactNumber(contact).email(email).build()));
    }
}
