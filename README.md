# WDM - InnerView
This is a full-stack web application designed to predict user answers and generate a deep personality summary. It achieves this by analyzing traditional quiz responses alongside unique behavioral microdata (decision time, hover duration, and changes of mind) using Ollama Large Language Model (LLM) in the backend.

## Technology stack
| Component | Technology | Specifics & Role |
| :--- | :--- | :--- |
| **AI/LLM** | **Ollama** (e.g., Llama3.2) | Local LLM for prediction and summary generation. |
| **Backend (API)** | **Node.js (Express)** | Server logic, API routing, **`cookie-parser`**, and communication with Ollama. Uses **`nodemon`** for development. |
| **Database** | **MongoDB** | Stores questions, answers, and all granular behavioral data using the **`mongodb`** driver. |
| **Frontend (Client)** | **React (v19)**, **Vite** | User interface and client-side tracking of micro-interactions. **Vite** is used for fast development and bundling. |
| **Tooling** | **Docker & Docker Compose** | Arrange all services (App, DB, Ollama proxy) for easy local development. |
| **Security/Auth** | **`bcrypt`**, **`express-session`** | Used for user authentication (hashing) and session management. |

---

## Up and Running

To run this project, follow these steps

1. Clone repository
```sh
    git clone https://github.com/EHB-MCT/wdm-Sam-Hoeterickx.git
```

2. ENV configurtion
```sh
    # Database connection string
    DB_URI: mongodb+srv://<username>:<password>@web2.iejxy.mongodb.net/?retryWrites=true&w=majority&appName=Web2
```

3. Build docker-compose
```sh
    docker-compose up --build
```

## Where to get help?

If you encounter issues or have questions regarding this project:

* Open an Issue: Submit a detailed bug report or feature request via the GitHub Issues page.

* Contact the Author: For urgent questions or specific project details, refer to the contact information in the Authors section below.