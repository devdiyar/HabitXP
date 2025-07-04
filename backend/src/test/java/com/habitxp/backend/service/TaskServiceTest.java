package com.habitxp.backend.service;

import com.habitxp.backend.dto.CompletionResponse;
import com.habitxp.backend.model.Frequency;
import com.habitxp.backend.model.Space;
import com.habitxp.backend.model.Task;
import com.habitxp.backend.model.User;
import com.habitxp.backend.repository.SpaceRepository;
import com.habitxp.backend.repository.TaskRepository;
import com.habitxp.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;


class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SpaceRepository spaceRepository;
    @Mock
    private SpaceService spaceService;
    @Mock
    private AIAgentService aiAgentService;

    @InjectMocks
    private TaskService taskService;

    private Task mockTask;
    private User mockUser;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        Task task = new Task();
        task = new Task();
        task.setId("task123");
        task.setUserId("user123");
        task.setTitle("Sport machen");
        task.setSpaceId("565621325");
        task.setRewardXP(10);
        task.setRewardCoins(5);
        task.setFrequency(Frequency.DAILY);
        task.setDuration("30min");
        task.setCompleted(false);
        task.setTimes(1);

        mockTask = spy(task);

        mockUser = new User();
        mockUser.setId("user123");
        mockUser.setLevel(1);
        mockUser.setCurrentXP(20);
        mockUser.setXpGoal(40);
        mockUser.setCoins(50);
        mockUser.setStreak(0);
        mockUser.setLastStreakUpdate(LocalDate.now().minusDays(1));
        mockUser.setTaskLimit(2);
    }

    // ##### create Task #####
    @Test
    void shouldCreateTaskSuccessfully() {
        // Arrange
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        when(taskRepository.countByUserId("user123")).thenReturn(1L);
        when(aiAgentService.calculateXP(mockTask)).thenReturn(10);
        when(aiAgentService.calculateCoins(mockTask)).thenReturn(5);
        when(taskRepository.save(mockTask)).thenReturn(mockTask);
        when(spaceRepository.findById("Gesundheit")).thenReturn(Optional.of(new Space()));

        mockTask.setSpaceId("Gesundheit");

        // Act
        Task result = taskService.createTask(mockTask);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getRewardXP()).isEqualTo(10);
        assertThat(result.getRewardCoins()).isEqualTo(5);

        verify(taskRepository).save(mockTask);
        verify(spaceRepository).save(any(Space.class));
    }

    @Test
    void shouldThrowWhenTaskLimitReached() {
        // Arrange
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        when(taskRepository.countByUserId("user123")).thenReturn(2L); // max erreicht

        // Act & Assert
        var ex = assertThrows(ResponseStatusException.class, () -> taskService.createTask(mockTask));
        assertThat(ex.getReason()).contains("Task Limit reached");
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        // Arrange
        when(userRepository.findById("user123")).thenReturn(Optional.empty());

        // Act & Assert
        var ex = assertThrows(ResponseStatusException.class, () -> taskService.createTask(mockTask));
        assertThat(ex.getReason()).contains("User not found");
    }

    // ##### update Task #####
    @Test
    void shouldUpdateTaskSuccessfully() {
        // Arrange
        Task updated = new Task();
        updated.setId("task123");
        updated.setTitle("Sport machen");
        updated.setDuration("45min");
        updated.setFrequency(Frequency.WEEKLY);
        updated.setTimes(3);
        updated.setSpaceId("Gesundheit");

        when(taskRepository.findById("task123")).thenReturn(Optional.of(mockTask));
        when(taskRepository.save(any(Task.class))).thenReturn(updated);

        // Act
        Task result = taskService.updateTask(updated);

        // Assert
        assertThat(result.getTitle()).isEqualTo("Sport machen");
        assertThat(result.getDuration()).isEqualTo("45min");
        assertThat(result.getFrequency()).isEqualTo(Frequency.WEEKLY);
        assertThat(result.getTimes()).isEqualTo(3);
        assertThat(result.getSpaceId()).isEqualTo("Gesundheit");
        verify(taskRepository, atLeastOnce()).save(any(Task.class));
    }

    // ##### delete Task #####
    @Test
    void shouldDeleteTaskSuccessfully() {
        // Arrange
        mockTask.setSpaceId("Gesundheit");
        when(taskRepository.findById("task123")).thenReturn(Optional.of(mockTask));
        when(spaceRepository.findById("Gesundheit")).thenReturn(Optional.of(new Space()));

        // Act
        taskService.deleteTask("task123");

        // Assert
        verify(spaceRepository).save(any(Space.class));
        verify(taskRepository).deleteById("task123");
    }

    @Test
    void shouldThrowWhenDeletingNonexistentTask() {
        // Arrange
        when(taskRepository.findById("invalidId")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> taskService.deleteTask("invalidId"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Task not found");
    }

    // ##### complete Task #####
    @Test
    void shouldCompleteTaskAndApplyRewardsSuccessfully() {
        // Arrange
        when(taskRepository.findById("task123")).thenReturn(Optional.of(mockTask));
        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        when(taskRepository.findByUserId("user123")).thenReturn(List.of(mockTask));
        when(taskRepository.save(any())).thenReturn(mockTask);
        when(userRepository.save(any())).thenReturn(mockUser);

        // Simuliere erfolgreiche Aufgabe
        doReturn(true).when(mockTask).markAsCompleted(mockUser);
        doReturn(true).when(mockTask).isPeriodCompleted();
        doReturn(1).when(mockTask).remainingCompletions();

        // Act
        CompletionResponse response = taskService.completeTask("task123", "user123");

        // Assert
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.isCompleted()).isTrue();
        assertThat(response.isLevelup()).isFalse(); // kein Level-Up simuliert
        assertThat(response.getRemaining()).isEqualTo(1);
        assertThat(response.getRewardXP()).isEqualTo(10);
        assertThat(response.getRewardCoins()).isEqualTo(5);

        verify(taskRepository, times(2)).save(mockTask);
        verify(userRepository, times(1)).save(mockUser);
    }

    @Test
    void shouldThrowIfTaskNotFound() {
        when(taskRepository.findById("invalidId")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.completeTask("invalidId", "user123"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Task not found");
    }

    @Test
    void shouldThrowIfUserNotFound() {
        when(taskRepository.findById("task123")).thenReturn(Optional.of(mockTask));
        when(userRepository.findById("user123")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.completeTask("task123", "user123"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("User not found");
    }

    // ##### apply Rewards to User #####
    @Test
    void shouldApplyRewardsToUserCorrectly() {
        // Arrange
        mockTask.setRewardXP(15);
        mockTask.setRewardCoins(20);
        mockTask.setFrequency(Frequency.DAILY);

        when(taskRepository.findByUserId("user123")).thenReturn(List.of(mockTask));
        mockUser.setLastStreakUpdate(LocalDate.now().minusDays(2));
        mockUser.setCoins(50);
        mockUser.setCurrentXP(0);
        mockUser.setStreak(3);

        // Act
        taskService.applyRewardsToUser(mockUser, mockTask);

        // Assert
        assertThat(mockUser.getCoins()).isEqualTo(70);
        assertThat(mockUser.getStreak()).isEqualTo(4);
        assertThat(mockUser.getLastStreakUpdate()).isEqualTo(LocalDate.now());
        verify(userRepository).save(mockUser);
    }

}