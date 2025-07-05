-- Create function to handle new user signup and create user_profile
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into user_profiles table when a new user signs up
  INSERT INTO public.user_profiles (id, email, subscription_status)
  VALUES (NEW.id, NEW.email, 'trial');
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create user_profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();