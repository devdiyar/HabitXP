package com.habitxp.backend.model;

import com.habitxp.backend.dto.BonusBuyResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class BonusTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .xpFactor(1)
                .health(15)
                .maxHealth(20)
                .coins(100)
                .xpBonusActive(false)
                .StreakFreezeActive(false)
                .build();
    }

    @Test
    void isAffordable_shouldReturnTrueIfEnoughCoins() {
        Bonus bonus = Bonus.builder().cost(50).build();
        assertThat(bonus.isAffordable(100)).isTrue();
    }

    @Test
    void isAffordable_shouldReturnFalseIfNotEnoughCoins() {
        Bonus bonus = Bonus.builder().cost(150).build();
        assertThat(bonus.isAffordable(100)).isFalse();
    }

    @Test
    void applyTo_shouldApplyXpBoostWhenNotActive() {
        Bonus bonus = Bonus.builder()
                .type(BonusType.XP_BOOST)
                .reward(2)
                .duration(1)
                .build();

        BonusBuyResponse response = bonus.applyTo(user);

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.isOtherBonusActive()).isFalse();
        assertThat(user.getXpFactor()).isEqualTo(2);
        assertThat(user.getXpFactorUntil()).isAfter(Instant.now());
        assertThat(user.isXpBonusActive()).isTrue();
    }

    @Test
    void applyTo_shouldNotApplyXpBoostIfAlreadyActive() {
        user.setXpBonusActive(true);

        Bonus bonus = Bonus.builder()
                .type(BonusType.XP_BOOST)
                .reward(2)
                .duration(1)
                .build();

        BonusBuyResponse response = bonus.applyTo(user);

        assertThat(response.isSuccess()).isFalse();
        assertThat(response.isOtherBonusActive()).isTrue();
    }

    @Test
    void applyTo_shouldHealUser() {
        user.setHealth(10); // Weniger als maxHealth

        Bonus bonus = Bonus.builder()
                .type(BonusType.HEALTH)
                .reward(5)
                .build();

        BonusBuyResponse response = bonus.applyTo(user);

        assertThat(response.isSuccess()).isTrue();
        assertThat(user.getHealth()).isEqualTo(15);
    }

    @Test
    void applyTo_shouldNotOverhealUser() {
        user.setHealth(18);

        Bonus bonus = Bonus.builder()
                .type(BonusType.HEALTH)
                .reward(10)
                .build();

        BonusBuyResponse response = bonus.applyTo(user);

        assertThat(user.getHealth()).isEqualTo(user.getMaxHealth());
        assertThat(response.isSuccess()).isTrue();
    }

    @Test
    void applyTo_shouldApplyStreakFreezeIfNotActive() {
        Bonus bonus = Bonus.builder()
                .type(BonusType.StreakFreeze)
                .duration(2)
                .build();

        BonusBuyResponse response = bonus.applyTo(user);

        assertThat(response.isSuccess()).isTrue();
        assertThat(user.isStreakFreezeActive()).isTrue();
        assertThat(user.getStreakFreezeUntil()).isAfter(Instant.now());
    }

    @Test
    void applyTo_shouldNotApplyStreakFreezeIfAlreadyActive() {
        user.setStreakFreezeActive(true);

        Bonus bonus = Bonus.builder()
                .type(BonusType.StreakFreeze)
                .duration(2)
                .build();

        BonusBuyResponse response = bonus.applyTo(user);

        assertThat(response.isSuccess()).isFalse();
        assertThat(response.isOtherBonusActive()).isTrue();
    }
}