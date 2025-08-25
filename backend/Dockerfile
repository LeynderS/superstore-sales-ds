FROM python:3.12

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "python database/database_creation.py && python database/populate.py && python manage.py runserver 0.0.0.0:8000"]