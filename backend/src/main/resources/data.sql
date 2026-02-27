-- Seed Data for Pharmaceutical Equipment Management System

-- Insert Equipment Types (Pharmaceutical-specific, Dynamic)
INSERT INTO equipment_types (name) VALUES
    ('Manufacturing Equipment'),
    ('Laboratory Equipment'),
    ('Quality Control Equipment'),
    ('Storage Equipment'),
    ('Sterilization Equipment'),
    ('Packaging Equipment');

-- Insert Sample Pharmaceutical Equipment
INSERT INTO equipment (name, type_id, status, last_cleaned_date) VALUES
    -- Manufacturing Equipment
    ('Tablet Press Machine', 1, 'Active', CURRENT_DATE - INTERVAL '5 days'),
    ('Granulation Equipment', 1, 'Under Maintenance', CURRENT_DATE - INTERVAL '10 days'),
    ('Fluid Bed Dryer', 1, 'Active', CURRENT_DATE - INTERVAL '3 days'),

    -- Laboratory Equipment
    ('HPLC System', 2, 'Active', CURRENT_DATE - INTERVAL '2 days'),
    ('pH Meter', 2, 'Active', CURRENT_DATE - INTERVAL '7 days'),
    ('Spectrophotometer', 2, 'Inactive', CURRENT_DATE - INTERVAL '35 days'),

    -- Quality Control Equipment
    ('Dissolution Tester', 3, 'Active', CURRENT_DATE - INTERVAL '4 days'),
    ('Friability Tester', 3, 'Under Maintenance', CURRENT_DATE - INTERVAL '15 days'),

    -- Storage Equipment
    ('Cold Storage Unit', 4, 'Active', CURRENT_DATE - INTERVAL '1 day'),
    ('Pharmaceutical Refrigerator', 4, 'Active', CURRENT_DATE - INTERVAL '6 days'),

    -- Sterilization Equipment
    ('Autoclave', 5, 'Active', CURRENT_DATE - INTERVAL '2 days'),
    ('UV Sterilizer', 5, 'Under Maintenance', CURRENT_DATE - INTERVAL '20 days'),

    -- Packaging Equipment
    ('Blister Packaging Machine', 6, 'Active', CURRENT_DATE - INTERVAL '8 days'),
    ('Capsule Filling Machine', 6, 'Inactive', CURRENT_DATE - INTERVAL '40 days');
