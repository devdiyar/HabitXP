package com.habitxp.backend.model;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;
    private String userId;

    @NotBlank
    private String title;
    @NotNull
    private String duration;
    private LocalDate Deadline;
    @Nonnull
    private Integer times; // Anzahl Wiederholungen pro Zeitintervall
    private boolean isCompleted;

    private int rewardXP;
    private int rewardCoins;
    @NotNull
    private Frequency frequency;

    private String spaceId;

    @Builder.Default
    private List<Completion> completions = new ArrayList<>();

    public void edit(String title, String duration, Frequency frequency) {
        this.title = title;
        this.duration = duration;
        this.frequency = frequency;
    }

    public boolean markAsCompleted(User user) {
        LocalDateTime now = LocalDateTime.now();
        int durationMinutes = parseDurationToMinutes(this.duration);

        // Cleanup old completions after 90 Days
        completions = completions.stream()
                .filter(c -> c.getTimestamp().isAfter(now.minusDays(90)))
                .collect(Collectors.toList());

        // Check Time since last completion
        Completion lastCompletion = completions.stream()
                .filter(c -> c.getUserId().equals(user.getId()))
                .reduce((first, second) -> second) // get latest completion
                .orElse(null);

        if (lastCompletion != null) {
            LocalDateTime earliestNext = lastCompletion.getTimestamp().plusMinutes(durationMinutes);
            if (now.isBefore(earliestNext)) {
                return false; // Too soon
            }
        }

        // Add new Completion
        completions.add(Completion.builder()
                .timestamp(now)
                .userId(user.getId())
                .durationMinutes(durationMinutes)
                .build());

        if (isPeriodCompleted()) {
            this.isCompleted = true;
            //Updates
            user.setStreakBroken(false);
        }

        return true;
    }

    public boolean isPeriodCompleted() {
        LocalDate now = LocalDate.now();

        List<Completion> currentPeriodCompletions = completions.stream()
                .filter(c -> isInCurrentPeriod(c.getTimestamp().toLocalDate()))
                .toList();

        return currentPeriodCompletions.size() >= times;
    }

    public int remainingCompletions() {
        if (isCompleted) {
            return 0;
        }

        List<Completion> currentPeriodCompletions = completions.stream()
                .filter(c -> isInCurrentPeriod(c.getTimestamp().toLocalDate()))
                .toList();

        return Math.max(0, times - currentPeriodCompletions.size());
    }

    public void updateCompletionStatus() {
        if (completions.isEmpty()) {
            this.isCompleted = false;
            return;
        }

        Completion lastCompletion = completions.stream()
                .filter(completion -> completion.getUserId() != null)
                .max((completion1, completion2) -> completion1.getTimestamp().compareTo(completion2.getTimestamp()))
                .orElse(null);

        if (lastCompletion == null) {
            this.isCompleted = false;
            return;
        }

        LocalDate lastCompletionDate = lastCompletion.getTimestamp().toLocalDate();
        boolean stillInSamePeriod = isInCurrentPeriod(lastCompletionDate);

        if (!stillInSamePeriod) {
            this.isCompleted = false;
        } else {
            this.isCompleted = isPeriodCompleted();
        }
    }

    private boolean isInCurrentPeriod(LocalDate date) {
        LocalDate now = LocalDate.now();

        switch (frequency) {
            case DAILY:
                return now.isEqual(date);
            case WEEKLY:
                WeekFields weekFields = WeekFields.of(Locale.getDefault());
                return now.get(weekFields.weekOfWeekBasedYear()) == date.get(weekFields.weekOfWeekBasedYear()) && now.getYear() == date.getYear();
            case MONTHLY:
                return now.getMonth() == date.getMonth() && now.getYear() == date.getYear();
            case NONE:
                return true;
            default:
                return false;
        }
    }

    private int parseDurationToMinutes(String duration) {
        try {
            if (duration.endsWith("h")) {
                String numeric = duration.replace("h", "").trim().replace(",", ".");
                double hours = Double.parseDouble(numeric);
                return (int) (hours * 60);
            } else if (duration.endsWith("min")) {
                String numeric = duration.replace("min", "").trim().replace(",", ".");
                double minutes = Double.parseDouble(numeric);
                return (int) minutes;
            } else {
                throw new IllegalArgumentException("Invalid duration format: " + duration);
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number in duration: " + duration, e);
        }
    }


} 
