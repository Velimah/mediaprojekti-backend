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
  - [Save a website](#save-a-website)
  - [Get saved websites](#get-saved-websites)
  - [Update a website](#update-a-website)
  - [Delete a website](#delete-a-website)
- [Advanced Websites](#websites)
  - [Save an advanced website](#save-an-advanced-website)
  - [Get saved advanced websites](#get-saved-advanced-websites)
  - [Update an advanced website](#update-an-advanced-website)
  - [Delete an advanced website](#delete-an-advanced-website)


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
| `Authorization: token `   | String   | Yes      | Authentication token  |

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
| `Authorization: token `   | String   | Yes      | Authentication token  |

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
| `Authorization: token `   | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | website id            |
| `userId`             | String   | Yes      | current users id      |
| `updatedData `       | String   | Yes      | website html string   |


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
| `Authorization: token `   | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | website id            |
| `userId`             | String   | Yes      | current users id      |

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

## Advanced Websites

### Save an advanced website

**Endpoint:** `POST /user/advancedsavecode`

**Description:** Saves a built website to the database.

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `   | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `name`               | String   | Yes      | website name          |
| `cssLibrary`         | String   | Yes      | used css framework/lib|
| `user`               | String   | Yes      | user id               |
| `originalCode`       | String   | Yes      | html string           |
| `html`               | Array    | Yes      | array of html blocks  |

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
### Get saved advanced websites

**Endpoint:** `GET /user/getsavedadvanced/:id`

**Description:** Get saved advanced websites

```javascript
interface HtmlBlock {
  id: number;
  name: string;
  content: string;
}
```

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `   | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | user id               |

**Success Response:**
```javascript
HTTP/1.1 200 OK
[
  {
    "_id": "user_id",
    "originalCode": "html_string",
    "name": "website_name",
    "htmlArray": [
      HtmlBlock,
      HtmlBlock2,
      // ... more HTML blocks
    ],
    "previewImage": "image_string" | null,
    "cssLibrary": "css_library_name"
  },
  // ... more website objects
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
### Update an advanced website

**Endpoint:** `PUT /user/updatesavedadvanced/:id`

**Description:** Updates a saved advanced website to database.

```javascript
interface HtmlBlock {
  id: number;
  name: string;
  content: string;
}
```

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `   | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | website id            |
| `userId`             | String   | Yes      | current users id      |
| `updatedData `       | Array    | Yes      | website html array    |


**Success Response:**
```javascript
HTTP/1.1 200 OK

{
    "_id": "user_id",
    "originalCode": "html_string",
    "name": "website_name",
    "htmlArray": [
      HtmlBlock,
      HtmlBlock2,
      // ... more HTML blocks
    ],
    "previewImage": "image_string" | null,
    "cssLibrary": "css_library_name"
  },
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

### Delete an advanced website

**Endpoint:** `DELETE /user/deleteadvancedsaved/:id`

**Description:** Deletes a saved advanced website from database.

**Header**
| Field                     | Type     | Required | Description           |
|---------------------------|----------|----------|-----------------------|
| `Authorization: token `   | String   | Yes      | Authentication token  |

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `id`                 | String   | Yes      | website id            |
| `userId`             | String   | Yes      | current users id      |

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

## OpenAI

### Prompt ChatGPT

**Endpoint:** `POST /gpt/completions`

**Description:** Make query to openAI ChatGPT

```javascript
type Role = "html" | "sanitize" | "html_block";
```

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `role`               | Role     | Yes      | role for chatgpt      |
| `prompt`             | String   | Yes      | query prompt          |

**Success Response:**
```javascript 
HTTP/1.1 200 OK

{
  "response string"
}
```

**Error Response:**
```javascript 
HTTP/1.1 500 Internal Server Error

{
  "message": "An error occurred: ", error: String(error)
}
```

### Prompt DALLE

**Endpoint:** `POST /gpt/generations`

**Description:** Make query to openAI DALLE image generator

```javascript 
type Size = "256x256" | "512x512" | "1024x1024";
```

**Parameter**
| Field                | Type     | Required | Description           |
|----------------------|----------|----------|-----------------------|
| `prompt`             | String   | Yes      | query prompt          |
| `size`               | Size     | Yes      | size for image        |

**Success Response:**
```javascript 
HTTP/1.1 200 OK

{
  "response string"
}
```

**Error Response:**
```javascript 
HTTP/1.1 500 Internal Server Error

{
  "message": "An error occurred: ", error: String(error)
}
```
```
