package com.habitxp.backend.service;

import com.habitxp.backend.model.Space;
import com.habitxp.backend.model.Task;
import com.habitxp.backend.repository.SpaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private SpaceRepository spaceRepository;

    @Value("${openai.api.key}")
    private String apiKey;

    public int calculateXP(Task task) {
        Space space = spaceRepository.findById(task.getSpaceId()).orElse(null);
        String prompt = buildPromptForXP(task, space);
        return askOpenAI(prompt);
    }

    public int calculateCoins(Task task) {
        Space space = spaceRepository.findById(task.getSpaceId()).orElse(null);
        String prompt = buildPromptForCoins(task, space);
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

    private String buildPromptForXP(Task task, Space space) {
        String spaceName = space != null ? space.getName() : "Unbekannt";

        return String.format("""
                        Du bist ein intelligenter Belohnungsagent in einer Gamification-App.
                        
                        Deine Aufgabe: Bewerte den folgenden Task im Hinblick auf seine **Erfahrungswert (XP)**.
                        Gib **nur eine ganze Zahl von 1 bis 20** zurück.
                        
                        ### Wichtige Anweisung:
                        Wenn der Titel der Aufgabe unsinnig oder unverständlich ist – z.B. eine zufällige Buchstabenfolge wie „asdf“, „gdsfgsdf“ oder „xyz123“ – dann ist die Aufgabe **nicht bewertbar** und soll **immer mit 1** bewertet werden, egal wie oft sie wiederholt wird oder wie lange sie dauert.
                        
                        ### Kriterien für XP:
                        - Körperliche oder geistige **Anstrengung**
                        - **Dauer** oder **Menge** (z.B. Minuten, Kilometer, Liter)
                        - Anzahl der **Wiederholungen** pro Woche oder Tag
                        - **Sinnhaftigkeit** für persönliche Entwicklung, Fokus, Disziplin
                        - Kontext (Kategorie / Space): z.B. Gesundheit, Bildung, Sport
                        
                        ### Beispiele:
                        - „Zähneputzen 2x täglich, 3 Minuten“ (Gesundheit) → 2
                        - „100m Bahnen schwimmen, 3x wöchentlich“ (Sport) → 14
                        - „15 Minuten meditieren täglich“ (Achtsamkeit) → 7
                        - „2h Bewerbung schreiben, 1x“ (Arbeit) → 12
                        - „asdfgh“ → 1
                        - "Marathontraining, 2Std, 1x täglich" (Sport) -> 20
                        
                        ### Task:
                        Titel: %s
                        Dauer / Menge: %s
                        Wiederholungen pro Woche/Tag: %s
                        Kategorie (Space): %s
                        
                        Gib nur eine ganze Zahl von 1 bis 20 zurück. Keine weiteren Erklärungen.
                        """,
                task.getTitle(),
                task.getDuration(),
                task.getTimes(),
                spaceName
        );
    }

    private String buildPromptForCoins(Task task, Space space) {
        String spaceName = space != null ? space.getName() : "Unbekannt";

        return String.format("""
                        Du bist ein intelligenter Belohnungsagent in einer Gamification-App.
                        
                        Deine Aufgabe: Bewerte den folgenden Task im Hinblick auf seine **Münzbelohnung (Coins)**.
                        Gib **nur eine ganze Zahl von 1 bis 20** zurück.
                        
                        ### Wichtige Anweisung:
                        Wenn der Titel der Aufgabe unsinnig oder unverständlich ist – z.B. eine zufällige Buchstabenfolge wie „asdf“, „gdsfgsdf“ oder „xyz123“ – dann ist die Aufgabe **nicht bewertbar** und soll **immer mit 1** bewertet werden, egal wie oft sie wiederholt wird oder wie lange sie dauert.
                        
                        ### Kriterien für Coins:
                        - Ist die Aufgabe regelmäßig **wiederholbar**?
                        - Unterstützt sie eine **gute Gewohnheit** im Alltag?
                        - Ist sie kurz, motivierend, leicht umsetzbar?
                        - Kontext (Kategorie / Space): z.B. Haushalt, Fitness, Fokus
                        
                        ### Beispiele:
                        - „Wasser trinken (1 Liter), 2x täglich“ (Gesundheit) → 7
                        - „100m Bahnen schwimmen, 3x wöchentlich“ (Sport) → 10
                        - „Tisch aufräumen, 1x täglich“ (Haushalt) → 6
                        - „asdfgh“ → 1
                        - „15 Minuten Yoga“ (Fitness) → 8
                        - "Marathontraining, 2Std, 1x täglich" (Sport) -> 20
                        
                        ### Task:
                        Titel: %s
                        Dauer / Menge: %s
                        Wiederholungen pro Woche/Tag: %s
                        Kategorie (Space): %s
                        
                        Gib nur eine ganze Zahl von 1 bis 20 zurück. Keine weiteren Erklärungen.
                        """,
                task.getTitle(),
                task.getDuration(),
                task.getTimes(),
                spaceName
        );
    }

    /*private String buildPrompt(Task task, String type) {
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
    }*/
}
