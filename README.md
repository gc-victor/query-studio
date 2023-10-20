# Query Studio

Query Studio helps you explore and manipulate your remote SQLite databases.

To use Query Studio it is required to have a Query Server running. You can follow the guide [Run A Query Server](https://github.com/gc-victor/query?tab=readme-ov-file#run-a-query-server) to run it.

## Table of Contents

- [Query Studio Demo](#query-studio-demo)
- [Run Query Studio on Fly](#run-query-studio-on-fly)
- [Run Query Studio locally](#run-query-studio-locally)
- [Run Query Studio locally with Docker](#run-query-studio-locally-with-docker)
- [Query Studio](#query-studio)
  - [Login](#login)
  - [Editor](#editor)
  - [Logout](#logout)
- [License](#license)

## Query Studio Demo

You can see a demo of Query Studio in <https://query-studio.fly.dev>.

To login, you can use the following credentials:

- **Email:** `admin`
- **Password:** `admin`

### How to use the demo

Once you are logged in, you will see the Editor page. You can start using the Editor by selecting a database or adding a new one. You can do it using the input field on the left of the page. Each time you add or select a database, it will remove the previous code on the editor.

By default, the demo has a database called `test.sql`. You have to add it and use it to test Query Studio. You can run the following queries:

```sql
SELECT * FROM sqlite_master WHERE type='table';
```

You will see the different tables that other users has created. You can select one of them and run the following query:

```sql
SELECT * FROM table_name;
```

The default table name is `key_value`.

You will see the data of the table. You can click on the table header to sort the results by that column. Also, you can click on a cell to edit it. Once you have edited a cell, you can press `Enter` to save the changes or `Esc` to cancel them.

## Run Query Studio on Fly

We recommend use Query Studio with Fly (<https://fly.io>). It will help you to deploy your server in a few minutes close to your Query Server.

If it is the first time using Fly, you can follow the [Hands-on with Fly.io](https://fly.io/docs/hands-on/) guide to install the CLI, sign up and sign in.

Once you have the Fly CLI installed, you have to rename the `fly.toml.dist` to `fly.toml`, and update it with your app name and the primary region running the following command:

```sh
fly launch
```

Remember to use the same region as your primary Query Server.

It is time to set the environment variables for your app. You can do it running the following commands:

Query Server URL:

```sh
fly secrets set QUERY_STUDIO_QUERY_SERVER=__USE_A_QUERY_SERVER_URL__
```

Example:

```sh
fly secrets set QUERY_STUDIO_QUERY_SERVER=https://query-server.fly.dev
```

Client URL:

```sh
fly secrets set QUERY_STUDIO_CLIENT_URL=__USE_THE_QUERY_STUDIO_APP_URL__
```

Example:

```sh
fly secrets set QUERY_STUDIO_CLIENT_URL=https://query-studio.fly.dev
```

That's it! Now you can deploy your app running:

```sh
fly deploy
```

In case that there are more than one machine running your app, you should destroy the extra ones running:

```sh
fly m list # To list the machines
```

```sh
fly m destroy MACHINE_ID # To destroy the machine
```

It is needed because we save the session in memory, and it will be lost if the request flights from one machine to another.

## Run Query Studio locally

To run Query Studio locally, you have to rename the `.env.dist` to `.env`, and update it with your Query Server URL.

Query Server URL:

```sh
QUERY_STUDIO_QUERY_SERVER=__USE_A_QUERY_SERVER_URL__
```

Example:

```sh
QUERY_STUDIO_QUERY_SERVER=https://query-server.fly.dev
```

Then, you can run the following command:

```sh
make server
```

## Run Query Studio locally with Docker

To run Query Studio with Docker, you have to rename the `.env.dist` to `.env`, and update it with your Query Server URL.

Update the environment variables in the `.env` has in the [Run Query Studio locally](#run-query-studio-locally) section.

Then, you can run the following command:

```sh
make docker-build
```

Once the image is built, you can run the following command:

```sh
make docker-run
```

And you can access to Query Studio in <http://localhost:3000>.

## Query Studio

### Login

Once you have Query Studio running, you can access to it in <http://localhost:3000> (or the Fly App URL) and you will see the login page.

To login, you have to use the same credentials that you use to login in your Query Server.

### Editor

Once you are logged in, you will see the Editor page.

To start using the Editor, you have to select a database or add a new one. You can do it using the input field on the left of the page. Each time you add or select a database, it will remove the previous code on the editor.

Once you have selected a database, you will be able to query your remote databases using SQLite by pressing the `Run` button or pressing `Ctrl + Enter`/`Cmd + Enter`.

After a query is executed, you will see the results in a table. You can click on the table header to sort the results by that column. Also, you can click on a cell to edit it. Once you have edited a cell, you can press `Enter` to save the changes or `Esc` to cancel them.

### Logout

To logout, you can click on the `Logout` button on the top left of the page.

## License

Query Studio is licensed under the [MIT License](./LICENSE).
