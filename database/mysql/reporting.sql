-- REQ-LT-0074: meaningful join + grouping stored procedure over actual custody.
-- Install after Alembic; execute with an authorized reporting account.
DROP PROCEDURE IF EXISTS labtrack_usage_by_lab;
DELIMITER $$
CREATE PROCEDURE labtrack_usage_by_lab()
SQL SECURITY INVOKER
READS SQL DATA
BEGIN
    SELECT labs.id AS lab_id, labs.name AS lab_name, items.name AS component,
           SUM(request_lines.quantity) AS issued_quantity,
           COUNT(DISTINCT requests.id) AS issued_requests,
           SUM(CASE WHEN requests.state IN ('ISSUED','IN_USE') THEN request_lines.quantity ELSE 0 END) AS active_quantity
    FROM requests
    INNER JOIN request_lines ON request_lines.request_id = requests.id
    INNER JOIN items ON items.id = request_lines.item_id
    INNER JOIN labs ON labs.id = request_lines.lab_id
    WHERE requests.issued_at IS NOT NULL
    GROUP BY labs.id, labs.name, items.id, items.name
    ORDER BY labs.id, items.id;
END$$
DELIMITER ;

-- Subquery: labs that have active issues, without conflating approved plans.
SELECT id, name FROM labs
WHERE id IN (SELECT rl.lab_id FROM request_lines rl JOIN requests r ON r.id = rl.request_id WHERE r.state IN ('ISSUED','IN_USE'));
