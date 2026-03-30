# AI Haircare Advisor - Dermatics India

A premium, AI-powered hair and scalp analysis platform designed for **Dermatics India**. This application provides personalized haircare routines based on visual analysis, user history, and hair goals.

## 🌟 Key Features

*   **AI Scalp & Hair Analysis**: Real-time analysis of hair loss stages (Stage 1-6) and scalp conditions using Google Gemini AI.
*   **Personalized Routines**: Tailored AM/PM haircare plans featuring specific Dermatics India products.
*   **AI Chat Assistant**: A persistent AI chatbot that remembers your analysis and provides real-time follow-up advice with full markdown support.
*   **Robust Data Persistence**: Complete session data, including chat history and analysis results, is synchronized with a MongoDB backend.
*   **Intelligent User Management**: 
    - Prevents duplicate registrations using strict Email and Phone verification.
    - Matches returning users to their existing consultation history.
    - Enforced name-matching for data security.
*   **Doctor Report Generation**: Professional PDF reports summarizing analysis findings and recommended treatments.

## 🛠️ Tech Stack

*   **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express, MongoDB.
*   **AI Engine**: Google Gemini AI (`@google/genai`).
*   **Utilities**: `html2canvas`, `jsPDF` for report generation.

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18 or higher)
*   **MongoDB** (Local or Atlas instance)
*   **Gemini API Key** (from Google AI Studio)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/tyageshdarmatics/AI-Haircare-Advisor.git
    cd ai-haircare-advisor
    ```

2.  **Install dependencies**:
    ```bash
    # Install root dependencies (concurrently, types, etc.)
    npm install

    # Install server dependencies
    cd server
    npm install
    cd ..
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    ```

### Running the Application

This project uses `concurrently` to start both the Vite frontend and Express backend with a single command:

```bash
npm run dev
```

*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

*   `/components`: Core React components and step-by-step questionnaire.
*   `/server`: Express backend logic and MongoDB integration.
*   `/public`: Static assets including favicons and product images.
*   `App.tsx`: Main application state and routing logic.
*   `types.ts`: TypeScript interfaces for the data models.

## 🔒 Security & Validation

*   **Age Validation**: Strict 1-100 age range enforced on both client and server.
*   **Duplicate Prevention**: Prevents multiple records for the same email or phone number.
*   **Data Integrity**: Ensures the name matches exactly for existing users to prevent record mismatch.

---
Developed for **Dermatics India**.
