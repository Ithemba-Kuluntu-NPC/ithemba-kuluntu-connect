-- Additive and independent of the Stripe ledger. Live-first rollout authorized by the account owner.
CREATE TABLE IF NOT EXISTS paypal_attempts (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  cause TEXT NOT NULL,
  requested_amount INTEGER NOT NULL,
  requested_frequency TEXT NOT NULL,
  receipt_requested INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL CHECK(mode IN ('sandbox','production')),
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS paypal_payments (
  txn_id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES paypal_attempts(id),
  status TEXT NOT NULL,
  amount INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  purpose TEXT,
  parent_txn_id TEXT,
  subscription_id TEXT,
  received_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS paypal_payments_attempt ON paypal_payments(attempt_id);
CREATE INDEX IF NOT EXISTS paypal_payments_subscription ON paypal_payments(subscription_id);
