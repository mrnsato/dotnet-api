-- Inserção de Technologies
INSERT INTO technologies (name) VALUES
    ('.NET'),
    ('Java'),
    ('Python'),
    ('Node.js'),
    ('PHP'),
    ('Go'),
    ('Ruby'),
    ('Rust');

-- Inserção de Versions
-- .NET versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('8.0', 1, true, '.NET 8.0 LTS', '2026-11-10', '2026-11-10'),
    ('9.0', 1, false, '.NET 9.0', '2025-05-13', '2025-05-13'),
    ('7.0', 1, false, '.NET 7.0', '2024-05-14', '2024-05-14');

-- Java versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('21', 2, true, 'Java 21 LTS', '2031-09-01', '2031-09-01'),
    ('17', 2, true, 'Java 17 LTS', '2029-09-01', '2029-09-01'),
    ('11', 2, true, 'Java 11 LTS', '2026-09-01', '2026-09-01');

-- Python versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('3.12', 3, true, 'Python 3.12', '2028-10-02', '2028-10-02'),
    ('3.11', 3, false, 'Python 3.11', '2027-10-24', '2027-10-24'),
    ('3.10', 3, false, 'Python 3.10', '2026-10-04', '2026-10-04');

-- Node.js versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('22', 4, true, 'Node.js 22 LTS', '2027-10-18', '2027-10-18'),
    ('20', 4, true, 'Node.js 20 LTS', '2026-04-30', '2026-04-30'),
    ('18', 4, true, 'Node.js 18 LTS', '2025-04-30', '2025-04-30');

-- PHP versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('8.3', 5, true, 'PHP 8.3', '2026-11-23', '2026-11-23'),
    ('8.2', 5, false, 'PHP 8.2', '2025-12-08', '2025-12-08'),
    ('8.1', 5, false, 'PHP 8.1', '2025-11-25', '2025-11-25');

-- Go versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('1.23', 6, true, 'Go 1.23', '2025-08-06', '2025-08-06'),
    ('1.22', 6, false, 'Go 1.22', '2025-06-06', '2025-06-06'),
    ('1.21', 6, false, 'Go 1.21', '2024-08-06', '2024-08-06');

-- Ruby versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('3.3', 7, true, 'Ruby 3.3', '2027-03-31', '2027-03-31'),
    ('3.2', 7, false, 'Ruby 3.2', '2026-12-25', '2026-12-25'),
    ('3.1', 7, false, 'Ruby 3.1', '2025-12-25', '2025-12-25');

-- Rust versions
INSERT INTO versions (name, technologies_id, standard, full_name, eos, eol) VALUES
    ('1.75', 8, true, 'Rust 1.75', '2026-02-10', '2026-02-10'),
    ('1.74', 8, false, 'Rust 1.74', '2025-12-19', '2025-12-19'),
    ('1.73', 8, false, 'Rust 1.73', '2025-11-07', '2025-11-07');

-- Inserção de Applications (8 aplicações)
INSERT INTO applications (name, active) VALUES
    ('Visual Studio Code', true),
    ('GitHub Copilot Backend', true),
    ('Microsoft Azure Platform', true),
    ('Docker Engine', true),
    ('Kubernetes Control Plane', true),
    ('PostgreSQL Database', true),
    ('Nginx Web Server', true),
    ('GraphQL API Gateway', true);

-- Inserção de Applications_Versions (relacionamento entre aplicações e versões)
-- Visual Studio Code (.NET) - versão 8.0
INSERT INTO applications_versions (application_id, version_id) VALUES (1, 1);

-- GitHub Copilot Backend (Java) - versão 21
INSERT INTO applications_versions (application_id, version_id) VALUES (2, 4);

-- Microsoft Azure Platform (.NET) - versão 8.0 e 9.0
INSERT INTO applications_versions (application_id, version_id) VALUES (3, 1);
INSERT INTO applications_versions (application_id, version_id) VALUES (3, 2);

-- Docker Engine (Go) - versão 1.23
INSERT INTO applications_versions (application_id, version_id) VALUES (4, 19);

-- Kubernetes Control Plane (Go) - versão 1.23 e 1.22
INSERT INTO applications_versions (application_id, version_id) VALUES (5, 19);
INSERT INTO applications_versions (application_id, version_id) VALUES (5, 20);

-- PostgreSQL Database (C/Go) - versão 1.22
INSERT INTO applications_versions (application_id, version_id) VALUES (6, 20);

-- Nginx Web Server (C) - usando Node.js versão 22 (alternativa)
INSERT INTO applications_versions (application_id, version_id) VALUES (7, 10);

-- GraphQL API Gateway (Node.js) - versão 20 e 22
INSERT INTO applications_versions (application_id, version_id) VALUES (8, 11);
INSERT INTO applications_versions (application_id, version_id) VALUES (8, 10);
