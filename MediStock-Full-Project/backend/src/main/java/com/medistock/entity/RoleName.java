package com.medistock.entity;

/**
 * System roles as defined in the MediStock spec:
 * ADMIN        - full access, user & system management, analytics
 * PHARMACIST   - manages inventory, suppliers, purchase orders
 * STAFF        - view stock, search medicines, limited operations
 */
public enum RoleName {
    ADMIN,
    PHARMACIST,
    STAFF
}
