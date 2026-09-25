-- Run this once only for an existing NoboGhat database before enabling Google login.
-- New databases are already covered by schema.sql and Hibernate's ddl-auto=update.
ALTER TABLE users MODIFY phone VARCHAR(20) NULL;
ALTER TABLE users ADD COLUMN email VARCHAR(320) NULL UNIQUE AFTER phone;
