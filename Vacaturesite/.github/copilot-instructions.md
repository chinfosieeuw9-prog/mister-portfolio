# Copilot Instructions for AI Agents

## Project Overview
This project is a job-candidate matching platform for the healthcare sector, combining semantic search, ESCO skills taxonomy, and explainable re-ranking. The architecture is modular and designed for rapid iteration.

## Architecture & Major Components
- **Frontend** (`frontend/`): React app for user/admin dashboards, job search, and feedback. Uses Create React App conventions. Key UI logic in `src/components/`.
- **Backend** (`backend/`): Node.js/Express APIs for matching, admin, and logging. MongoDB (via Mongoose) for data persistence. API endpoints in `backend/api/`.
- **Upload Backend** (`backend/upload-backend/`): Standalone Express service for file uploads (CVs, etc.), using Multer and Ably for real-time updates.
- **Database**: MongoDB for main data, PostgreSQL for ESCO skills/occupations, and Qdrant (or Pinecone) for vector search.

## Data Flow
1. User submits job/candidate data via frontend.
2. Backend normalizes, embeds, and stores data (see `AI-MATCH-README.md`).
3. Vector search and hybrid filtering (skills, compliance, distance) performed in backend.
4. Re-ranking and explainability logic applied before returning results.
5. Logs and admin actions are written to `logs.json`.

## Developer Workflows
- **Frontend**: Use `npm start`, `npm run build`, `npm test` in `frontend/`.
- **Backend**: Start API with `node backend/api/admin.js` or use a process manager. For upload backend: `npm start` in `backend/upload-backend/`.
- **Logs**: View and manage logs via the admin dashboard (`AdminDashboard.jsx`, `AdminLogs.jsx`).
- **Environment**: Configure `.env` files for API keys (Supabase, MongoDB, etc.).

## Project-Specific Patterns
- **API contracts**: See `AI-MATCH-README.md` for example request/response payloads.
- **Logging**: All admin actions and uploads are logged to `logs.json` (see `backend/api/admin.js`).
- **Uploads**: File uploads handled via multipart/form-data and stored in Supabase (see `backend/api/admin.js`).
- **Skills/Matching**: ESCO skills and occupation relations are central; see schema in `AI-MATCH-README.md`.
- **Re-ranking**: Linear model with multiple features (cosine, skills, compliance, etc.).

## Integration Points
- **Supabase**: Used for file storage (CV uploads).
- **Qdrant/Pinecone**: Vector search for semantic matching.
- **Ably**: Real-time updates for uploads.
- **PostgreSQL**: ESCO taxonomy storage.

## Conventions
- Use English for code/comments, Dutch for user/admin-facing text.
- Place new API endpoints in `backend/api/`.
- Use `.env.example` as a template for required environment variables.
- Keep logs in `logs.json` (root or `logs/`).

## References
- See `AI-MATCH-README.md` for architecture, data flow, and API contracts.
- See `frontend/README.md` for React app usage.
- Example admin logic: `backend/api/admin.js`, `frontend/src/components/AdminDashboard.jsx`.

---

If unclear, review `AI-MATCH-README.md` and key backend/frontend files for patterns before implementing new features.
