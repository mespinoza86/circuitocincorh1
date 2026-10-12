-- Conserva empleados y nóminas; añade únicamente salarios anteriores al sistema.
CREATE TABLE salary_history (
  id uuid PRIMARY KEY,
  employee_id uuid NOT NULL REFERENCES employees(id),
  year integer NOT NULL CHECK(year BETWEEN 2000 AND 2200),
  month integer NOT NULL CHECK(month BETWEEN 1 AND 12),
  gross_cents bigint NOT NULL CHECK(gross_cents >= 0),
  note text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  revision integer NOT NULL DEFAULT 1,
  updated_by uuid NOT NULL REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id,year,month)
);
