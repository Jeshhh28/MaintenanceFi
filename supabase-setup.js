/*
This file is not part of the React application.
It's a reference for setting up the correct Supabase storage policies.

Run these SQL commands in your Supabase SQL editor to fix the RLS policy issues:
*/

/*
1. Create a storage bucket for file uploads
*/ \
-- Run this in the Supabase SQL editor
CREATE BUCKET IF NOT EXISTS proof_uploads

/*
2. Set up proper RLS policies for the storage bucket
*/
--Allow
authenticated
users
to
upload
files
to
their
own
folder
CREATE
POLICY
;("Users can upload their own files")
ON
storage.objects
FOR
INSERT
TO
authenticated
WITH
CHECK (
  bucket_id = 'proof-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

--Allow
authenticated
users
to
view
their
own
files
CREATE
POLICY
;("Users can view their own files")
ON
storage.objects
FOR
SELECT
TO
authenticated
USING (
  bucket_id = 'proof-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

--Allow
employees
to
view
all
files
CREATE
POLICY
;("Employees can view all files")
ON
storage.objects
FOR
SELECT
TO
authenticated
USING (
  bucket_id = 'proof-uploads' AND 
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'employee'
  )
);

/*
3. Set up the profiles table with proper structure
*/
CREATE
TABLE
IF
NOT
EXISTS
profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

--Create
a
trigger
to
create
a
profile
when
a
user
signs
up
CREATE
OR
REPLACE
FUNCTION
public.handle_new_user()
RETURNS
TRIGGER
AS
$$
BEGIN
INSERT
INTO
public.profiles(id, role)
VALUES(NEW.id, "student")
--Default
role
is
student
RETURN
NEW
END
$$
LANGUAGE
plpgsql
SECURITY
DEFINER

--Trigger
the
function every
time
a
user
is
created
CREATE
TRIGGER
on_auth_user_created
AFTER
INSERT
ON
auth.users
FOR
EACH
ROW
EXECUTE
FUNCTION
public.handle_new_user()

/*
4. Set up the requests table
*/
CREATE
TABLE
IF
NOT
EXISTS
requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  reg_no TEXT NOT NULL,
  name TEXT NOT NULL,
  block TEXT NOT NULL,
  room_number TEXT NOT NULL,
  work_type TEXT NOT NULL,
  list_type TEXT NOT NULL,
  comments TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'rejected')),
  response_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--Set
up
RLS
for the requests table
ALTER
TABLE
requests
ENABLE
ROW
LEVEL
SECURITY

--Students
can
view
their
own
requests
CREATE
POLICY
;("Students can view their own requests")
ON
requests
FOR
SELECT
TO
authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'employee'
  )
);

--Students
can
insert
their
own
requests
CREATE
POLICY
;("Students can insert their own requests")
ON
requests
FOR
INSERT
TO
authenticated
WITH
CHECK((user_id = auth.uid()))

--Only
employees
can
update
requests
CREATE
POLICY
;("Employees can update requests")
ON
requests
FOR
UPDATE
TO
authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'employee'
  )
);
