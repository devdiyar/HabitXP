package com.habitxp.backend.service;

import com.habitxp.backend.dto.BonusBuyResponse;
import com.habitxp.backend.model.Bonus;
import com.habitxp.backend.model.User;
import com.habitxp.backend.repository.BonusRepository;
import com.habitxp.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class ShopServiceTest {
    @Mock
    private BonusRepository bonusRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ShopService shopService;

    private User mockUser;
    private Bonus mockBonus;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockUser = new User();
        mockUser.setId("user123");
        mockUser.setCoins(110);

        mockBonus = mock(Bonus.class);
        when(mockBonus.getId()).thenReturn("bonus123");
        when(mockBonus.getCost()).thenReturn(100);
    }

    @Test
    void shouldReturnAllBonuses() {
        // Arrange
        when(bonusRepository.findAll()).thenReturn(List.of(mockBonus));

        // Act
        List<Bonus> result = shopService.listBonuses();

        // Assert
        assertThat(result).hasSize(1);
        verify(bonusRepository).findAll();
    }

    @Test
    void shouldSellBonusSuccessfully() {
        // Arrange
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        when(bonusRepository.findById("bonus123")).thenReturn(Optional.of(mockBonus));
        when(mockBonus.isAffordable(110)).thenReturn(true);
        when(mockBonus.applyTo(mockUser)).thenReturn(new BonusBuyResponse(true, false));

        // Act
        BonusBuyResponse result = shopService.sellBonus("user123", "bonus123");

        // Assert
        assertThat(result.isSuccess()).isTrue();
        assertThat(result.isOtherBonusActive()).isFalse();
        assertThat(mockUser.getCoins()).isEqualTo(10);
        verify(userRepository).save(mockUser);
    }

    @Test
    void shouldReturnTooExpensiveIfNotAffordable() {
        // Arrange
        mockUser.setCoins(10); // Zu wenig
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        when(bonusRepository.findById("bonus123")).thenReturn(Optional.of(mockBonus));
        when(mockBonus.getCost()).thenReturn(100);
        when(mockBonus.isAffordable(10)).thenReturn(false);

        // Act
        BonusBuyResponse result = shopService.sellBonus("user123", "bonus123");

        // Assert
        assertThat(result.isSuccess()).isFalse();
        verify(userRepository, never()).save(any());
    }
}