# --- Compilation ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# --- Exécution ---
FROM eclipse-temurin:17-jre
WORKDIR /app
# Utilisateur sans privilèges ; le dossier des fichiers envoyés lui appartient
RUN useradd --system --uid 1001 oseor && mkdir -p /app/uploads && chown oseor /app/uploads
COPY --from=build /app/target/*.jar /app/app.jar
USER oseor
ENV SERVER_PORT=8080 \
    UPLOAD_DIR=/app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
