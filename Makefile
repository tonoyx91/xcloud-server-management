# Quick helpers (optional)
.PHONY: up seed logs down rebuild

up:
\tdocker compose up -d --build

seed:
\t# run one-off seeding (admin/admin123 by default)
\tdocker compose run --rm --profile seed seed

logs:
\tdocker compose logs -f --tail=200

down:
\tdocker compose down

rebuild:
\tdocker compose build --no-cache
