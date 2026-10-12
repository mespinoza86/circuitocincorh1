-- Conserva el avance aunque después se edite el código de un empleado.
CREATE TABLE employee_code_counter (
  id integer PRIMARY KEY CHECK (id = 1),
  last_value numeric(28,0) NOT NULL CHECK (last_value >= 0)
);
INSERT INTO employee_code_counter(id,last_value)
SELECT 1,COALESCE(MAX(CASE WHEN code ~ '^CC[0-9]+$' THEN substring(code FROM 3)::numeric ELSE 0 END),0)
FROM (
  SELECT code FROM employees
  UNION ALL SELECT before_data->>'code' FROM audit_log WHERE entity='empleado'
  UNION ALL SELECT after_data->>'code' FROM audit_log WHERE entity='empleado'
) AS used_codes;
