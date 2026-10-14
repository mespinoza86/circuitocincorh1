CREATE TABLE deduction_control (
  id integer PRIMARY KEY CHECK(id=1),
  enabled boolean NOT NULL DEFAULT false,
  trial_start date NOT NULL DEFAULT '2026-10-01',
  official_start date NOT NULL DEFAULT '2026-11-01',
  revision integer NOT NULL DEFAULT 1
);
INSERT INTO deduction_control(id) VALUES(1);
CREATE TABLE deduction_rules (
  id uuid PRIMARY KEY,
  version bigserial UNIQUE,
  effective_from date NOT NULL,
  worker_bp integer NOT NULL CHECK(worker_bp BETWEEN 0 AND 10000),
  employer_bp integer NOT NULL CHECK(employer_bp BETWEEN 0 AND 10000),
  brackets jsonb NOT NULL,
  note text NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE payroll_periods ADD COLUMN deduction_mode text NOT NULL DEFAULT 'manual' CHECK(deduction_mode IN ('manual','automatic'));
ALTER TABLE payroll_items ADD COLUMN tax_refund_cents bigint NOT NULL DEFAULT 0 CHECK(tax_refund_cents>=0);
ALTER TABLE payroll_items ADD COLUMN employer_cents bigint NOT NULL DEFAULT 0 CHECK(employer_cents>=0);
ALTER TABLE payroll_items ADD COLUMN deduction_snapshot jsonb;
ALTER TABLE payroll_items ADD COLUMN exception_data jsonb;
CREATE TABLE tax_adjustments (
  id uuid PRIMARY KEY,
  employee_id uuid NOT NULL REFERENCES employees(id),
  year integer NOT NULL,
  month integer NOT NULL CHECK(month BETWEEN 1 AND 12),
  delta_cents bigint NOT NULL CHECK(delta_cents<>0),
  calculation jsonb NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','applied','cancelled')),
  revision integer NOT NULL DEFAULT 1,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  applied_at timestamptz,
  applied_by uuid REFERENCES users(id),
  reference text NOT NULL DEFAULT ''
);
CREATE UNIQUE INDEX tax_adjustments_pending ON tax_adjustments(employee_id,year,month) WHERE status='pending';
