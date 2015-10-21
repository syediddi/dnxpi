FROM microsoft/aspnet:1.0.0-beta7

COPY project.json /app/
WORKDIR /app
RUN ["dnu", "restore"]
COPY . /app


EXPOSE 5000
ENTRYPOINT ["dnx", "-p", "project.json", "kestrel"]
