## POST `/register`

### Description
Registers a new user in the system.

### Request Body
Send as JSON (Content-Type: application/json):

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "yourpassword"
}
```

- `fullname.firstname` (string, required, min 3 chars)
- `fullname.lastname` (string, optional, min 3 chars)
- `email` (string, required, must be valid email)
- `password` (string, required, min 6 chars)

### Status Codes & Responses

- **201 Created**
  - Registration successful.
  - Response:
    ```json
    {
      "token": "<JWT token>",
      "user": {
        "_id": "...",
        "fullname": { "firstname": "...", "lastname": "..." },
        "email": "..."
        // other user fields
      }
    }
    ```
    - Also sets a cookie named `token`.

- **400 Bad Request**
  - Validation failed or user already exists.
  - Response:
    ```json
    {
      "errors": [ { "msg": "...", ... } ]
    }
    ```
    or
    ```json
    {
      "errors": "user already exist"
    }
    ```

### Example Thunder Client Setup

- Method: `POST`
- URL: `http://localhost:<port>/register`
- Body: Select `JSON` and enter the request body as above.

## POST `/login`

### Description
Authenticates a user and returns a JWT token.

### Request Body
Send as JSON (Content-Type: application/json):

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required, must be valid email)
- `password` (string, required)

### Status Codes & Responses

- **200 OK**
  - Login successful.
  - Response:
    ```json
    {
      "token": "<JWT token>",
      "user": {
        "_id": "...",
        "fullname": { "firstname": "...", "lastname": "..." },
        "email": "..."
        // other user fields
      }
    }
    ```
    - Also sets a cookie named `token`.

- **401 Unauthorized**
  - Invalid credentials or validation failed.
  - Response:
    ```json
    {
      "errors": [ { "msg": "...", ... } ]
    }
    ```
    or
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

### Example Thunder Client Setup

- Method: `POST`
- URL: `http://localhost:<port>/login`
- Body: Select `JSON` and enter the request body as above.

## GET `/profile`

### Description
Returns the authenticated user's profile information. Requires authentication (token in cookie or Authorization header).

### Request
- No body required.
- Must include authentication token (cookie `token` or header `Authorization: Bearer <token>`).

### Status Codes & Responses

- **200 OK**
  - Profile fetched successfully.
  - Response:
    ```json
    {
      "_id": "...",
      "fullname": { "firstname": "...", "lastname": "..." },
      "email": "..."
      // other user fields
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
  - Response:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example Thunder Client Setup
- Method: `GET`
- URL: `http://localhost:<port>/profile`
- Auth: Set cookie or Authorization header with valid token.

---

## GET `/logout`

### Description
Logs out the authenticated user by clearing the token cookie and blacklisting the token.

### Request
- No body required.
- Must include authentication token (cookie `token` or header `Authorization: Bearer <token>`).

### Status Codes & Responses

- **200 OK**
  - Logout successful.
  - Response:
    ```json
    {
      "message": "Logged out"
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
  - Response:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example Thunder Client Setup
- Method: `GET`
- URL: `http://localhost:<port>/logout`
- Auth: Set cookie or Authorization header with valid token.


## POST `/captain/send-otp`

### Description
Sends a 6-digit OTP to the provided mobile number for captain registration or login verification.

### Request Body
Send as JSON (Content-Type: application/json):

```json
{
  "mobile": "9876543210"
}
```

- `mobile` (string, required, must be a valid Indian mobile number)

### Status Codes & Responses

- **200 OK**
  - OTP sent successfully.
  - Response:
    ```json
    {
      "message": "OTP sent successfully",
      "otp": "123456"
    }
    ```

- **400 Bad Request**
  - Missing mobile number.
  - Response:
    ```json
    {
      "message": "Mobile number is required"
    }
    ```

- **500 Internal Server Error**
  - Unexpected error.
  - Response:
    ```json
    {
      "message": "Something went wrong"
    }
    ```

### Example Thunder Client Setup
- Method: `POST`
- URL: `http://localhost:<port>/captain/send-otp`
- Body: Select `JSON` and enter the request body as above.

---

## POST `/captain/verify-otp`

### Description
Verifies the OTP for the provided mobile number. If the captain exists, returns a token; otherwise, prompts to register.

### Request Body
Send as JSON (Content-Type: application/json):

```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

- `mobile` (string, required)
- `otp` (string, required)

### Status Codes & Responses

- **201 Created**
  - OTP verified and captain exists.
  - Response:
    ```json
    {
      "captainExist": true,
      "token": "<JWT token>"
    }
    ```
  - OTP verified but captain does not exist.
    ```json
    {
      "captainExist": false,
      "message": "please register "
    }
    ```

- **400 Bad Request**
  - Missing mobile or OTP, or invalid OTP.
  - Response:
    ```json
    {
      "message": "Mobile and OTP are required"
    }
    ```
    or
    ```json
    {
      "message": "Invalid OTP"
    }
    ```

- **500 Internal Server Error**
  - Unexpected error.
  - Response:
    ```json
    {
      "err": { ... }
    }
    ```

### Example Thunder Client Setup
- Method: `POST`
- URL: `http://localhost:<port>/captain/verify-otp`
- Body: Select `JSON` and enter the request body as above.




## POST `/captain/register`

### Description
Registers a new captain in the system. Registration is only allowed after successful OTP verification using `/captain/send-otp` and `/captain/verify-otp` endpoints.

### Registration Flow
1. **Send OTP:**
   - Endpoint: `/captain/send-otp`
   - Send mobile number to receive OTP.
2. **Verify OTP:**
   - Endpoint: `/captain/verify-otp`
   - Send mobile number and OTP to verify.
3. **Register Captain:**
   - Endpoint: `/captain/register`
   - Send registration details along with the same mobile number and OTP.

### Request Body
Send as JSON (Content-Type: application/json):

```json
{
  "fullname": {
    "firstname": "Amit",
    "lastname": "Sharma"
  },
  "mobile": "9876543210",
  "vehicle": {
    "color": "Red",
    "plate": "MH12AB1234",
    "capacity": 4,
    "vehicleType": "car"
  },
  "otp": "123456"
}
```

- `fullname.firstname` (string, required, min 3 chars)
- `fullname.lastname` (string, optional, min 3 chars)
- `mobile` (string, required, must be 10 digits, valid Indian mobile number)
- `vehicle.color` (string, required, min 3 chars)
- `vehicle.plate` (string, required, min 3 chars)
- `vehicle.capacity` (integer, required, min 1)
- `vehicle.vehicleType` (string, required, one of: car, motorcycle, auto)
- `otp` (string, required, must match the OTP sent to the mobile number)

### Status Codes & Responses

- **201 Created**
  - Registration successful.
  - Response:
    ```json
    {
      "captain": {
        "_id": "...",
        "fullname": { "firstname": "...", "lastname": "..." },
        "mobile": "...",
        "vehicle": {
          "color": "...",
          "plate": "...",
          "capacity": ...,
          "vehicleType": "..."
        }
        // other captain fields
      },
      "token": "<JWT token>"
    }
    ```

- **400 Bad Request**
  - Invalid OTP.
  - Response:
    ```json
    {
      "message": "Invalid OTP"
    }
    ```

- **401 Unauthorized**
  - Validation failed, captain already exists, or missing fields.
  - Response:
    ```json
    {
      "errors": [ { "msg": "...", ... } ]
    }
    ```
    or
    ```json
    {
      "message": "captain already exist"
    }
    ```
    or
    ```json
    {
      "message": "All fields are required"
    }
    ```

- **500 Internal Server Error**
  - Unexpected error.
  - Response:
    ```json
    {
      "error": { ... }
    }
    ```

### Example Thunder Client Setup
- Method: `POST`
- URL: `http://localhost:<port>/captain/register`
- Body: Select `JSON` and enter the request body as above.
- Make sure to use the same mobile number and OTP as used in the previous steps.

---

## GET `/captain/profile`

### Description
Returns the authenticated captain's profile information. Requires authentication (token in cookie or Authorization header).

### Request
- No body required.
- Must include authentication token (cookie `token` or header `Authorization: Bearer <token>`).

### Status Codes & Responses

- **200 OK**
  - Profile fetched successfully.
  - Response:
    ```json
    {
      "captain": {
        "_id": "...",
        "fullname": { "firstname": "...", "lastname": "..." },
        "mobile": "...",
        "vehicle": {
          "color": "...",
          "plate": "...",
          "capacity": ...,
          "vehicleType": "..."
        }
        // other captain fields
      }
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
  - Response:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example Thunder Client Setup
- Method: `GET`
- URL: `http://localhost:<port>/captain/profile`
- Auth: Set cookie or Authorization header with valid token.

---

## GET `/captain/logout`

### Description
Logs out the authenticated captain by clearing the token cookie and blacklisting the token.

### Request
- No body required.
- Must include authentication token (cookie `token` or header `Authorization: Bearer <token>`).

### Status Codes & Responses

- **200 OK**
  - Logout successful.
  - Response:
    ```json
    {
      "message": "Logout successfully"
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
  - Response:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example Thunder Client Setup
- Method: `GET`
- URL: `http://localhost:<port>/captain/logout`
- Auth: Set cookie or Authorization header with valid token.

