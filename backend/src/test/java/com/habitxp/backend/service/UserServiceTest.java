package com.habitxp.backend.service;

import com.habitxp.backend.dto.UserProfileResponse;
import com.habitxp.backend.model.Space;
import com.habitxp.backend.model.User;
import com.habitxp.backend.repository.TaskRepository;
import com.habitxp.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private UserService userService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = new User();
        mockUser.setId("user123");
        mockUser.setUsername("tester");
        mockUser.setLevel(2);
        mockUser.setHealth(25);
        mockUser.setMaxHealth(25);
        mockUser.setCurrentXP(30);
        mockUser.setXpGoal(40);
        mockUser.setXpFactor(1);
        mockUser.setXpBonusActive(false);
        mockUser.setCoins(200);
        mockUser.setStreak(3);
        mockUser.setTaskLimit(5);
    }

    @Test
    void shouldReturnUserById() {
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        User result = userService.getUserById("user123");
        assertThat(result).isEqualTo(mockUser);
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(userRepository.findById("user123")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> userService.getUserById("user123"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void shouldReturnUserFromSpace() {
        Space space = new Space();
        space.setUserId("user123");
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        Optional<User> result = userService.getUserFromSpace(space);
        assertThat(result).contains(mockUser);
    }

    @Test
    void shouldCreateUser() {
        when(userRepository.save(mockUser)).thenReturn(mockUser);
        User result = userService.createUser(mockUser);
        assertThat(result).isEqualTo(mockUser);
    }

    @Test
    void shouldUpdateUser() {
        when(userRepository.save(mockUser)).thenReturn(mockUser);
        User result = userService.updateUser(mockUser);
        assertThat(result).isEqualTo(mockUser);
    }

    @Test
    void shouldDeleteUser() {
        userService.deleteUser("user123");
        verify(userRepository).deleteById("user123");
    }

    @Test
    void shouldReturnIfEmailExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        boolean result = userService.existsByEmail("test@example.com");
        assertThat(result).isTrue();
    }

    @Test
    void shouldLevelUpHealth() {
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        userService.levelUp("user123", "HEALTH");
        verify(userRepository).save(mockUser);
        assertThat(mockUser.getMaxHealth()).isEqualTo(27);
        assertThat(mockUser.getHealth()).isEqualTo(27);
    }

    @Test
    void shouldLevelUpTaskLimit() {
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        userService.levelUp("user123", "TASK_LIMIT");
        verify(userRepository).save(mockUser);
        assertThat(mockUser.getTaskLimit()).isEqualTo(6);
    }

    @Test
    void shouldThrowForInvalidLevelUpChoice() {
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        assertThatThrownBy(() -> userService.levelUp("user123", "INVALID"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ungültige Auswahl");
    }

    @Test
    void shouldReturnUserProfile() {
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        when(taskRepository.countByUserId("user123")).thenReturn(4L);
        UserProfileResponse response = userService.getUserProfile("user123");

        assertThat(response.getUsername()).isEqualTo("tester");
        assertThat(response.getHealth()).isEqualTo(25);
        assertThat(response.getCurrentTasks()).isEqualTo(4);
    }
}
