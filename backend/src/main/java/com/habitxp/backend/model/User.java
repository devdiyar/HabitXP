package com.habitxp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;

    private int maxHealth;
    private int health;
    private int coins;

    private int streak;
    private LocalDate lastStreakUpdate;
    private boolean streakBroken;
    private boolean StreakFreezeActive;
    private Instant StreakFreezeUntil;

    @Builder.Default
    private int xpFactor = 1;
    private Instant xpFactorUntil;
    private boolean xpBonusActive;

    private int level;
    private int xp;
    private int currentXP;
    private int xpGoal;

    private int taskLimit;

    private boolean healthOption;
    private boolean taskLimitOption;

    private List<String> spaceIds;
    private List<String> bonusIds;

    private List<String> avatars;
    private List<String> banner;

    public void addSpace(String spaceId) {
        this.spaceIds.add(spaceId);
    }

    public void removeSpace(String spaceId) {
        this.spaceIds.remove(spaceId);
    }

    public void addXP(int baseXP) {
        int gainedXP = baseXP * xpFactor;
        this.xp += gainedXP;

        int oldLevel = this.level;
        int newLevel = calculateLevel();
        this.level = newLevel;

        calculateCurrentXP();
        calculateXPGoal();

        if (newLevel > oldLevel) {
            levelup();
        }
    }

    public int calculateLevel() {
        int tempLevel = 0;
        double xpSum = 0;
        while (xp >= xpSum + Math.round(100 * Math.pow(1.2, tempLevel))) {
            xpSum += Math.round(100 * Math.pow(1.2, tempLevel));
            tempLevel++;
        }
        return tempLevel;
    }

    public void calculateCurrentXP() {
        double xpSum = 0;
        for (int i = 0; i < level; i++) {
            xpSum += Math.round(100 * Math.pow(1.2, i));
        }
        this.currentXP = (int) (xp - xpSum);
    }

    public void calculateXPGoal() {
        this.xpGoal = (int) Math.round(100 * Math.pow(1.2, level));
    }

    public void xpFactorReset() {
        if (xpFactorUntil != null && Instant.now().isAfter(xpFactorUntil)) {
            xpFactor = 1;
            xpFactorUntil = null;
            xpBonusActive = false;
        }
    }

    public void streakFreezeReset() {
        if (StreakFreezeUntil != null && Instant.now().isAfter(getStreakFreezeUntil())) {
            StreakFreezeActive = false;
            StreakFreezeUntil = null;
        }
    }

    public void levelup() {
        if (this.healthOption) {
            this.maxHealth += 2;
            this.healthOption=false;

        } else if (this.taskLimitOption) {
            taskLimit += 1;
            this.taskLimitOption=false;
        }
        this.health = maxHealth;
    }

    public void coinPenalty() {
        if (coins >= 5) {
            coins -= 5;
        } else {
            coins = 0;
        }
    }

    public void healthpenalty() {
        if (health >= 2) {
            health -= 2;
        } else {
            health = 0;
        }
    }

} 
