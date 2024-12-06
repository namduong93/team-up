FROM postgres:16

RUN apt-get update && apt-get install -y dos2unix

# COPY ./pg_hba.conf /var/lib/postgresql/data/pg_hba.conf

COPY ./db_entrypoint.sh ./custom-entrypoint.sh
RUN dos2unix ./custom-entrypoint.sh
RUN chmod +x ./custom-entrypoint.sh

EXPOSE 5432

COPY db.sql ./

ENTRYPOINT [ "./custom-entrypoint.sh" ]