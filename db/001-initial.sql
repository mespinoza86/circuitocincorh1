CREATE TABLE IF NOT EXISTS company (
  id integer PRIMARY KEY CHECK (id = 1),
  name text NOT NULL DEFAULT 'Mi empresa',
  legal_id text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT ''
);
INSERT INTO company(id) VALUES(1) ON CONFLICT DO NOTHING;
CREATE TABLE employees (
  id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  full_name text NOT NULL,
  national_id text NOT NULL UNIQUE,
  email text NOT NULL,
  hire_date date NOT NULL,
  birth_date date NOT NULL,
  position text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  monthly_salary_cents bigint NOT NULL CHECK(monthly_salary_cents >= 0),
  active boolean NOT NULL DEFAULT true,
  termination_date date,
  historical_days numeric(12,1) NOT NULL DEFAULT 0 CHECK(historical_days >= 0 AND mod(historical_days * 2, 1) = 0),
  historical_cutoff date,
  historical_note text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK(birth_date < hire_date),
  CHECK(termination_date IS NULL OR termination_date >= hire_date),
  CHECK(historical_days = 0 OR historical_cutoff IS NOT NULL),
  CHECK(historical_cutoff IS NULL OR historical_cutoff >= hire_date)
);
CREATE TABLE users (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK(role IN ('admin','employee')),
  employee_id uuid UNIQUE REFERENCES employees(id),
  active boolean NOT NULL DEFAULT true,
  must_change_password boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(role <> 'employee' OR employee_id IS NOT NULL)
);
CREATE TABLE sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  csrf_token text NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX sessions_user_idx ON sessions(user_id);
CREATE TABLE holidays (
  id uuid PRIMARY KEY,
  day date NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE vacations (
  id uuid PRIMARY KEY,
  employee_id uuid NOT NULL REFERENCES employees(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  half_day boolean NOT NULL DEFAULT false,
  days numeric(12,1) NOT NULL CHECK(days > 0),
  entries jsonb NOT NULL,
  status text NOT NULL DEFAULT 'approved' CHECK(status IN ('approved','cancelled')),
  note text NOT NULL DEFAULT '',
  cancellation_reason text,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(end_date >= start_date)
);
CREATE INDEX vacations_employee_idx ON vacations(employee_id);
CREATE TABLE payroll_periods (
  id uuid PRIMARY KEY,
  year integer NOT NULL,
  month integer NOT NULL CHECK(month BETWEEN 1 AND 12),
  half integer NOT NULL CHECK(half IN (1,2)),
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','closed')),
  company_snapshot jsonb,
  closed_at timestamptz,
  closed_by uuid REFERENCES users(id),
  UNIQUE(year,month,half)
);
CREATE TABLE payroll_items (
  id uuid PRIMARY KEY,
  period_id uuid NOT NULL REFERENCES payroll_periods(id),
  employee_id uuid NOT NULL REFERENCES employees(id),
  employee_snapshot jsonb NOT NULL,
  monthly_salary_cents bigint NOT NULL,
  automatic_cents bigint NOT NULL,
  base_cents bigint NOT NULL,
  commissions_cents bigint NOT NULL DEFAULT 0,
  caja_cents bigint NOT NULL DEFAULT 0,
  renta_cents bigint NOT NULL DEFAULT 0,
  loan_cents bigint NOT NULL DEFAULT 0,
  other_cents bigint NOT NULL DEFAULT 0,
  gross_cents bigint NOT NULL,
  deductions_cents bigint NOT NULL,
  net_cents bigint NOT NULL CHECK(net_cents >= 0),
  adjustment_reason text NOT NULL DEFAULT '',
  other_reason text NOT NULL DEFAULT '',
  revision integer NOT NULL DEFAULT 1,
  reviewed boolean NOT NULL DEFAULT false,
  updated_by uuid NOT NULL REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(period_id,employee_id)
);
CREATE TABLE email_deliveries (
  id uuid PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES payroll_items(id),
  recipient text NOT NULL,
  status text NOT NULL CHECK(status IN ('sending','sent','failed')),
  detail text NOT NULL DEFAULT '',
  sent_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE audit_log (
  id bigserial PRIMARY KEY,
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text NOT NULL,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
