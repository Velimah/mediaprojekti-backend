# Media Services Project, AI HTML Website Builder Backend

**Members:** Catrina Koskinen, Niko Purola, Veli-Matti Heino

**Stack:** Typescript, Express, MongoDB

**Install dependencies:**

`npm install`

**Start Backend:**

`npm start`

**Project website** 

[https://velimah.github.io/mediaprojekti/](https://velimah.github.io/mediaprojekti/)

## API Endpoint Documentation

This document provides details about the various endpoints available in the API and how to use them.

>:warning: API requires access credentials to MongoDB if you want to run it locally.

## Table of Contents
- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Logout](#logout)
- [Websites](#websites)
  - [Save a website](#save_a_website)
  - [Get saved websites](#get_saved_websits)
  - [Update a website](#update_a_website)
  - [Delete a website](#delete_a_website)


## Authentication

### Register

**Endpoint:** `POST /user/register`

**Description:** Registers a new user and stores their information into the database.

**Parameter**
| Field                | Type     | Required | Description               |
|--------------------------|----------|----------|-----------------------|
| `username`               | String   | Yes      | username              |
| `password`               | String   | Yes      | userpassword          |

**Success Response:**
```javascript 
HTTP/1.1 200 OK

{
  "message": "User registered successfully"
}
```

**Error Response:**
```javascript 
HTTP/1.1 400 Internal Server Error

{
  "MongoError: ", error: error.message
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
  "message": "Register error: ", error: String(error)
}
```

### Login

**Endpoint:** `POST /user/login`

**Description:** Logs in a user and generates a JWT token.

**Parameter**
| Field                | Type     | Required | Description               |
|--------------------------|----------|----------|-----------------------|
| `username`               | String   | Yes      | name                  |
| `password`               | String   | Yes      | user password         |

**Success Response:**
```javascript
HTTP/1.1 200 OK

{
  "id": "user_id",
  "username": "user_name",
  "accessToken": "generated_jwt_token"
}
```

**Error Response:**
```javascript 
HTTP/1.1 500 Internal Server Error

{
  "message": "MongoError: ", error: error.message
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
  "message": "Login failed", error: String(error)
}
```

### Logout

**Endpoint:** `POST /user/logout`

**Description:** Logs the user out.

**Success Response:**
```javascript
HTTP/1.1 200 OK

{
  "message": "Logged out"
}
```

**Error Response:**
```javascript 
HTTP/1.1 500 Internal Server Error

{
  "message": "MongoError: ", error: error.message
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
  "message": "Logout failed: ", error: String(error)
}
```


## Websites

### Save a website

**Endpoint:** `POST /user/savecode`

**Description:** Saves a built website to the database.

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `         | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `name`               | String   | Yes      | user name             |
| `html`               | String   | Yes      | website html string   |
| `user`               | String   | Yes      | user id               |

**Success Response:**
```javascript
HTTP/1.1 200 OK

{
  "message": "Code saved"
}
```

**Error Response:**
```javascript 
HTTP/1.1 500 Internal Server Error

{
  "message": "MongoError", error: error.message 
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
  "message": "Error saving code", error: String(error)
}
```

### Get saved websites

**Endpoint:** `GET /user/getsaved/:id`

**Description:** Get a saved websites

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `         | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | user id               |

**Success Response:**
```javascript
HTTP/1.1 200 OK

[
  {
    "_id": user id;
    "name": username;
    "html": website html string;
    "previewimage": image string | null;
  },
  //... more website objects
]
```

**Error Response:**
```javascript 
HTTP/1.1 500 Internal Server Error

{
 "message": "MongoError", error: error.message
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
  "message": "Error saving code", error: String(error)
}
```

### Update a website

**Endpoint:** `PUT /user/updatesaved/:id`

**Description:** Updates a saved website to database.

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `         | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | website id            |
| `user`               | String   | Yes      | user id               |
| `html`               | String   | Yes      | website html string   |


**Success Response:**
```javascript
HTTP/1.1 200 OK

{
  "_id": user id;
  "name": username;
  "html": website html string;
  "previewimage": image string | null;
}
```

**Error Response:**
```javascript
HTTP/1.1 403 Forbidden

{
  "message": "Unauthorized to update this website"
}
```

```javascript
HTTP/1.1 404 File Not Found

{
  "message": "Website not found" 
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
 "message": "MongoError", error: error.message
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
 "message": "Error updating website", error: String(error)
}
```

### Delete a website

**Endpoint:** `DELETE /user/deletesaved/:id`

**Description:** Deletes a saved website from database.

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `         | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | current users id      |

**Success Response:**
```javascript
HTTP/1.1 200 OK

{
 "message": "Website deleted"
}
```

**Error Response:**
```javascript
HTTP/1.1 403 Forbidden

{
  message: "Unauthorized to delete this website"
}
```

```javascript
HTTP/1.1 404 File Not Found

{
  "message": "Website not found"
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
 "message": "MongoError", error: error.message
}
```

```javascript
HTTP/1.1 500 Internal Server Error

{
 "message": "Error deleting website", error: String(error)
}
```
