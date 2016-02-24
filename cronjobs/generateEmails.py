import mandrill
import os
import psycopg2
import urlparse

# Connect to database
urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(os.environ["DATABASE_URL"])

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

# Connect to mandrill
mandrill_client = mandrill.Mandrill('hZ0uqN6TtFEI4v6v7J35iA')