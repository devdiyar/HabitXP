package com.habitxp.backend.service;

import com.habitxp.backend.model.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AIAgentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final Logger logger = LoggerFactory.getLogger(AIAgentService.class);

    @Value("${openai.api.key}")
    private String apiKey;

    public int calculateXP(Task task) {
        String prompt = buildPrompt(task, "xp");
        if (isLikelyNonsense(task.getTitle())) {
            return 0;
        }
        return askOpenAI(prompt);
    }

    public int calculateCoins(Task task) {
        String prompt = buildPrompt(task, "coins");
        if (isLikelyNonsense(task.getTitle())) {
            return 0;
        }
        return askOpenAI(prompt);
    }

    private int askOpenAI(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(message),
                "temperature", 0.5
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            Map<String, Object> choice = ((List<Map<String, Object>>) response.getBody().get("choices")).get(0);
            Map<String, String> messageResp = (Map<String, String>) choice.get("message");
            String content = messageResp.get("content").replaceAll("[^0-9]", "");

            return Integer.parseInt(content.trim());
        } catch (HttpClientErrorException exception) {
            if (exception.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                logger.warn("OpenAI quota exceeded, assigning default XP/Coins");
                return 10;
            }
            throw exception;
        }
    }

    private String buildPrompt(Task task, String type) {
        return String.format("""
            Du bist ein intelligenter Belohnungsagent in einer Gamification-App.

            Deine Aufgabe ist es, die folgende Benutzer-Aufgabe im Hinblick auf ihre %s-Belohnung zu bewerten.

            Gib **ausschließlich eine ganze Zahl zwischen 0 und 100** zurück – ohne Begründung, ohne Text.

            Verwende eine **exponentielle Belohnungsskala**:
            - Sehr einfache Aufgaben (z. B. „Apfel essen“, „Wasser trinken“) erhalten **5–15 Punkte**
            - Normale Aufgaben (z. B. „30 Min Workout“, „1h lernen“) erhalten **20–40 Punkte**
            - Anspruchsvolle Aufgaben (z. B. „2h lernen“, „intensives Krafttraining“) erhalten **50–70 Punkte**
            - Extrem aufwendige Aufgaben (z. B. „Marathon laufen“, „3h konzentriertes Arbeiten“) erhalten **90–100 Punkte**

            Wichtig:
            - Die Punkte steigen **nicht linear**, sondern **exponentiell** mit dem Aufwand.
            - Falls der Titel sinnlos oder bedeutungslos ist (z. B. „asdf“, „123“, „...“), gib **0** Punkte zurück.
            - Falls du dir **nicht sicher** bist, ob der Titel eine sinnvolle Aufgabe ist, gib **0 Punkte**.


            Berücksichtige:
            - Körperliche oder geistige Anstrengung
            - Zeitaufwand (z. B. Minuten oder Stunden)
            - Anzahl der Wiederholungen pro Tag
            - Beitrag zu persönlicher Entwicklung, Gesundheit oder Produktivität

            Gib **nur** die Zahl zurück – ohne Erklärung.

            --- Aufgabe ---
            Titel: %s
            Dauer: %s
            Wiederholungen pro Tag: %s
            ----------------
            """,
            type,
            task.getTitle(),
            task.getDuration(),
            task.getTimes() != null ? task.getTimes() : "unbekannt"
        );
    }

    private boolean isLikelyNonsense(String title) {
        if (title == null || title.trim().isEmpty()) return true;

        String cleaned = title.replaceAll("[^a-zA-Z]", "").toLowerCase();

        // Sehr kurze Einträge direkt ablehnen
        if (cleaned.length() < 4) return true;

        // Nur 1 „Wort“ ist okay, wenn es ein echtes sein könnte
        if (cleaned.length() >= 8 && countVowels(cleaned) >= 2) return false;

        // Wenn kaum Vokale → vermutlich zufällig
        double vowelRatio = (double) countVowels(cleaned) / cleaned.length();
        if (vowelRatio < 0.25) return true;

        return false;
    }

    private int countVowels(String input) {
        return (int) input.chars()
                .filter(c -> "aeiou".indexOf(c) >= 0)
                .count();
    }
    
}
