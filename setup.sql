-- Script SQL para configurar la base de datos de Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. ELIMINAR la tabla si ya existe (para empezar de cero)
DROP TABLE IF EXISTS goals;

-- 2. Crear la tabla para almacenar las metas con TODAS las columnas necesarias
CREATE TABLE goals (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  color TEXT NOT NULL,
  "barColor" TEXT NOT NULL,  -- Nota: con comillas porque tiene mayúscula
  goals JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- 4. Crear política para permitir lectura a todos
CREATE POLICY "Permitir lectura a todos" ON goals
  FOR SELECT
  USING (true);

-- 5. Crear política para permitir escritura a todos
CREATE POLICY "Permitir escritura a todos" ON goals
  FOR INSERT
  WITH CHECK (true);

-- 6. Crear política para permitir actualización a todos
CREATE POLICY "Permitir actualización a todos" ON goals
  FOR UPDATE
  USING (true);

-- 7. Crear política para permitir eliminación a todos
CREATE POLICY "Permitir eliminación a todos" ON goals
  FOR DELETE
  USING (true);

-- 8. Habilitar Realtime para la tabla (sincronización en tiempo real)
ALTER PUBLICATION supabase_realtime ADD TABLE goals;

-- ✅ ¡Listo! La tabla está configurada correctamente

