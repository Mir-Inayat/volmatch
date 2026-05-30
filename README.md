# VolMatch (VolUnMatch) — Volunteer-Opportunity Matching Platform

> A full-stack volunteer-opportunity matching platform built with **Django REST Framework** and **scikit-learn**, with a React frontend and JWT authentication.

![Python](https://img.shields.io/badge/Python-0d1117?style=flat-square&logo=python&logoColor=58a6ff)
![Django](https://img.shields.io/badge/Django-0d1117?style=flat-square&logo=django&logoColor=092e20)
![DRF](https://img.shields.io/badge/DRF-0d1117?style=flat-square&logo=django&logoColor=red)
![React](https://img.shields.io/badge/React-0d1117?style=flat-square&logo=react&logoColor=61dafb)
![scikit-learn](https://img.shields.io/badge/scikit--learn-0d1117?style=flat-square&logo=scikitlearn&logoColor=f89939)

---

## What it does

VolMatch connects volunteers with opportunities by matching them on skills, availability, and preferences using a **machine learning recommendation engine** (scikit-learn). Organizations post opportunities; volunteers get ranked suggestions tailored to their profile.

**Community traction:** 2 forks, real deployed platform.

---

## Architecture

```
React Frontend (frontend/)
        ↓  REST API (JWT Auth)
Django REST Framework (volunmatch/api/)
        ↓
  scikit-learn Matching Engine
  (pandas + numpy + scipy for scoring)
        ↓
    SQLite Database
```

---

## Features

- **JWT Authentication** — secure login/signup via `djangorestframework-simplejwt`
- **Volunteer profiles** — skills, availability, location preferences
- **Opportunity listings** — organizations post with requirements and tags
- **ML-powered matching** — scikit-learn scores and ranks volunteers against opportunities
- **REST API** — fully decoupled backend, consumed by React frontend
- **CORS-enabled** — `django-cors-headers` for cross-origin React dev server support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 5.1 + Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` + PyJWT |
| Matching Engine | scikit-learn, pandas, numpy, scipy |
| Database | SQLite (dev) |
| Frontend | React (in `frontend/`) |
| Image handling | Pillow |

---

## Project Structure

```
.
├── frontend/             # React frontend
├── volunmatch/           # Django project root
│   ├── api/              # REST API endpoints, models, serializers
│   ├── volunmatch/       # Django settings, urls, wsgi, asgi
│   ├── manage.py
│   └── requirements.txt
└── README.md
```

---

## Setup

```bash
# Backend
cd volunmatch
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd ../frontend
npm install
npm start
```

---

## Contributing

Pull requests welcome. Fork the repo and open a PR with your changes.
