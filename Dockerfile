FROM node:22-alpine AS web
WORKDIR /web
COPY src/frontend/package*.json ./
RUN npm ci
COPY src/frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY pyproject.toml requirements.lock.txt ./
COPY src/backend/ ./src/backend/
RUN pip install --no-cache-dir -e .
COPY alembic.ini ./
COPY fixtures/ ./fixtures/
COPY --from=web /web/dist ./src/frontend/dist/
RUN useradd --uid 10001 --create-home labtrack && mkdir -p /app/.local && chown -R labtrack:labtrack /app
USER labtrack
EXPOSE 8000
HEALTHCHECK CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')"
CMD ["uvicorn", "labtrack.api:app", "--host", "0.0.0.0", "--port", "8000"]
