-- Add new columns to try_on_results for model tracking and user feedback
ALTER TABLE try_on_results 
ADD COLUMN IF NOT EXISTS model_used TEXT DEFAULT 'auto',
ADD COLUMN IF NOT EXISTS user_feedback TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS feedback_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN try_on_results.model_used IS 'AI model used for generation: gemini-2.5-flash, gemini-2.5-pro, gemini-3-pro-image-preview';
COMMENT ON COLUMN try_on_results.user_feedback IS 'User feedback: like or dislike';
COMMENT ON COLUMN try_on_results.feedback_at IS 'Timestamp when feedback was submitted';
COMMENT ON COLUMN try_on_results.retry_count IS 'Number of retries for this garment (0-2)';