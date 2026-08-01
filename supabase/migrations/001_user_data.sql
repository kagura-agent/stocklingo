CREATE TABLE user_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, data_type)
);

ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own ON user_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_own ON user_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_own ON user_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY delete_own ON user_data FOR DELETE USING (auth.uid() = user_id);
