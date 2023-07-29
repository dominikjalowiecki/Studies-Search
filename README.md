[![Preview project](https://img.shields.io/static/v1?label=Django&message=Preview&color=green&style=flat&logo=Django)][preview]

# Studies-Search

Web application for searching and reviewing schools. [Click here to preview.][preview]

Project's OpenAPI schema available on path "/static/openapi.json". <br/>

[Link to API documentation.](https://djalowiecki.toadres.pl/studies-search/api/static/api_documentation.html)<br/>
[Link to Swagger UI.](https://djalowiecki.toadres.pl/studies-search/api/static/swagger/index.html)

- [] Application uses Continuous Delivery solution built upon GitHub Actions and GitHub Container Registry.

[preview]: https://djalowiecki.toadres.pl/studies-search/

### Table of content

- [Technologies](#technologies)
- [Features](#features)
- [Setup](#setup)
- [Projects hosting infrastructure](#projects-hosting-infrastructure)

---

### Technologies

- Django
- Django REST Framework
- PostgreSQL
- Google Drive API
- Google Gmail SMTP
- React
- Chakra UI
- SWR
- Sentry
- Docker

---

### Features

- [x] User login
- [x] User registration
- [x] Email account activation
- [x] Token based authentication
- [x] Login endpoint throttling (max 5 req./min)
- [x] Local-memory caching strategy on faculties list and retrieve endpoints
- [x] User password reset and change
- [x] Filtering and searching faculties
- [x] Moderator privileges
- [x] Moderator can add new faculty
- [x] Moderator can update faculties
- [x] Commenting faculties
- [x] Client side generation of PDF

---

### Setup

#### Clone repository

```bash
git clone https://github.com/dominikjalowiecki/Studies-Search.git
```

#### Change directory

```bash
cd ./Studies-Search
```

#### Setup .env file

```
SECRET_KEY=secret_key
DEBUG=True
```

#### Install pipenv

```bash
pip install --user pipenv
```

#### Install dependencies

```bash
pipenv sync --dev
cd ./frontend
npm ci
```

#### Make migrations

```bash
cd ..
pipenv run migrate
```

#### Run development environment

```bash
pipenv run run
```

### OR

#### Run docker-compose "production" environment

Requires additional SMTP and Google Drive API key setup.

```bash
docker compose up -d
```

Application available on http://localhost:80 for frontend and http://localhost:8000 for backend.

---

### Projects hosting infrastructure

![Projects hosting infrastructure](/images/vps_infrastructure.drawio.png)
