package com.habitxp.backend.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class TaskTest {

    private Task task;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id("user1")
                .build();

        task = Task.builder()
                .title("Test Task")
                .duration("30min")
                .frequency(Frequency.DAILY)
                .times(2)
                .completions(List.of())
                .build();
    }

    @Test
    void shouldMarkTaskAsCompletedSuccessfully() {
        boolean result = task.markAsCompleted(user);
        assertThat(result).isTrue();
        assertThat(task.getCompletions()).hasSize(1);
    }

    @Test
    void shouldNotCompleteTaskIfCooldownActive() {
        task.markAsCompleted(user); // first completion
        boolean secondAttempt = task.markAsCompleted(user); // too soon
        assertThat(secondAttempt).isFalse();
    }

    @Test
    void shouldCalculateRemainingCompletionsCorrectly() {
        task.markAsCompleted(user);
        assertThat(task.remainingCompletions()).isEqualTo(1);
    }

    @Test
    void shouldCompleteWhenAllPeriodsAreMet() {
        task.markAsCompleted(user);
        task.getCompletions().add(
                Completion.builder()
                        .userId("user1")
                        .timestamp(LocalDateTime.now().minusMinutes(31)) // simulate time passed
                        .durationMinutes(30)
                        .build()
        );
        assertThat(task.isPeriodCompleted()).isTrue();
    }

    @Test
    void shouldResetCompletionStatusIfPeriodIsOver() {
        task.setCompletions(List.of(
                Completion.builder()
                        .userId("user1")
                        .timestamp(LocalDateTime.now().minusDays(2))
                        .durationMinutes(30)
                        .build()
        ));
        task.updateCompletionStatus();
        assertThat(task.isCompleted()).isFalse();
    }

    @Test
    void shouldRejectInvalidDuration() {
        try {
            task.setDuration("abc");
            task.markAsCompleted(user);
        } catch (IllegalArgumentException ex) {
            assertThat(ex.getMessage()).contains("Invalid");
        }
    }

    @Test
    void shouldParseHoursCorrectly() {
        Task t = Task.builder()
                .title("Hours")
                .duration("2h")
                .frequency(Frequency.DAILY)
                .times(1)
                .build();
        boolean result = t.markAsCompleted(user);
        assertThat(result).isTrue();
    }

    @Test
    void shouldParsePcsUnitAsNonTimeBased() {
        Task t = Task.builder()
                .title("Units")
                .duration("3pcs")
                .frequency(Frequency.DAILY)
                .times(1)
                .build();
        boolean result = t.markAsCompleted(user);
        assertThat(result).isTrue();
    }
}
