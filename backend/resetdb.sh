#!/bin/dash
psql -c "DROP DATABASE IF EXISTS capstone_db;"
psql -f ../database/db.sql