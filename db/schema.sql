-- Drop table if exists (for dev resets)
DROP TABLE IF EXISTS tasks;

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    completion INTEGER DEFAULT 0 CHECK (completion >= 0 AND completion <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (matches your JS samples)
INSERT INTO tasks (title, description, due_date, status, completion) VALUES
('Sample Task', 'Do something fun', '2025-11-15', 'Pending', 0),
('Another One', 'Halfway there', '2025-11-20', 'In Progress', 50);