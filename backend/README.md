# Task Management - Nest

## Description

Task manager CRUD with pagination for task list.

## Task stack

This project is build using:

- Nestjs
- PostgreSQL
- Prisma as ORM

## Project setup

1. Firstly, make sure you are in the `/backend` directory.
2. Run the node modules installation

```bash
$ pnpm install
```

`Note`:

a. If you are using other package manager, you can firstly delete the:

```bash
pnpm-locl.yaml
pnpm-workspace.ymal
```

b. Then you can savely install the node modules using your node package manager

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

`Note`: If you are using other package manager, you can change the pnpm with your package manager (e.g npm or yarn)

## API

### Health check endpoint

Output Example:

```json
{
  "code": "SUCCESS",
  "message": "Operation successful",
  "data": "OK"
}
```

### Get All Tasks (with pagination)

- **Method:** `GET`
- **Endpoint:** `/tasks`
- **Description:** Retrieve paginated list of tasks

#### Query Parameters:

| Parameter | Type    | Default      | Description                                         |
| --------- | ------- | ------------ | --------------------------------------------------- |
| skip      | integer | 0            | Number of records to skip                           |
| take      | integer | 10           | Number of records to take                           |
| orderBy   | string  | "created_at" | Field to order by ("created_at", "title", "status") |
| order     | string  | "desc"       | Sort order ("asc" or "desc")                        |

- Response example:

```json
{
  "code": "SUCCESS",
  "message": "Tasks retrieved successfully",
  "data": {
    "data": [
        {
          "id": 101,
          "title": "Update",
          "description": null,
          "status": "pending",
          "created_at": "2025-10-19T14:03:01.517Z",
          "updated_at": "2025-10-19T14:03:01.517Z"
        },
        ...
      ],
      "total": 100,
      "skip": 0,
      "take": 10,
      "hasNext": true
  }
}
```

### Create new task

- **Method:** `POST`
- **Endpoint:** `/tasks`
- **Description:** Create a new task

```bash
http://localhost:3000/tasks
```

- Request body:

```json
{
  "title": "Complete API documentation",
  "description": "Write comprehensive API docs for all endpoints",
  "status": "pending"
}
```

- Success Response example :

```json
{
  "code": "TASK_CREATED",
  "message": "Task created successfully",
  "data": {
    "id": 103,
    "title": "Complete API documentation",
    "description": "Write comprehensive API docs for all endpoints",
    "status": "pending",
    "created_at": "2025-10-20T02:00:04.585Z",
    "updated_at": "2025-10-20T02:00:04.585Z"
  }
}
```

- Error Response example:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "fields": [
    {
      "field": "title",
      "message": "Title must be shorter than or equal to 255 characters, Title should not be empty, title must be a string"
    }
  ]
}
```

### Update task status

- **Method:** `PATCH`
- **Endpoint:** `/tasks/${taskId}/status`
- **Description:** Update task status

```bash
http://localhost:3000/tasks/${taskId}/status
```

- Request body:

```json
{
  "status": "pending"
}
```

- Success Response example :

```json
{
  "code": "TASK_UPDATED",
  "message": "Task status updated successfully",
  "data": {
    "id": 4,
    "title": "Testimonium ulterius ager porro sophismata.",
    "description": "Supplanto tonsor tripudio eveniet.",
    "status": "done",
    "created_at": "2025-10-19T13:59:32.724Z",
    "updated_at": "2025-10-20T02:05:41.331Z"
  }
}
```

- Error Response example:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "fields": [
    {
      "field": "status",
      "message": "status must be one of: pending, in_progress, done"
    }
  ]
}
```

### Delete task

- **Method:** `DEL`
- **Endpoint:** `/tasks/${taskId}`
- **Description:** Delete a task based on taskId

```bash
http://localhost:3000/tasks/${taskId}
```

- Success Response does not return any response body. Only status code 204

- Error Response example:

```json
{
  "code": "RESOURCE_NOT_FOUND",
  "message": "Task with identifier 999 not found"
}
```

### Update task

- **Method:** `PUT`
- **Endpoint:** `/tasks/${taskId}`
- **Description:** Update a task

```bash
http://localhost:3000/tasks/${taskId}
```

- Request body:

```json
{
  "title": "Updated",
  "description": "Updated"
}
```

- Success Response example :

```json
{
  "code": "TASK_UPDATED",
  "message": "Task updated successfully",
  "data": {
    "id": 4,
    "title": "Updated",
    "description": "Updated",
    "status": "done",
    "created_at": "2025-10-19T13:59:32.724Z",
    "updated_at": "2025-10-20T02:14:53.968Z"
  }
}
```

- Error Response example:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "fields": [
    {
      "field": "title",
      "message": "Title must be shorter than or equal to 255 characters, Title should not be empty, title must be a string"
    }
  ]
}
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
