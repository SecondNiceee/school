-- Удаляет все материалы, привязанные к пользователям
DELETE FROM materials_rels WHERE parent_id IN (SELECT id FROM users);

-- Удаляет все пользователей
DELETE FROM users;
