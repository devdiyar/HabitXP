Dieses Readme ist Teil der App **"HabitXP"**, einer Habit-Tracking-Anwendung mit Gaming Mechanismen.
<img width="1716" height="1200" alt="Thumbnail" src="https://github.com/user-attachments/assets/617d236d-2d93-4486-944d-d9940f479c5a" />

## Team

Members:
[Dustin](https://www.github.com/),
[Yassine](https://www.github.com/),
[Diyar](https://github.com/devdiyar),
[Kathrin](https://www.github.com/kathrinple)

## Quickstart

### Backend

Go to the project directory

```bash, ignore
  cd backend
```

Start the server

```bash, ignore
  ./mvnw spring-boot:run
```

⚠️ MongoDB muss im Hintergrund laufen

### Frontend

Go to the project directory

```bash, ignore
  cd mobile
```

Start Expo

```bash, ignore
  npx expo start
  
  ODER
  
  npm run web
```

## Prerequisites

Operating System: Windows

- Java 17+
- Maven
- MongoDB lokal installiert (läuft auf `mongodb://localhost:27017`)

## Installation and Setup

1. Clone the repository:

```bash,ignore
$ git clone https://github.com/diyardev001/HabitXP.git
```

2. Navigate to the project directory:

```bash,ignore
$ cd HabitXP
```

3. Adjust configuration files:

Modify configuration files (e.g., `.env`, `application.properties`) as required.

---

## API Dokumentation

Für die API-Dokumentation und einfaches Testen verwenden wir **Swagger-UI**.

- **Swagger-UI URL**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

**Hinweis**:

- Die API erfordert ansonsten Authentifizierung via JWT.

Mit Swagger kannst du:

- Alle verfügbaren Endpoints einsehen
- API Requests direkt im Browser testen
- Beispiel-Request- und Response-Bodies sehen

---

## Authentifizierung

Für geschützte Endpunkte ist ein **JWT Token** erforderlich. Hole dir ein Token über den `/auth/login` Endpoint.

## Projektstruktur

### Backend

Die Backend-Struktur basiert auf einem typischen Spring Boot Setup mit klarer Trennung von Verantwortlichkeiten:

```bash,ignore
backend/
├── .mvn/                     # Maven Wrapper Dateien
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.habitxp.backend/
│   │   │       ├── controller/       # REST Controller (Auth, User)
│   │   │       ├── dto/              # Daten-Transfer-Objekte (LoginRequest, RegisterRequest, AuthResponse)
│   │   │       ├── model/            # Datenmodelle (z.B. User)
│   │   │       ├── repository/       # JPA/Mongo Repositories
│   │   │       ├── security/         # JWT Konfiguration & Filter
│   │   │       ├── service/          # Business-Logik (z.B. AuthService)
│   │   │       └── BackendApplication.java  # Main-Klasse
│   │   └── resources/
│   │       ├── static/               # Statische Ressourcen (z.B. Bilder, JS)
│   │       ├── templates/            # (optional) HTML-Templates
│   │       └── application.properties # Konfigurationsdatei
│
├── test/                  # Testklassen
├── mvnw / mvnw.cmd        # Maven Wrapper
├── .gitignore
├── README.md
└── HELP.md
```

### Mobile (Frontend)

Das mobile Frontend basiert auf Expo und folgt einer modularen Projektstruktur:

```bash,ignore
mobile/
├── .expo/                   # Expo spezifische Cache-Daten
├── app/                     # App Entry-Point und Routing
│   ├── (tabs)/              # Tab-Navigation
│   │   ├── _layout.tsx      # Hauptlayout für Tabs
│   │   └── index.tsx        # Startseite (z.B. Dashboard)
│
├── assets/                  # Bilder, Fonts, etc.
├── components/              # Wiederverwendbare UI-Komponenten
├── node_modules/            # Abhängigkeiten
├── app.json                 # Expo Konfiguration
├── expo-env.d.ts            # TypeScript Setup für Expo-Module
├── package.json             # Projektabhängigkeiten & Skripte
├── tsconfig.json            # TypeScript Konfiguration
├── .gitignore
└── README.md
```
