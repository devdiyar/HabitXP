package com.habitxp.backend.model;

import lombok.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Random;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.habitxp.backend.model.User;


@Document(collection = "bonuses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bonus {
    @Id
    private String id;
    private String name;
    private String description;
    private int cost;
    private BonusType type;
    private int duration;

    public boolean isAffordable(int userCoins) {
        return userCoins >= cost;
    }

    public int applyTo(User user) {
        switch (type) {
            case XP_BOOST -> {
                user.setXpFactor(2);
                user.setXpFactorUntil(Instant.now().plus(Duration.ofHours(duration)));
                return 0;
            }
            case RANDOM_COIN -> {
                int reward = new Random().nextInt(191) + 10; // 10–200 Coins
                user.setCoins(user.getCoins() + reward);
                return reward;
            }
            default -> throw new UnsupportedOperationException("Unbekannter Bonustyp: " + type);
        }
    }
    
}