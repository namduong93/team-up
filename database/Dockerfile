FROM postgres:16

ENV POSTGRES_PASSWORD=ab
ENV POSTGRES_DB=capstone_db
ENV POSTGRES_USER=postgres

COPY db_entrypoint.sh ./custom-entrypoint.sh
RUN chmod +x ./custom-entrypoint.sh

COPY db.sql ./

ENTRYPOINT [ "./custom-entrypoint.sh" ]
