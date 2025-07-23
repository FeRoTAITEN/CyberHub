-- Surveys table: stores each survey definition
CREATE TABLE IF NOT EXISTS surveys (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  created_by INTEGER NOT NULL, -- user id
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Survey questions: linked to a survey, supports i18n and type
CREATE TABLE IF NOT EXISTS survey_questions (
  id SERIAL PRIMARY KEY,
  survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
  question_type VARCHAR(32) NOT NULL, -- e.g. 'text', 'rating', 'choice'
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0
);

-- Survey invites: unique token for each invite, expiry, and usage tracking
CREATE TABLE IF NOT EXISTS survey_invites (
  id SERIAL PRIMARY KEY,
  survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
  token UUID UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  invited_by INTEGER NOT NULL, -- user id
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- Survey responses: stores each response, links to invite and survey
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  invite_id INTEGER REFERENCES survey_invites(id) ON DELETE CASCADE,
  survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
  responder_name TEXT NOT NULL,
  responder_department TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Survey answers: each answer to a question in a response
CREATE TABLE IF NOT EXISTS survey_answers (
  id SERIAL PRIMARY KEY,
  response_id INTEGER REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer TEXT
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  job_title VARCHAR(100),
  department_id INT REFERENCES departments(id),
  avatar VARCHAR(255),
  location VARCHAR(100),
  hire_date DATE,
  status VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  manager_id INT REFERENCES employees(id)
);

-- Insert departments
INSERT INTO departments (id, name, description, manager_id) VALUES
(1, 'CYB-Cyber Technology', 'Cyber Technology Department', NULL),
(2, 'Cyber Excellence', 'Cyber Excellence Department', NULL),
(3, 'CYB-GRC', 'Governance, Risk, and Compliance', NULL),
(4, 'Architecture & Design', 'Architecture and Design Department', NULL),
(5, 'Protection & Defence', 'Protection and Defence Department', NULL),
(6, 'Cybersecurity', 'General Cybersecurity Department', NULL),
(7, 'CYB-IT', 'Cyber IT Department', NULL),
(8, 'Other', 'Other/Unassigned Department', NULL);

-- Update employees to use new department IDs
DELETE FROM employees;
INSERT INTO employees (name, email, phone, job_title, department_id, avatar, location, hire_date, status) VALUES
('Sarah Al-Qahtani', 'sarah.q@salam.sa', '+966501111111', 'Survey Admin', 1, 'avatar1.png', 'Riyadh', '2022-01-10', 'active'),
('Mohammed Al-Salem', 'mohammed.s@salam.sa', '+966501111112', 'Data Analyst', 2, 'avatar2.png', 'Jeddah', '2021-03-15', 'active'),
('Aisha Al-Fahad', 'aisha.f@salam.sa', '+966501111113', 'HR Specialist', 3, 'avatar3.png', 'Dammam', '2020-07-20', 'active'),
('Fahad Al-Mutairi', 'fahad.m@salam.sa', '+966501111114', 'IT Support', 7, 'avatar4.png', 'Riyadh', '2019-11-05', 'inactive'),
('Noura Al-Harbi', 'noura.h@salam.sa', '+966501111115', 'Project Manager', 4, 'avatar5.png', 'Jeddah', '2022-05-12', 'active'),
('Khalid Al-Otaibi', 'khalid.o@salam.sa', '+966501111116', 'Security Engineer', 5, 'avatar6.png', 'Riyadh', '2021-09-01', 'active'),
('Mona Al-Shehri', 'mona.s@salam.sa', '+966501111117', 'QA Tester', 6, 'avatar7.png', 'Dammam', '2020-12-18', 'active'),
('Abdullah Al-Dosari', 'abdullah.d@salam.sa', '+966501111118', 'Network Admin', 7, 'avatar8.png', 'Jeddah', '2018-04-23', 'inactive'),
('Reem Al-Suwailem', 'reem.s@salam.sa', '+966501111119', 'UI Designer', 4, 'avatar9.png', 'Riyadh', '2022-02-14', 'active'),
('Sultan Al-Qahtani', 'sultan.q@salam.sa', '+966501111120', 'Backend Developer', 1, 'avatar10.png', 'Dammam', '2021-06-30', 'active'),
('Huda Al-Shammari', 'huda.s@salam.sa', '+966501111121', 'Frontend Developer', 1, 'avatar11.png', 'Jeddah', '2020-10-10', 'active'),
('Majed Al-Rashid', 'majed.r@salam.sa', '+966501111122', 'DevOps Engineer', 5, 'avatar12.png', 'Riyadh', '2019-08-25', 'inactive'),
('Laila Al-Mutlaq', 'laila.m@salam.sa', '+966501111123', 'Business Analyst', 3, 'avatar13.png', 'Dammam', '2022-03-19', 'active'),
('Omar Al-Saadi', 'omar.s@salam.sa', '+966501111124', 'Product Owner', 2, 'avatar14.png', 'Jeddah', '2021-12-01', 'active'),
('Amani Al-Johani', 'amani.j@salam.sa', '+966501111125', 'Scrum Master', 4, 'avatar15.png', 'Riyadh', '2020-01-15', 'active'),
('Yousef Al-Ghamdi', 'yousef.g@salam.sa', '+966501111126', 'Mobile Developer', 8, 'avatar16.png', 'Dammam', '2019-05-27', 'inactive'),
('Rania Al-Tamimi', 'rania.t@salam.sa', '+966501111127', 'Content Writer', 8, 'avatar17.png', 'Jeddah', '2022-06-10', 'active'),
('Saad Al-Mansour', 'saad.m@salam.sa', '+966501111128', 'System Analyst', 6, 'avatar18.png', 'Riyadh', '2021-04-08', 'active'),
('Hessa Al-Qahtani', 'hessa.q@salam.sa', '+966501111129', 'Marketing Lead', 8, 'avatar19.png', 'Dammam', '2020-09-22', 'active'),
('Talal Al-Faraj', 'talal.f@salam.sa', '+966501111130', 'Support Engineer', 7, 'avatar20.png', 'Jeddah', '2018-11-11', 'inactive'); 