# Final stage
FROM eclipse-temurin:20-jre-alpine
WORKDIR /app
EXPOSE 8080
COPY /target/api-0.0.1-SNAPSHOT.jar .
CMD ["java", "-jar", "api-0.0.1-SNAPSHOT.jar"]
