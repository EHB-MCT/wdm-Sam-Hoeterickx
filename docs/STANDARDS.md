# EXPRESS CONVENTIONS

## 1. Architecture: Feature-Based Structure

The server architecture follows the **Bulletproof Node.js Project Architecture** principles regarding logic separation, implemented via a **Feature-Based (Domain-Driven) Folder Structure**.

We organize code by **Feature/Domain** rather than by technical layer.  
Each feature (e.g., Users, Sessions) is a self-contained module containing all its necessary layers.

---

### 1.1 Folder Layout

Every feature folder located in `/src` must contain the following standard files:

```
    src/
    ├── <feature_name>/         (e.g., /users)
    │   ├── route.js            (Entry Point)
    │   ├── controller.js       (Request Handling)
    │   ├── service.js          (Business Logic)
    │   └── model.js            (Data Access)
```

---

### 1.2 Layer Responsibilities

#### A. HTTP Layer (`route.js`)
- Defines API endpoints
- Injects dependencies
- Executes middleware  
**Rule:** No business logic or database access.

#### B. Controller Layer (`controller.js`)
- Extracts request parameters
- Validates input presence
- Calls service methods
- Sends HTTP responses  
**Rule:** Skinny controllers.

#### C. Service Layer (`service.js`)
- Contains all business logic
- Framework agnostic
- Validates business rules  
**Rule:** Fat services.

#### D. Data Access Layer (`model.js`)
- Handles direct database queries
- Enforces schemas  
**Rule:** No business logic.

---

## 2. Coding Conventions

### 2.1 Naming & Style

| Entity | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | userData, isValid |
| Functions | camelCase | findUserById, saveAnswer |
| Constants | UPPER_SNAKE_CASE | API_URL |
| Booleans | Prefix with is, has, should | isActive |
| Feature folders | camelCase plural | /users |
| Files | camelCase | controller.js, service.js |

### 2.2 Configuration
* No Secrets in Code: Passwords, API Keys, and DB URIs must be loaded from Environment Variables (.env).
* Config Object: Use process.env variables via a centralized config file or standard access.

---

## 3. Error Handling

### Services
* Do not catch errors just to log them (unless adding context).
* Throw standard Error objects when logic fails.

```
    if (!user) throw new Error('User not found');
```

### Controllers
Wrap execution in try/catch blocks.
Catch errors thrown by services and map them to HTTP Status Codes.
    * 400 Bad Request (Validation)
    * 401 Unauthorized (Login failed)
    * 404 Not Found
    * 500 Internal Server Error

Never send raw error stack traces to the client in production.

---

## 4. Documentation (JSDoc)

All services and shared utilities must be documented using JSDoc.
Required tags:
    * @param for every argument (include type).
    * @returns for the output (include type).
    * @throws if the function explicitly throws an error.


```javascript
    /**
     * Verifies the user password against the stored hash.
     * 
     * @param {string} password - The plain text password input.
     * @param {string} hash - The bcrypt hash from the database.
     * @returns {Promise<boolean>} True if the password matches.
     * @throws {Error} If arguments are missing.
    */
    const verifyPassword = async (password, hash) => { ... }
```

<br>
---
<br>

# REACT CONVENTIONS

## 1. Architecture: The Separation Pattern
To maintain scalability, we separate the Visuals (JSX) from the Business Logic (State & Effects).

### 1.1 Components & Pages (`modules/*/page`, `modules/*/components`, `shared/components`)
* **Role:** The View Layer.
* **Responsibility:** * Rendering HTML/JSX.
    * Displaying data received from props or hooks.
    * Styling (CSS).
* **Rule:** **"Skinny Components"**. Components should contain minimal logic. If a component has many `useEffect` or `useState` calls, extract them into a Custom Hook.
* **Naming:** PascalCase (`UserProfile.jsx`, `SubmitButton.jsx`).

### 1.2 Custom Hooks (`shared/hooks`, `modules/*/hooks`)
* **Role:** The Logic Layer (The "Controller" of the Frontend).
* **Responsibility:**
    * Managing local state (`useState`, `useReducer`).
    * Handling side effects (`useEffect`).
    * Calling API Services.
    * Returning data and handler functions to the component.
* **Rule:** **"Logic Isolation"**. The UI component shouldn't know *how* data is fetched, only *that* it is available.
* **Naming:** camelCase, must start with `use` (`useAuth.js`, `useQuestions.js`).

### 1.3 Services (`shared/services`)
* **Role:** The API Layer.
* **Responsibility:**
    * Making HTTP requests (Fetch/Axios).
    * Standardizing API responses and errors.
    * **Singleton Pattern:** Export instances, not classes.
* **Rule:** No React code here (no Hooks, no JSX). Pure JavaScript.

---

## 2. Folder Structure

```text
    src/
      ├── main.jsx                 # Application Entry Point
      │
      ├── modules/                 # Feature Modules (Pages + Local Components)
      │   ├── app/                 # Main Application Layout & Logic
      │   ├── auth/                # Authentication Features
      │   │   ├── login/           # Login Page & Routes
      │   │   └── register/        # Registration Page & Routes
      │   ├── dashboard/           # User Dashboard Feature
      │   ├── home/                # Main Quiz Feature
      │   │   ├── components/      # Components specific to Home (QuizUI, OptionButton)
      │   │   └── page/            # Home Page Logic
      │   └── root/                # Router Configuration
      │
      ├── shared/                  # Global Resources (Used by multiple modules)
      │   ├── components/          # Reusable UI Components (ProtectedRoute)
      │   ├── data/                # Static Data (questions.json)
      │   ├── hooks/               # Global Custom Hooks (useAuth, useQuestions)
      │   ├── services/            # API Services (AuthService, QuestionService)
      │   └── utils/               # Helper functions & Modals (ConfirmationModal)
      │
      └── styles/                  # Global Styles (Base, Variables, Resets)
```
---

## 3. Naming Conventions

| Entity | Convention | Example |
| :--- | :--- | :--- |
| **Components** | PascalCase | `NavBar.jsx`, `QuestionCard.jsx` |
| **Hooks** | camelCase (prefix `use`) | `useWindowSize.js`, `useAuth.js` |
| **Functions** | camelCase | `handleSubmit`, `formatDate` |
| **Event Handlers** | `handle` + Event | `handleClick`, `handleInputChange` |
| **Props (Events)** | `on` + Event | `onClick`, `onSuccess` |
| **Constants** | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_ATTEMPTS` |

---

## 4. Coding Best Practices

### 4.1 Functional Components Only
We do not use Class Components. Use Functional Components with Hooks.

### 4.2 The "Custom Hook" Extraction Rule
If a component needs to fetch data *and* handle user input, create a hook for it.

**Bad (Logic inside UI):**
```javascript
    // UserProfile.jsx
    const UserProfile = () => {
      const [user, setUser] = useState(null);
      
      useEffect(() => {
        fetch('/api/user').then(...)
      }, []);

      return <div>{user.name}</div>
    }
```
**Good (Logic Extracted):**
```javascript
    // useUserProfile.js
    export const useUserProfile = () => {
        const [user, setUser] = useState(null);
        // ... fetch logic ...
        return { user };
    }

    // UserProfile.jsx
    const UserProfile = () => {
        const { user } = useUserProfile();
        return <div>{user?.name}</div>
    }
```

### 4.3 Prop Types & JSDoc
Since we use standard JavaScript, every component and hook must be documented using JSDoc to define props and return values.

## 5. State Management

* **Local State:** Use `useState` for simple UI state (toggles, inputs).
* **Global State:** Use **Context API** only for truly global data (User Session, Theme, Language). Avoid "Prop Drilling" more than 3 layers deep.
* **Server State:** Prefer fetching logic inside Services/Hooks.

---

## 6. Git & Commits

Follow the same **Conventional Commits** as the backend.

* `feat(ui):` add new button component
* `fix(hook):` resolve infinite loop in useAuth
* `refactor:` move api calls to service layer

---

## 7. Resources

1.  **Bulletproof React**
    * *A simple, scalable, and powerful architecture for building production-ready React applications.*
    * [https://github.com/alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react)

2.  **React Docs (Best Practices)**
    * [https://react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)
