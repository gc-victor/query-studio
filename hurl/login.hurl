POST {{query_host}}/user
Authorization: {{user_token}}
```json
{
    "email": "query_studio_login",
    "password": "password",
    "admin": true,
    "active": true
}
```
HTTP 201

POST {{host}}/api/login
HTTP 500
[Asserts]
body contains "Internal Server Error"
cookie "session" not exists

POST {{host}}/api/login
[FormParams]
email: without_password
HTTP 400
[Asserts]
body contains "Email and password are required."
cookie "session" not exists

POST {{host}}/api/login
[FormParams]
email: query_studio_login
password: wrong-password
HTTP 400
[Asserts]
body contains "The email or password is not correct."
cookie "session" not exists

POST {{host}}/api/login
[FormParams]
email: query_studio_login
password: password
HTTP 200
[Asserts]
header "Set-Cookie" contains "session="
header "Set-Cookie" contains "Path=/; Expires=3600000; Max-Age=3600000; HttpOnly; Secure;"
jsonpath "$.data[0].token" exists

DELETE {{query_host}}/user
Authorization: {{user_token}}
```json
{
  "email": "query_studio_login"
}
```
HTTP 200