-- Create a function to automatically update profile_complete status
CREATE OR REPLACE FUNCTION public.update_profile_complete_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark profile as complete if all required fields are filled
  NEW.profile_complete = (
    NEW.first_name IS NOT NULL AND trim(NEW.first_name) != '' AND
    NEW.last_name IS NOT NULL AND trim(NEW.last_name) != '' AND
    NEW.display_name IS NOT NULL AND trim(NEW.display_name) != ''
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update profile_complete status
DROP TRIGGER IF EXISTS trigger_update_profile_complete ON public.profiles;
CREATE TRIGGER trigger_update_profile_complete
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_complete_status();

-- Update existing profiles to reflect their completion status
UPDATE public.profiles 
SET profile_complete = (
  first_name IS NOT NULL AND trim(first_name) != '' AND
  last_name IS NOT NULL AND trim(last_name) != '' AND
  display_name IS NOT NULL AND trim(display_name) != ''
);

-- Add a check constraint to ensure required fields for complete profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT check_profile_complete 
CHECK (
  (profile_complete = false) OR 
  (profile_complete = true AND 
   first_name IS NOT NULL AND trim(first_name) != '' AND
   last_name IS NOT NULL AND trim(last_name) != '' AND
   display_name IS NOT NULL AND trim(display_name) != '')
);