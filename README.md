# PathoQC - Pathology Quality Control & Management System

PathoQC is a comprehensive web-based platform designed for medical laboratories to streamline patient sample management, track quality control metrics in real-time, and maintain regulatory documentation with the power of AI.

## 📋 Project Overview

Based on the Product Requirements Document (PRD), this application serves as an MVP (Minimum Viable Product) for a modern Laboratory Information Management System (LIMS). It focuses on reducing documentation errors, improving QC response times, and ensuring compliance through digital tracking.

### Core Value Proposition
*   **Efficiency**: Automated tracking and digital workflows.
*   **Compliance**: Digital SOPs and rigorous Chain of Custody logging.
*   **Intelligence**: Integrated AI for analyzing QC trends and drafting technical documentation.

## ✨ Key Features

### 1. 🩸 Sample Management & Tracking
*   **Digital Accessioning**: Log new patient samples with auto-generated barcodes.
*   **Chain of Custody**: Visual timeline tracking of samples from collection to archiving.
*   **Simulation Tools**: 
    *   **Barcode Scanning**: Simulated QR/Barcode scanner that auto-populates search fields.
    *   **Filtering**: Quick filters for sample status (Collected, Received, Analyzed, etc.).
*   **Detailed Views**: Modal views for patient demographics and specimen history.

### 2. 📈 Quality Control (QC) Dashboard
*   **Levey-Jennings Charts**: Interactive visualization of control data with Mean, ±1SD, ±2SD, and ±3SD reference lines.
*   **Real-time Alerts**: Visual indicators for "Warning" and "Out of Control" states.
*   **AI Trend Analysis**: Integrated **Google Gemini AI** to analyze historical data points, detecting non-random patterns (shifts, drifts) and providing actionable troubleshooting recommendations.

### 3. 📄 Document Control (SOPs)
*   **Repository**: Centralized view of Standard Operating Procedures with version control and status tags (Draft/Approved).
*   **Full Viewer**: Modal support for reading extensive, formatted SOP documents.
*   **AI Drafting Assistant**: 
    *   Uses **Google Gemini AI** to generate compliant SOP drafts based on brief descriptions.
    *   Includes "Quick Start" templates for common procedures (e.g., Biohazard Spills, Critical Value Reporting).

### 4. 📊 Executive Dashboard
*   High-level metrics for samples in process, active alerts, and instrument status.
*   Quick-glance charts for recent performance.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Visualization**: Recharts (for medical-grade plotting)
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Build Tool**: Vite (Implied)

## 🚀 Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-org/pathoqc.git
    cd pathoqc
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    *   Create a `.env` file in the root directory.
    *   Add your Google Gemini API Key (Required for AI features):
        ```
        API_KEY=your_google_api_key_here
        ```

4.  **Run the application**:
    ```bash
    npm start
    ```

## 🧪 Usage Guide

*   **Simulate Scan**: Go to the **Sample Management** tab and click the QR Code icon next to the search bar. It will simulate a scanner input and find a sample.
*   **AI QC Analysis**: Go to the **QC Charts** tab. If the mock data shows variance, click "Analyze Recent Data" to see Gemini's interpretation of the Levey-Jennings pattern.
*   **Draft SOP**: Go to **Documents**, click "Draft with AI", and try one of the example prompts (e.g., "Daily Calibration") to generate a full procedure.

---

**Note**: This is a demonstration application. In a production environment, strict HIPAA compliance, backend authentication, and secure database connections are required.