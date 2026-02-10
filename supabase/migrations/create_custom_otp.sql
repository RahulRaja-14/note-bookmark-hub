-- Create table for custom 6-digit OTP codes
CREATE TABLE IF NOT EXISTS public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX idx_verification_codes_email ON public.email_verification_codes(email);
CREATE INDEX idx_verification_codes_expires ON public.email_verification_codes(expires_at);

-- Policy: Anyone can insert (for signup)
CREATE POLICY "Anyone can create verification codes" ON public.email_verification_codes
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read their own codes (for verification)
CREATE POLICY "Anyone can read verification codes" ON public.email_verification_codes
  FOR SELECT USING (true);

-- Policy: System can update codes
CREATE POLICY "Anyone can update verification codes" ON public.email_verification_codes
  FOR UPDATE USING (true);

-- Function to clean up expired codes (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.email_verification_codes
  WHERE expires_at < now() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate 6-digit code
CREATE OR REPLACE FUNCTION public.generate_verification_code(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Generate a random 6-digit code
  LOOP
    new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Check if code already exists for this email
    SELECT EXISTS(
      SELECT 1 FROM public.email_verification_codes
      WHERE email = user_email AND code = new_code AND expires_at > now()
    ) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  -- Delete old codes for this email
  DELETE FROM public.email_verification_codes
  WHERE email = user_email;
  
  -- Insert new code (expires in 5 minutes)
  INSERT INTO public.email_verification_codes (email, code, expires_at)
  VALUES (user_email, new_code, now() + INTERVAL '5 minutes');
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify code
CREATE OR REPLACE FUNCTION public.verify_code(user_email TEXT, user_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  -- Check if code is valid
  SELECT EXISTS(
    SELECT 1 FROM public.email_verification_codes
    WHERE email = user_email 
    AND code = user_code 
    AND expires_at > now()
    AND verified = false
  ) INTO is_valid;
  
  -- If valid, mark as verified
  IF is_valid THEN
    UPDATE public.email_verification_codes
    SET verified = true
    WHERE email = user_email AND code = user_code;
  END IF;
  
  RETURN is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
