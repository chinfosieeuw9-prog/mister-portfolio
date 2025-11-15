# AI-Match MVP – Architectuurschema & README

## Overzicht

Dit platform combineert semantische search, ESCO-skills, en uitlegbare re-ranking voor optimale job-candidate matching in de zorg. De stack is direct uitbreidbaar en klaar voor iteratieve verbetering.

---

## Architectuurschema

```
+-------------------+         +-------------------+         +-------------------+
|   Gebruiker/UX    | <-----> |   Backend/API     | <-----> |   Database/Vector |
+-------------------+         +-------------------+         +-------------------+
        |                           |                                 |
        | 1. Parse & Normaliseer    |                                 |
        +-------------------------> |                                 |
        |                           | 2. Embedding (sentence-tf)      |
        |                           +-------------------------------> |
        |                           | 3. Vector Search (Qdrant)       |
        |                           +-------------------------------> |
        |                           | 4. Hybrid Filter (BIG, ESCO)    |
        |                           +-------------------------------> |
        |                           | 5. Re-rank & Explain            |
        | <-------------------------+                                 |
        | 6. Toon fit + uitleg      |                                 |
        +-------------------------> |                                 |
```

---

## Stack & Componenten

- **Frontend/UX**: React (fit-score, uitleg, feedback)
- **Backend/API**: Node.js/Express of Python/FastAPI
- **Embeddings**: `sentence-transformers/all-mpnet-base-v2` of `intfloat/multilingual-e5-base`
- **Vector DB**: Qdrant (on-prem/hybride) of Pinecone (serverless)
- **Skills-taxonomie**: ESCO (occupations, skills, occupationSkillRelations in PostgreSQL)
- **Parsing**: spaCy pipeline + patterns/regex voor zorgentiteiten
- **Re-ranking**: Lineair model met features (cosine, skills-overlap, must-have, compliance, afstand, uren)
- **Explainability**: LLM of template-uitleg per match
- **Evaluatie**: NDCG@k, precision@k, eigen benchmarkset

---

## Database-schema (PostgreSQL)

```sql
CREATE TABLE esco_skills (
  id VARCHAR PRIMARY KEY,         -- ESCO skill URI
  preferred_label TEXT,
  alt_labels TEXT[],
  description TEXT
);

CREATE TABLE esco_occupations (
  id VARCHAR PRIMARY KEY,         -- ESCO occupation URI
  preferred_label TEXT,
  alt_labels TEXT[],
  description TEXT
);

CREATE TABLE occupation_skill_relations (
  occupation_id VARCHAR,          -- FK naar esco_occupations
  skill_id VARCHAR,               -- FK naar esco_skills
  relation_type TEXT,             -- 'essential'/'optional'
  PRIMARY KEY (occupation_id, skill_id)
);
```

---

## API-contracten (voorbeeld)

### /api/match/vacature

- **POST**: `{ vacature: {...}, top_k: 10 }`
- **Response**:

```json
[
  {
    "kandidaat_id": "123",
    "score": 0.87,
    "explanation": "+ ADL, + wijkzorg, - medicatiebevoegdheid",
    "gaps": ["medicatiebevoegdheid"],
    "skills_matched": ["wijkzorg", "ADL"],
    "skills_missing": ["medicatiebevoegdheid"]
  }
]
```

### /api/skills/normalize

- **POST**: `{ "text": "tillift" }`
- **Response**: `{ "esco_skill_id": "esco:skill:12345", "preferred_label": "Transferhulpmiddelen" }`

---

## Matching & Re-rank features

| Feature              | Type      | Beschrijving                           |
| -------------------- | --------- | -------------------------------------- |
| cosine_similarity    | float     | Embedding match vacature-profiel       |
| skills_overlap       | int/float | ESCO skills overlap (must/should/nice) |
| must_have_coverage   | bool/int  | Alle must-haves aanwezig?              |
| compliance_flags     | bool/int  | BIG/VOG aanwezig?                      |
| location_distance_km | float     | Afstand in km                          |
| hours_overlap        | int/float | Uren/diensten match                    |

**Score:**

```
score = α * cosine + β * skills_overlap + γ * must_have + δ * compliance + ε * (1 - dist/100) + ζ * hours_overlap
```

---

## Evaluatie

- **Benchmarkset**: queries + relevante jobs (handmatig gelabeld)
- **Metrics**: NDCG@k, precision@k
- **Script (Python, sklearn):**

```python
from sklearn.metrics import ndcg_score
ndcg_score([y_true], [y_score], k=5)
```

---

## Iteratie & Feedback

- Verzamel recruiterfeedback (relevant/niet, sliders)
- Gebruik feedback als trainingssignaal voor re-rank gewichten
- Tune op basis van outcomes (plaatsing/interview)

---

**Deze basis is direct inzetbaar voor een MVP en eenvoudig uit te breiden met meer features, LLM-uitleg, en personalisatie.**
