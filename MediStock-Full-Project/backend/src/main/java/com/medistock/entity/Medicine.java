package com.medistock.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "medicines", uniqueConstraints = {
    @UniqueConstraint(name = "uk_medicine_name_batch", columnNames = {"name", "batch_number"})
}, indexes = {
        @Index(name = "idx_medicine_name", columnList = "name"),
        @Index(name = "idx_medicine_batch", columnList = "batchNumber"),
        @Index(name = "idx_medicine_expiry", columnList = "expiryDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine extends BaseEntity {

    @NotBlank
    @Column(nullable = false, length = 200)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String batchNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Min(0)
    @Column(nullable = false)
    private Integer quantity;

    /** Threshold below which this medicine is considered "low stock". */
    @Builder.Default
    @Column(nullable = false)
    private Integer reorderLevel = 20;

    private LocalDate manufacturingDate;

    @NotNull
    @Column(nullable = false)
    private LocalDate expiryDate;

    @DecimalMin("0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 20)
    private String unit; // e.g. tablets, ml, boxes

    @Column(length = 1000)
    private String description;
}
