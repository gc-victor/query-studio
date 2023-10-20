POST {{query_host}}/user
Authorization: {{user_token}}
```json
{
    "email": "query_studio_logout",
    "password": "password",
    "admin": true,
    "active": true
}
```
HTTP 201

POST {{host}}/api/login
[FormParams]
email: query_studio_logout
password: password
HTTP 200
[Asserts]
header "Set-Cookie" contains "session="
header "Set-Cookie" contains "Path=/; Expires=3600000; Max-Age=3600000; HttpOnly; Secure;"
jsonpath "$.data[0].token" exists
[Captures]
session: cookie "session"

POST {{host}}/api/logout
[Cookies]
session: {{session}}
HTTP 302
[Asserts]
cookie "session" isEmpty
cookie "session[Max-Age]" == 0

DELETE {{query_host}}/user
Authorization: {{user_token}}
```json
{
  "email": "query_studio_logout"
}
```
HTTP 200