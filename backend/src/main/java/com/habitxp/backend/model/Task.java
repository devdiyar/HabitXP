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
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
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
        cleanOldCompletions(now);

        // Check Time since last completion
        Completion lastCompletion = getLastCompletionForUser(user.getId());

        if (lastCompletion != null && isCooldownStillActive(lastCompletion, now, durationMinutes)) {
            return false;
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

    /* ### HILFSMETHODEN ### */

    private static final Pattern TIME_UNIT_PATTERN = Pattern.compile("^\\d+(min|h)$");
    private static final Pattern NON_TIME_UNIT_PATTERN = Pattern.compile("^\\d+(pcs|m|km|l)$");

    private boolean isNonTimeBasedDuration(String duration) {
        return NON_TIME_UNIT_PATTERN.matcher(duration.toLowerCase()).matches();
    }

    private void cleanOldCompletions(LocalDateTime now) {
        completions = completions.stream()
                .filter(c -> c.getTimestamp().isAfter(now.minusDays(90)))
                .collect(Collectors.toList());
    }

    private Completion getLastCompletionForUser(String userId) {
        return completions.stream()
                .filter(c -> c.getUserId().equals(userId))
                .max(Comparator.comparing(Completion::getTimestamp))
                .orElse(null);
    }

    private boolean isCooldownStillActive(Completion last, LocalDateTime now, int durationMinutes) {
        if (isNonTimeBasedDuration(this.duration)) {
            if (frequency == Frequency.DAILY) {
                return now.isBefore(last.getTimestamp().plusMinutes(1));
            } else {
                return last.getTimestamp().toLocalDate().isEqual(now.toLocalDate());
            }
        } else {
            return now.isBefore(last.getTimestamp().plusMinutes(durationMinutes));
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
        String d = duration.trim().toLowerCase();

        try {
            if (d.endsWith("h")) {
                String numeric = duration.replace("h", "").trim().replace(",", ".");
                double hours = Double.parseDouble(numeric);
                return (int) (hours * 60);
            } else if (d.endsWith("min")) {
                String numeric = duration.replace("min", "").trim().replace(",", ".");
                double minutes = Double.parseDouble(numeric);
                return (int) minutes;
            } else if (isNonTimeBasedDuration(d)) {
                return 1;
            }

            throw new IllegalArgumentException("Invalid duration format: " + duration);

        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number in duration: " + duration, e);
        }
    }
} 
