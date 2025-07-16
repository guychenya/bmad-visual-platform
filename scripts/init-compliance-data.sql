-- Initialize Compliance Dashboard with Sample Data
-- Run this script in your Supabase SQL Editor after applying migrations

-- Create a sample project if none exists
INSERT INTO projects (id, name, description, owner_id, status, created_at, updated_at)
VALUES (
    'compliance-demo-project',
    'Quality Compliance Demo Project',
    'Demo project for quality compliance dashboard',
    (SELECT id FROM auth.users LIMIT 1),
    'active',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create a sample user profile if none exists
INSERT INTO profiles (id, user_id, username, full_name, bio, created_at, updated_at)
VALUES (
    'demo-profile-id',
    (SELECT id FROM auth.users LIMIT 1),
    'demo-user',
    'Demo User',
    'Demo user for compliance dashboard',
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Insert sample compliance metrics
INSERT INTO compliance_metrics (project_id, metric_type, value, target_value, unit, period, date) VALUES
    ('compliance-demo-project', 'overall_compliance', 92.5, 95.0, 'percentage', 'monthly', '2023-11-01'),
    ('compliance-demo-project', 'training_completion', 85.0, 95.0, 'percentage', 'monthly', '2023-11-01'),
    ('compliance-demo-project', 'audit_score', 88.0, 90.0, 'percentage', 'quarterly', '2023-11-01'),
    ('compliance-demo-project', 'document_compliance', 78.0, 85.0, 'percentage', 'monthly', '2023-11-01'),
    ('compliance-demo-project', 'overall_compliance', 91.2, 95.0, 'percentage', 'monthly', '2023-10-01'),
    ('compliance-demo-project', 'training_completion', 82.0, 95.0, 'percentage', 'monthly', '2023-10-01'),
    ('compliance-demo-project', 'overall_compliance', 89.8, 95.0, 'percentage', 'monthly', '2023-09-01'),
    ('compliance-demo-project', 'training_completion', 79.0, 95.0, 'percentage', 'monthly', '2023-09-01');

-- Insert sample CAPAs
INSERT INTO capas (project_id, capa_number, title, description, type, status, priority, due_date, created_by) VALUES
    ('compliance-demo-project', 'CAPA-2023-001', 'Documentation Update Required', 'Update quality manual to reflect new procedures', 'corrective', 'open', 'high', '2023-12-15', (SELECT user_id FROM profiles LIMIT 1)),
    ('compliance-demo-project', 'CAPA-2023-002', 'Training Program Enhancement', 'Enhance training program to include new compliance requirements', 'preventive', 'in_progress', 'medium', '2023-12-30', (SELECT user_id FROM profiles LIMIT 1)),
    ('compliance-demo-project', 'CAPA-2023-003', 'Audit Finding Resolution', 'Address findings from recent external audit', 'corrective', 'open', 'high', '2023-12-01', (SELECT user_id FROM profiles LIMIT 1)),
    ('compliance-demo-project', 'CAPA-2023-004', 'Process Improvement Initiative', 'Implement lean processes to reduce waste', 'preventive', 'closed', 'low', '2023-11-15', (SELECT user_id FROM profiles LIMIT 1)),
    ('compliance-demo-project', 'CAPA-2023-005', 'Safety Protocol Update', 'Update safety protocols based on industry best practices', 'preventive', 'open', 'medium', '2023-11-30', (SELECT user_id FROM profiles LIMIT 1));

-- Insert sample training records
INSERT INTO training_records (project_id, user_id, training_name, training_type, status, completion_date, due_date, score) VALUES
    ('compliance-demo-project', (SELECT user_id FROM profiles LIMIT 1), 'GMP Basic Training', 'mandatory', 'completed', '2023-11-01', '2023-11-15', 95.0),
    ('compliance-demo-project', (SELECT user_id FROM profiles LIMIT 1), 'Safety Procedures', 'mandatory', 'completed', '2023-10-15', '2023-11-01', 88.0),
    ('compliance-demo-project', (SELECT user_id FROM profiles LIMIT 1), 'Quality Management System', 'mandatory', 'in_progress', NULL, '2023-12-01', NULL),
    ('compliance-demo-project', (SELECT user_id FROM profiles LIMIT 1), 'Document Control', 'elective', 'completed', '2023-11-05', '2023-11-30', 92.0),
    ('compliance-demo-project', (SELECT user_id FROM profiles LIMIT 1), 'Risk Management', 'mandatory', 'not_started', NULL, '2023-12-15', NULL),
    ('compliance-demo-project', (SELECT user_id FROM profiles LIMIT 1), 'Regulatory Compliance', 'mandatory', 'completed', '2023-10-20', '2023-11-10', 90.0);

-- Insert sample audits
INSERT INTO audits (project_id, audit_number, area, type, status, auditor, start_date, end_date, findings_count) VALUES
    ('compliance-demo-project', 'AUD-2023-001', 'Documentation', 'internal', 'completed', 'John Smith', '2023-10-01', '2023-10-25', 3),
    ('compliance-demo-project', 'AUD-2023-002', 'Safety Protocols', 'external', 'in_progress', 'Jane Doe', '2023-11-01', NULL, 2),
    ('compliance-demo-project', 'AUD-2023-003', 'Training Compliance', 'internal', 'pending', 'Mike Johnson', '2023-12-01', NULL, 0),
    ('compliance-demo-project', 'AUD-2023-004', 'Equipment Calibration', 'external', 'completed', 'Sarah Wilson', '2023-09-15', '2023-09-30', 1),
    ('compliance-demo-project', 'AUD-2023-005', 'Quality Control', 'internal', 'planned', 'Tom Brown', '2023-12-15', NULL, 0);

-- Insert sample audit findings
INSERT INTO audit_findings (audit_id, finding_type, severity, title, description, requirement, status, due_date) VALUES
    ((SELECT id FROM audits WHERE audit_number = 'AUD-2023-001'), 'non_conformance', 'minor', 'Outdated Procedure Document', 'Procedure document version 2.1 is outdated, current version is 2.3', 'ISO 9001:2015 4.2.3', 'open', '2023-12-01'),
    ((SELECT id FROM audits WHERE audit_number = 'AUD-2023-001'), 'observation', 'minor', 'Record Keeping Inconsistency', 'Training records show inconsistent date formats', 'ISO 9001:2015 7.5.3', 'closed', '2023-11-15'),
    ((SELECT id FROM audits WHERE audit_number = 'AUD-2023-001'), 'non_conformance', 'major', 'Missing Calibration Certificate', 'Equipment XYZ-001 missing calibration certificate', 'ISO 9001:2015 7.1.5', 'open', '2023-11-30'),
    ((SELECT id FROM audits WHERE audit_number = 'AUD-2023-002'), 'non_conformance', 'major', 'Safety Training Gap', 'New employees not receiving safety training within required timeframe', 'OSHA 1926.95', 'open', '2023-12-15'),
    ((SELECT id FROM audits WHERE audit_number = 'AUD-2023-002'), 'observation', 'minor', 'PPE Storage Issue', 'Personal protective equipment not stored in designated areas', 'OSHA 1926.95', 'open', '2023-11-30'),
    ((SELECT id FROM audits WHERE audit_number = 'AUD-2023-004'), 'opportunity', 'low', 'Preventive Maintenance Optimization', 'Opportunity to optimize preventive maintenance schedule', 'ISO 9001:2015 8.5.1', 'closed', '2023-10-31');

-- Insert sample compliance areas
INSERT INTO compliance_areas (project_id, area_name, description, score, max_score, last_assessment) VALUES
    ('compliance-demo-project', 'Documentation', 'Document control and management compliance', 85.0, 100.0, '2023-10-25'),
    ('compliance-demo-project', 'Safety', 'Workplace safety and OSHA compliance', 78.0, 100.0, '2023-11-10'),
    ('compliance-demo-project', 'Training', 'Employee training and competency management', 92.0, 100.0, '2023-11-15'),
    ('compliance-demo-project', 'Quality Control', 'Quality management system compliance', 88.0, 100.0, '2023-11-05'),
    ('compliance-demo-project', 'Environmental', 'Environmental management and sustainability', 70.0, 100.0, '2023-10-30'),
    ('compliance-demo-project', 'Risk Management', 'Risk assessment and mitigation processes', 82.0, 100.0, '2023-11-01'),
    ('compliance-demo-project', 'Regulatory', 'Regulatory compliance and reporting', 86.0, 100.0, '2023-11-08');

-- Insert sample compliance documents
INSERT INTO compliance_documents (project_id, document_name, document_type, file_url, file_size, mime_type, uploaded_by, category, version, status) VALUES
    ('compliance-demo-project', 'QMS Manual v3.1', 'pdf', '/documents/qms-manual-v3.1.pdf', 1200000, 'application/pdf', (SELECT user_id FROM profiles LIMIT 1), 'quality', 'v3.1', 'active'),
    ('compliance-demo-project', 'Safety Audit Report - Q3 2023', 'pdf', '/documents/safety-audit-q3-2023.pdf', 850000, 'application/pdf', (SELECT user_id FROM profiles LIMIT 1), 'safety', 'v1.0', 'active'),
    ('compliance-demo-project', 'Training Completion Data - Nov', 'xlsx', '/documents/training-completion-nov.xlsx', 320000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', (SELECT user_id FROM profiles LIMIT 1), 'training', 'v1.0', 'active'),
    ('compliance-demo-project', 'ISO 9001 Certificate', 'pdf', '/documents/iso-9001-certificate.pdf', 450000, 'application/pdf', (SELECT user_id FROM profiles LIMIT 1), 'certification', 'v1.0', 'active'),
    ('compliance-demo-project', 'Environmental Impact Assessment', 'pdf', '/documents/environmental-impact-assessment.pdf', 980000, 'application/pdf', (SELECT user_id FROM profiles LIMIT 1), 'environmental', 'v2.0', 'active'),
    ('compliance-demo-project', 'Risk Assessment Matrix', 'xlsx', '/documents/risk-assessment-matrix.xlsx', 165000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', (SELECT user_id FROM profiles LIMIT 1), 'risk', 'v1.3', 'active'),
    ('compliance-demo-project', 'Procedure Update Log', 'docx', '/documents/procedure-update-log.docx', 78000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', (SELECT user_id FROM profiles LIMIT 1), 'procedures', 'v1.0', 'active');

-- Update findings count for audits
UPDATE audits SET findings_count = (
    SELECT COUNT(*) FROM audit_findings WHERE audit_id = audits.id
) WHERE project_id = 'compliance-demo-project';

-- Success message
SELECT 'Compliance Dashboard sample data initialized successfully!' as message;