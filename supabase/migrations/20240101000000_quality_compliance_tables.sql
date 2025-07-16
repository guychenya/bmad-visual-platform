-- Quality Compliance Dashboard Tables

-- Create compliance_metrics table
CREATE TABLE compliance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    target_value DECIMAL(10,2),
    unit VARCHAR(20) NOT NULL,
    period VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create capas table (Corrective and Preventive Actions)
CREATE TABLE capas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    capa_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    assigned_to UUID REFERENCES profiles(user_id),
    created_by UUID NOT NULL REFERENCES profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_records table
CREATE TABLE training_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    training_name VARCHAR(255) NOT NULL,
    training_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'not_started',
    completion_date DATE,
    due_date DATE,
    score DECIMAL(5,2),
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audits table
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    audit_number VARCHAR(50) NOT NULL UNIQUE,
    area VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'planned',
    auditor VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    findings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_findings table
CREATE TABLE audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    finding_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirement TEXT,
    corrective_action TEXT,
    status VARCHAR(50) DEFAULT 'open',
    due_date DATE,
    assigned_to UUID REFERENCES profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_areas table
CREATE TABLE compliance_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    area_name VARCHAR(100) NOT NULL,
    description TEXT,
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    last_assessment DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_documents table
CREATE TABLE compliance_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES profiles(user_id),
    category VARCHAR(100),
    version VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_compliance_metrics_project_id ON compliance_metrics(project_id);
CREATE INDEX idx_compliance_metrics_type_date ON compliance_metrics(metric_type, date);
CREATE INDEX idx_capas_project_id ON capas(project_id);
CREATE INDEX idx_capas_status ON capas(status);
CREATE INDEX idx_training_records_project_id ON training_records(project_id);
CREATE INDEX idx_training_records_user_id ON training_records(user_id);
CREATE INDEX idx_audits_project_id ON audits(project_id);
CREATE INDEX idx_audit_findings_audit_id ON audit_findings(audit_id);
CREATE INDEX idx_compliance_areas_project_id ON compliance_areas(project_id);
CREATE INDEX idx_compliance_documents_project_id ON compliance_documents(project_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_compliance_metrics_updated_at BEFORE UPDATE ON compliance_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_capas_updated_at BEFORE UPDATE ON capas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_records_updated_at BEFORE UPDATE ON training_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audit_findings_updated_at BEFORE UPDATE ON audit_findings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_areas_updated_at BEFORE UPDATE ON compliance_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_documents_updated_at BEFORE UPDATE ON compliance_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO compliance_metrics (project_id, metric_type, value, target_value, unit, period, date) VALUES
    ((SELECT id FROM projects LIMIT 1), 'overall_compliance', 92.5, 95.0, 'percentage', 'monthly', '2023-11-01'),
    ((SELECT id FROM projects LIMIT 1), 'training_completion', 85.0, 95.0, 'percentage', 'monthly', '2023-11-01');

INSERT INTO capas (project_id, capa_number, title, type, status, priority, due_date, created_by) VALUES
    ((SELECT id FROM projects LIMIT 1), 'CAPA-2023-001', 'Documentation Update Required', 'corrective', 'open', 'high', '2023-12-15', (SELECT user_id FROM profiles LIMIT 1)),
    ((SELECT id FROM projects LIMIT 1), 'CAPA-2023-002', 'Training Program Enhancement', 'preventive', 'in_progress', 'medium', '2023-12-30', (SELECT user_id FROM profiles LIMIT 1));

INSERT INTO audits (project_id, audit_number, area, type, status, auditor, start_date, findings_count) VALUES
    ((SELECT id FROM projects LIMIT 1), 'AUD-2023-001', 'Documentation', 'internal', 'completed', 'John Smith', '2023-10-01', 3),
    ((SELECT id FROM projects LIMIT 1), 'AUD-2023-002', 'Safety Protocols', 'external', 'in_progress', 'Jane Doe', '2023-11-01', 2);

INSERT INTO compliance_areas (project_id, area_name, score, max_score, last_assessment) VALUES
    ((SELECT id FROM projects LIMIT 1), 'Documentation', 85.0, 100.0, '2023-10-25'),
    ((SELECT id FROM projects LIMIT 1), 'Safety', 78.0, 100.0, '2023-11-10'),
    ((SELECT id FROM projects LIMIT 1), 'Training', 92.0, 100.0, '2023-11-15'),
    ((SELECT id FROM projects LIMIT 1), 'Quality Control', 88.0, 100.0, '2023-11-05'),
    ((SELECT id FROM projects LIMIT 1), 'Environmental', 70.0, 100.0, '2023-10-30');

INSERT INTO compliance_documents (project_id, document_name, document_type, file_url, file_size, mime_type, uploaded_by, category) VALUES
    ((SELECT id FROM projects LIMIT 1), 'QMS Manual v3.1', 'manual', '/documents/qms-manual-v3.1.pdf', 1200000, 'application/pdf', (SELECT user_id FROM profiles LIMIT 1), 'quality'),
    ((SELECT id FROM projects LIMIT 1), 'Safety Audit Report - Q3 2023', 'report', '/documents/safety-audit-q3-2023.pdf', 850000, 'application/pdf', (SELECT user_id FROM profiles LIMIT 1), 'safety'),
    ((SELECT id FROM projects LIMIT 1), 'Training Completion Data - Nov', 'data', '/documents/training-completion-nov.xlsx', 320000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', (SELECT user_id FROM profiles LIMIT 1), 'training');