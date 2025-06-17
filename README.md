# 🧠 Mini Knowledge-Base Assistant

This is a full-stack AI-powered assistant that scrapes cruise destination pages from ShermansTravel, embeds the content using OpenAI, stores them in a Pinecone vector database, and lets users ask questions via a React + Tailwind UI. Chat history is stored in Supabase.

### ✨ Live Demo

> Deployed on Railway: `[https://your-project-name.up.railway.app](https://shermanstravelassistant-production.up.railway.app/)`

---

## 🚀 Features

- `/scrape` endpoint: Scrapes 4 ShermansTravel pages, chunks & embeds them to Pinecone using OpenAI.
- `/chat` endpoint: Accepts a question and returns an answer + sources using RAG from Pinecone.
- `/history` endpoint: Returns the last 50 chat entries stored in Supabase.
- Clean, responsive React UI built with Tailwind CSS & DaisyUI.
- Chat history persists (question, answer, timestamp, sources).

---

## 🧩 Tech Stack

| Layer       | Technology            |
|------------|------------------------|
| Frontend   | React + Tailwind CSS + DaisyUI |
| Backend    | Node.js + Express.js   |
| AI/ML      | OpenAI Embeddings & Chat Completions |
| Vector DB  | Pinecone               |
| Database   | Supabase (PostgreSQL)  |
| Hosting    | Railway                |

---

## 📄 Pages Scraped

- [Alaska Itineraries](https://www.shermanstravel.com/cruise-destinations/alaska-itineraries)
- [Caribbean & Bahamas](https://www.shermanstravel.com/cruise-destinations/caribbean-and-bahamas)
- [Hawaiian Islands](https://www.shermanstravel.com/cruise-destinations/hawaiian-islands)
- [Northern Europe](https://www.shermanstravel.com/cruise-destinations/northern-europe)

---

## 🛠️ Setup & Development

### 1. Clone this Repo

```bash
git clone https://github.com/your-username/mini-knowledge-base.git
cd mini-knowledge-base
