package com.habitxp.backend.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .xp(0)
                .coins(10)
                .health(10)
                .xpFactor(2)
                .build();
    }

    @Test
    void shouldAddXPWithFactorAndUpdateLeveling() {
        user.addXP(10); // 10 * 2 = 20 XP

        assertThat(user.getXp()).isEqualTo(20);
        assertThat(user.getLevel()).isEqualTo(1); // Level 1 erreicht
        assertThat(user.getCurrentXP()).isEqualTo(0);
        assertThat(user.getXpGoal()).isEqualTo((int) Math.round(20 * Math.pow(1.2, 1)));
    }

    @Test
    void shouldResetXPFactorIfExpired() {
        user.setXpFactorUntil(Instant.now().minusSeconds(60));
        user.setXpBonusActive(true);

        boolean result = user.xpFactorReset();

        assertThat(result).isTrue();
        assertThat(user.getXpFactor()).isEqualTo(1);
        assertThat(user.getXpFactorUntil()).isNull();
        assertThat(user.isXpBonusActive()).isFalse();
    }

    @Test
    void shouldNotResetXPFactorIfStillValid() {
        user.setXpFactorUntil(Instant.now().plusSeconds(3600));
        user.setXpBonusActive(true);

        boolean result = user.xpFactorReset();

        assertThat(result).isFalse();
        assertThat(user.getXpFactor()).isEqualTo(2);
    }

    @Test
    void shouldResetStreakFreezeIfExpired() {
        user.setStreakFreezeUntil(Instant.now().minusSeconds(60));
        user.setStreakFreezeActive(true);

        boolean result = user.streakFreezeReset();

        assertThat(result).isTrue();
        assertThat(user.isStreakFreezeActive()).isFalse();
        assertThat(user.getStreakFreezeUntil()).isNull();
    }

    @Test
    void shouldNotResetStreakFreezeIfStillActive() {
        user.setStreakFreezeUntil(Instant.now().plusSeconds(3600));
        user.setStreakFreezeActive(true);

        boolean result = user.streakFreezeReset();

        assertThat(result).isFalse();
        assertThat(user.isStreakFreezeActive()).isTrue();
    }

    @Test
    void shouldApplyCoinPenalty() {
        user.setCoins(7);
        user.coinPenalty();
        assertThat(user.getCoins()).isEqualTo(2);

        user.coinPenalty();
        assertThat(user.getCoins()).isEqualTo(0);
    }

    @Test
    void shouldApplyHealthPenalty() {
        user.setHealth(3);
        user.healthpenalty();
        assertThat(user.getHealth()).isEqualTo(1);

        user.healthpenalty();
        assertThat(user.getHealth()).isEqualTo(0);
    }
}
