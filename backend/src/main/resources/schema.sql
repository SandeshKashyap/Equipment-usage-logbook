-- Equipment Management System Database Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS equipment_types CASCADE;

-- Equipment Types Table (Dynamic, not hardcoded)
CREATE TABLE equipment_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment Table
CREATE TABLE equipment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    last_cleaned_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_equipment_type FOREIGN KEY (type_id) REFERENCES equipment_types(id) ON DELETE RESTRICT
);

-- Maintenance Logs Table
CREATE TABLE maintenance_logs (
    id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL,
    maintenance_date DATE NOT NULL,
    notes TEXT,
    performed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_maintenance_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_type ON equipment(type_id);
CREATE INDEX idx_maintenance_equipment ON maintenance_logs(equipment_id);
CREATE INDEX idx_maintenance_date ON maintenance_logs(maintenance_date DESC);
