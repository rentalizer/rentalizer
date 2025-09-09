-- Remove RentCast API key column since we're simplifying to use only AirDNA
ALTER TABLE user_api_keys DROP COLUMN IF EXISTS rental_api_key;