# ---- Build stage ----
FROM eclipse-temurin:25-alpine AS builder
RUN apk add --no-cache dos2unix
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn ./.mvn
RUN chmod +x mvnw && dos2unix mvnw && ./mvnw dependency:resolve -DskipTests
COPY src ./src
RUN ./mvnw package -DskipTests

# ---- Runtime stage (smallest JRE image for Java 25) ----
FROM eclipse-temurin:25-jre-ubi10-minimal
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
