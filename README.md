# 🩼 ankle

[![Node.js CI](https://github.com/wajeht/ankle/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/wajeht/ankle/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/wajeht/ip/blob/main/LICENSE) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/wajeht/ankle)

my broken ankle journey

# 💻 Development

Clone the repository

```bash
$ git clone https://github.com/wajeht/ankle.git
```

Copy `.env.example` to `.env`

```bash
$ cp .env.example .env
```

Start the project with docker

```bash
$ docker compose up
```

Test the application

```bash
$ docker compose exec ankle npm run test
```

Lint the application

```bash
$ docker compose exec ankle npm run lint
```

Format the application

```bash
$ docker compose exec ankle npm run format
```

Check `Makefile` for more easy commands.

# 📜 License

Distributed under the MIT License © wajeht. See [LICENSE](./LICENSE) for more information.
