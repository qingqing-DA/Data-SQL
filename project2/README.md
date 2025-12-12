Features
1. User Registration

Register new users with basic profile information.

Automatically records registration timestamp.

Validates required fields before inserting into database.

2. Secure User Sign-in (SQL Injection Protected)

Uses parameterized SQL queries to prevent SQL injection attacks.

Validates user credentials securely.

Prevents authentication bypass techniques such as:' OR '1'='1

3. Search Users by First and/or Last Name

Supports searching by:First name only and Last name only, and Both first & last name Case-insensitive matching.

4. Search Users by User ID

Retrieve a specific user using their unique userid.

5. Search Users by Salary Range

Returns all users whose salary is between X and Y.

6. Search Users by Age Range

Retrieve all users whose ages fall between X and Y.

7. Search Users Registered After a Given User

Given a specific userid (e.g., "john"), return all users registered after that user. Compares registration timestamps.

8. Search Users Who Never Signed In

Identify users who registered but never logged in. Useful for analyzing user engagement.

9. Search Users Registered on the Same Day as Another User

Given a userid, return all users registered on the same calendar day.

Ignores time-of-day differences.

10. Users Registered Today

Return all users created on the current date.

