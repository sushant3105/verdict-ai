# Verdict AI

Verdict AI is a **college mini project** that provides AI-assisted legal guidance through a web interface.

Users can describe their case and receive structured legal suggestions generated via the Perplexity API.

## Features

- Case analysis based on user-provided legal context
- Interactive dashboard-style UI
- Case history display in the frontend
- Legal strategy and evidence guidance sections
- Serverless API integration with Perplexity (`/api/ask`)

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend/API:** Node.js serverless function (`api/ask.js`)
- **AI Provider:** Perplexity API

## Project Structure

```text
verdict-ai/
├── api/
│   └── ask.js
├── index.html
├── script.js
├── style.css
└── package.json
```

## Setup & Run

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set environment variable:

   ```bash
   PERPLEXITY_API_KEY=your_api_key
   ```

4. Run locally using Vercel dev server (recommended for `/api` routes):

   ```bash
   npx vercel dev
   ```

5. Open the local URL shown in terminal.

## Environment Variables

- `PERPLEXITY_API_KEY` – required for AI responses from the backend API.

## Collaborators

- **Sushant**
- **Vedant Khare**

## Note

This project is built for educational/demo purposes and does not replace professional legal advice.
