Spring Boot Blogging Microservices with MySQL (local, no Docker)
====================================================================

Structure:
- auth-service/  (port 8081) -- user registration, authentication, JWT issuance, admin management
- post-service/  (port 8080) -- posts CRUD, ownership checks, requires JWT for protected operations

Important setup (you must perform these steps locally)
1. Install and run MySQL locally.
2. Create a database and user, for example (run in MySQL prompt):
   CREATE DATABASE blogdb;
   CREATE USER 'bloguser'@'localhost' IDENTIFIED BY 'blogpass';
   GRANT ALL PRIVILEGES ON blogdb.* TO 'bloguser'@'localhost';
   FLUSH PRIVILEGES;

3. Configure DB credentials in each service `src/main/resources/application.properties`
   Default properties point to:
   jdbc:mysql://localhost:3306/blogdb
   username: bloguser
   password: blogpass

4. Build & run services:
   - auth-service:
       cd auth-service
       mvn spring-boot:run
     Service runs on http://localhost:8081

   - post-service:
       cd post-service
       mvn spring-boot:run
     Service runs on http://localhost:8080

5. Flow:
   - Register a user: POST http://localhost:8081/api/auth/register
   - Login: POST http://localhost:8081/api/auth/login  -> returns JWT
   - Use the JWT in Authorization: Bearer <token> when calling post-service endpoints:
       GET /api/posts             (public)
       POST /api/posts            (authenticated)
       PUT /api/posts/{id}        (owner or admin)
       DELETE /api/posts/{id}     (owner or admin)

Admin
- On startup, auth-service seeds a default admin:
  username: admin
  password: admin123
  role: ROLE_ADMIN

Notes
- This is a minimal, educational template. Add validation, DTOs, error handling, tests as needed.
- Both services share a JWT secret (hardcoded for demo). For production, use environment variables or a secret manager.
