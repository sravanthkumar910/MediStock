package com.medistock.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier extends BaseEntity {

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 20)
    private String contactNumber;

    @Column(length = 150)
    private String email;

    @Column(length = 300)
    private String address;

    @Column(length = 500)
    private String notes;

    /** Back-reference only, never serialized (avoids Supplier -> Medicine -> Supplier JSON recursion). */
    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Medicine> medicines = new ArrayList<>();
}
