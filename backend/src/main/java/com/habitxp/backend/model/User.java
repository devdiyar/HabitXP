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
import java.util.ArrayList;


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

    @Builder.Default
    private List<String> spaceIds = new ArrayList<>();
    @Builder.Default
    private List<String> bonusIds = new ArrayList<>();
    
    @Builder.Default
    private List<String> avatars = new ArrayList<>();
    @Builder.Default
    private List<String> banner = new ArrayList<>();

    public void addXP(int baseXP) {
        int gainedXP = baseXP * xpFactor;
        this.xp += gainedXP;

        calculateLevel();
        calculateCurrentXP();
        calculateXPGoal();
    }

    public int calculateLevel() {
        int tempLevel = 0;
        double xpSum = 0;
        while (xp >= xpSum + Math.round(100 * Math.pow(1.2, tempLevel))) {
            xpSum += Math.round(100 * Math.pow(1.2, tempLevel));
            tempLevel++;
        }
        this.level = tempLevel;
        return tempLevel;
    }

    public int calculateCurrentXP() {
        double xpSum = 0;
        for (int i = 0; i < level; i++) {
            xpSum += Math.round(100 * Math.pow(1.2, i));
        }
        return this.currentXP = (int) (xp - xpSum);
    }

    public int calculateXPGoal() {
        this.xpGoal = (int) Math.round(100 * Math.pow(1.2, level));
        return xpGoal;
    }

    public boolean xpFactorReset() {
        if (xpFactorUntil != null && Instant.now().isAfter(xpFactorUntil)) {
            xpFactor = 1;
            xpFactorUntil = null;
            xpBonusActive = false;
            return true;
        }else{
            return false;
        }
    }

    public boolean streakFreezeReset() {
        if (StreakFreezeUntil != null && Instant.now().isAfter(getStreakFreezeUntil())) {
            StreakFreezeActive = false;
            StreakFreezeUntil = null;
            return true;
        }else{
            return false;
        }
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
