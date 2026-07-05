-- GrowthDiver D1 schema
-- Cloudflare 대시보드 D1 콘솔에서 이 파일 내용을 그대로 실행하면 됩니다.

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',           -- 'draft' 또는 'published'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
