POST {{query_host}}/user
Authorization: {{user_token}}
```json
{
    "email": "query_studio_query",
    "password": "password",
    "admin": true,
    "active": true
}
```
HTTP 201

POST {{host}}/api/query
```json
{
    "db_name": "hurl-test-query-studio.sql",
    "query": "CREATE TABLE query_studio_query (key TEXT NOT NULL UNIQUE, value TEXT);"
}
```
HTTP 401

POST {{host}}/api/login
[FormParams]
email: query_studio_query
password: password
HTTP 200
[Captures]
session: cookie "session"

POST {{host}}/api/query
[Cookies]
session: {{session}}
```json
{
    "db_name": "hurl-test-query-studio.sql",
    "query": "CREATE TABLE query_studio_query (key TEXT NOT NULL UNIQUE, value TEXT);"
}
```
HTTP 200

POST {{host}}/api/query
[Cookies]
session: {{session}}
```json
{
    "db_name": "hurl-test-query-studio.sql",
    "query": "INSERT INTO query_studio_query (key, value) VALUES (:key, :value);",
    "params": {
        ":key": "test",
        ":value": "-"
    }
}
```
HTTP 200

POST {{host}}/api/query
[Cookies]
session: {{session}}
```json
{
    "db_name": "hurl-test-query-studio.sql",
    "query": "DROP TABLE query_studio_query;"
}
```
HTTP 200

POST {{host}}/api/logout
[Cookies]
session: {{session}}
HTTP 302
[Asserts]
cookie "session" isEmpty
cookie "session[Max-Age]" == 0

POST {{host}}/api/query
[Cookies]
session: {{session}}
```json
{
    "db_name": "hurl-test-query-studio.sql",
    "query": "INSERT INTO query_studio_query (key, value) VALUES (:key, :value);",
    "params": {
        ":key": "test",
        ":value": "-"
    }
}
```
HTTP 401

DELETE {{query_host}}/user
Authorization: {{user_token}}
```json
{
  "email": "query_studio_query"
}
```
HTTP 200