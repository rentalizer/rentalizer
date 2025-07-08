-- Add admin role for the current user
INSERT INTO user_roles (user_id, role) 
VALUES ('9b12ede0-6ab8-450e-927b-939c112be5f1', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;