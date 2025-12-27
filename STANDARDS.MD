# EXPRESS CONVENTIONS

>The server architecture is strictly based on the **Bulletproof Node.js Project Architecture**.

---

## 1. Architecture: The 3-Layer Structure
We strictly follow the **Separation of Concerns** principle. Code is divided into three distinct layers. No business logic is allowed in the Controller layer.

### 1.1 The Controller Layer (`/controllers`)
* **Role:** The entry point for HTTP requests.
* **Responsibility:** * Extracts parameters from `req.body`, `req.params`, etc.
    * Validates the existence of required input.
    * Calls the appropriate **Service**.
    * Sends the HTTP response (`res.status(200).json(...)`).
* **Rule:** **"Skinny Controllers"**. No calculations, no algorithms, no database calls.
* **Naming:** `getUser`, `loginUser`, `updateOrder`.

### 1.2 The Service Layer (`/services`)
* **Role:** The "Brain" of the application.
* **Responsibility:**
    * Contains **ALL** business logic.
    * Is "Framework Agnostic" (Does not know `req` or `res` exist).
    * Accepts raw variables, returns objects or throws Errors.
* **Rule:** **"Fat Services"**. 
* **Naming:** `AuthService`, `QuestionService`.

### 1.3 The Data Access Layer (`/models`)
* **Role:** The interface to the Database.
* **Responsibility:**
    * Direct database queries (Find, Insert, Update).
    * Schema definitions.
* **Rule:** No business logic. Just data retrieval and storage.

---

## 2. Coding Conventions

### 2.1 Naming & Style
We follow standard JavaScript conventions to ensure readability.

| Entity | Convention | Example |
| :--- | :--- | :--- |
| **Variables** | camelCase | `isValid`, `userData`, `sessionCount` |
| **Functions** | camelCase | `findUserById`, `saveAnswer` |
| **Classes** | PascalCase | `UserService`, `AuthController` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_LIMIT`, `API_URL` |
| **Booleans** | Prefix with `is`, `has`, `should` | `isActive`, `hasAccess` |
| **Files** | camelCase | `userController.js`, `authRoutes.js` |

### 2.2 Configuration
* **No Secrets in Code:** Passwords, API Keys, and DB URIs must be loaded from Environment Variables (`.env`).
* **Config Object:** Use `process.env` variables via a centralized config file or standard access.

---

## 3. Error Handling

### 3.1 In Services
* **Do not catch errors** just to log them. 
* **Throw** standard `Error` objects when logic fails.
    ```javascript
    if (!user) throw new Error('User not found');
    ```

### 3.2 In Controllers
* Wrap execution in `try/catch`.
* Catch errors thrown by services and map them to HTTP Status Codes.
    * `400` Bad Request (Validation)
    * `401` Unauthorized (Login failed)
    * `404` Not Found
    * `500` Internal Server Error
* **Never** send raw error stack traces to the client in production.

---

## 4. Documentation (JSDoc)
All Services and Custom Hooks must be documented using **JSDoc**.

**Required tags:**
* `@param` for every argument (include type).
* `@returns` for the output (include type).
* `@throws` if the function explicitly throws an error.

**Example:**
```javascript
/**
 * Verifies the user password.
 * * @param {string} password - The plain text password.
 * @param {string} hash - The bcrypt hash.
 * @returns {Promise<boolean>} True if match.
 */
const verifyPassword = async (password, hash) => { ... }