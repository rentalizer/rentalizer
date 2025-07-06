-- Delete sample discussions that are appearing on live site
DELETE FROM discussions WHERE id IN (
  '90508e1f-f041-4442-99b4-f45a305c3e4a',
  'b8aa7290-df74-4bec-841a-bd419b5e4920', 
  '85a87531-b641-4e22-8aa0-0131cff89bd5'
);