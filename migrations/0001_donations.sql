-- Dedicated donation ledger. Keep separate from newsletter/contact storage.
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  session_id TEXT UNIQUE,
  customer_id TEXT,
  frequency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  updated_at INTEGER NOT NULL,
  webhook_at INTEGER
);
CREATE INDEX IF NOT EXISTS donations_customer ON donations(customer_id);
CREATE TABLE IF NOT EXISTS donation_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  donation_id TEXT,
  received_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS donation_rate_limits (
  id TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
