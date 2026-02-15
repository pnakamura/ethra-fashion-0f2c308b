-- Track when a subscription started for 7-day right of withdrawal (CDC Art. 49)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ;

-- Back-fill: for existing paid subscribers, assume subscription_started_at = updated_at
UPDATE public.profiles
   SET subscription_started_at = updated_at
 WHERE subscription_plan_id IS NOT NULL
   AND subscription_plan_id != 'free'
   AND subscription_started_at IS NULL;
