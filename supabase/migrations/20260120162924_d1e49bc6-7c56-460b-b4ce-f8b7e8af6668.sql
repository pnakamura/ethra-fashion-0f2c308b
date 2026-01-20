-- Add achievements column to profiles table for gamification
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS achievements jsonb 
DEFAULT '{
  "badges": [],
  "completed_missions": [],
  "current_streak": 0,
  "total_points": 0,
  "last_activity_date": null
}'::jsonb;