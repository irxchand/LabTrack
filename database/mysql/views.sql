-- =====================================================================
-- LABTRACK AUTHORITATIVE REPORTING VIEWS (MySQL 8.0+)
-- Unit 3: Advanced Relational Views & Custody Analytics
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. View: v_active_loans_summary
-- Provides custody, borrower, and timeline visibility across all active hardware loans.
-- ---------------------------------------------------------------------
DROP VIEW IF EXISTS v_active_loans_summary;
CREATE VIEW v_active_loans_summary AS
SELECT 
    r.id AS request_id,
    p.name AS project_name,
    borrower.name AS borrower_name,
    borrower.identifier AS borrower_id,
    borrower.email AS borrower_email,
    i.id AS item_id,
    i.name AS component_name,
    i.kind AS component_kind,
    rl.quantity AS issued_quantity,
    l.name AS issuing_lab,
    l.lab_code AS lab_code,
    r.state AS loan_state,
    r.issued_at,
    r.due_at,
    TIMESTAMPDIFF(HOUR, NOW(), r.due_at) AS hours_remaining
FROM requests r
INNER JOIN projects p ON p.id = r.project_id
INNER JOIN users borrower ON borrower.id = p.lead_id
INNER JOIN request_lines rl ON rl.request_id = r.id
INNER JOIN items i ON i.id = rl.item_id
INNER JOIN labs l ON l.id = rl.lab_id
WHERE r.state IN ('ISSUED', 'IN_USE');

-- ---------------------------------------------------------------------
-- 2. View: v_lab_inventory_health
-- Computes lab-level hardware health, available good stock vs defective units,
-- and filters for operational lab capacity using GROUP BY and HAVING.
-- ---------------------------------------------------------------------
DROP VIEW IF EXISTS v_lab_inventory_health;
CREATE VIEW v_lab_inventory_health AS
SELECT 
    l.id AS lab_id,
    l.name AS lab_name,
    l.lab_code,
    incharge.name AS faculty_incharge,
    COUNT(s.item_id) AS distinct_components,
    SUM(s.good) AS total_good_stock,
    SUM(s.bad) AS total_defective_stock,
    ROUND(AVG(s.good), 2) AS avg_stock_per_component,
    CASE 
        WHEN SUM(s.good) + SUM(s.bad) > 0 
        THEN ROUND((SUM(s.good) / (SUM(s.good) + SUM(s.bad))) * 100, 2)
        ELSE 100.0 
    END AS operational_health_pct
FROM labs l
INNER JOIN users incharge ON incharge.id = l.incharge_id
LEFT JOIN stock s ON s.lab_id = l.id
GROUP BY l.id, l.name, l.lab_code, incharge.name
HAVING COUNT(s.item_id) > 0;
