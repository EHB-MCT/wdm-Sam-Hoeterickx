# WDM

![License](https://img.shields.io/github/license/EHB-MCT/wdm-Sam-Hoeterickx)
![Node](https://img.shields.io/badge/Node.js-v18%2B-green)
![React](https://img.shields.io/badge/React-v19-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

**WDM** is a full-stack web application designed to capture and analyze user behavior during personality quizzes. Beyond standard answers, it records granular **behavioral microdata**—including decision latency, hover duration, and "change of mind" events—providing a rich dataset for psychological analysis and behavioral research.

## 🚀 Features

* **Behavioral Tracking**: Real-time monitoring of micro-interactions like mouse hovers and hesitation times.
* **Granular Data Collection**: Stores detailed logs of every interaction (clicks, changes) alongside quiz answers.
* **Full-Stack Architecture**: Modern React frontend connected to a robust Node.js/Express backend.
* **Containerized**: Fully Dockerized environment for easy deployment of Client, Server, and Database.

## 🛠️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite | UI and client-side tracking of micro-interactions |
| **Backend** | Node.js, Express | API routing and session management |
| **Database** | MongoDB | Storage for questions, answers, and behavioral logs |
| **Infra** | Docker | Container orchestration |

## 🏁 Getting Started

### Prerequisites
* Docker & Docker Compose
* Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/EHB-MCT/wdm-Sam-Hoeterickx.git](https://github.com/EHB-MCT/wdm-Sam-Hoeterickx.git)
    cd wdm-Sam-Hoeterickx
    ```

2.  **Environment Configuration**
    Create a `.env` file in the root (or server directory) and configure your database credentials:
    ```env
        # Server Configuration
        PORT=3000

        # Database Configuration
        MONGO_URI=mongodb://localhost:27017/Development-V-WDM
        DB_URI=mongodb://localhost:27017/Development-V-WDM
        DB_NAME=Development-V-WDM

        # MongoDB Docker Configuration
        MONGO_INITDB_ROOT_USERNAME=username
        MONGO_INITDB_ROOT_PASSWORD=password
        MONGO_INITDB_DATABASE=wdm_database

        # Session and Cookie Security
        SESSION_SECRET=your-secret
        COOKIE_SECRET=your-secret

        # Development Configuration
        CHOKIDAR_USEPOLLING=true

        # Client Configuration
        VITE_API_URL=http://localhost:3000/api
    ```

3.  **Run with Docker**
    ```bash
    docker-compose up --build
    ```
    * Frontend: `http://localhost:8080`
    * Backend: `http://localhost:3000`

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## ✍️ Author

**Sam Hoeterickx**
* Email: sam.hoeterickx@student.ehb.be
* [LinkedIn](https://www.linkedin.com/in/sam-hoeterickx/)