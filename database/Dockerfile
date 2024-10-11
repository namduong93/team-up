FROM postgres:16

ENV POSTGRES_PASSWORD=ab
ENV POSTGRES_USER=postgres

# The default database will be the production database
ENV POSTGRES_DB=capstone_db

RUN apt-get update && apt-get install -y dos2unix

COPY ./db_entrypoint.sh ./custom-entrypoint.sh
RUN dos2unix ./custom-entrypoint.sh
RUN chmod +x ./custom-entrypoint.sh

# Copy both production and test schema files
COPY db.sql ./db.sql
COPY test_db.sql ./test_db.sql

ENTRYPOINT [ "./custom-entrypoint.sh" ]
