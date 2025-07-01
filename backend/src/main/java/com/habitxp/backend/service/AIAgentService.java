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
        return askOpenAI(prompt);
    }

    public int calculateCoins(Task task) {
        String prompt = buildPrompt(task, "coins");
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

            Bewerte die folgende Aufgabe im Hinblick auf ihre %s-Belohnung.
            Nutze dabei eine ganzzahlige Skala von 1 (sehr leicht, geringer Wert) bis 100 (sehr schwer, hoher Wert).

            Berücksichtige bei deiner Bewertung:
            - Die geistige oder körperliche Anstrengung der Aufgabe
            - Die geschätzte Zeitdauer (z. B. Minuten oder Stunden)
            - Die Anzahl der Wiederholungen
            - Den möglichen Nutzen für persönliche Entwicklung, Gesundheit oder Produktivität

            Gib **ausschließlich** eine ganze Zahl zwischen 0 und 100 als Antwort zurück.

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


}
