package com.habitxp.backend.service;

import com.habitxp.backend.dto.UpdateSpaceRequest;
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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SpaceServiceTest {
    @Mock
    private SpaceRepository spaceRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private SpaceService spaceService;

    private Space mockSpace;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockSpace = new Space();
        mockSpace.setId("space123");
        mockSpace.setUserId("user123");
        mockSpace.setColorKey("blue");
        mockSpace.setName("Gesundheit");
    }

    @Test
    void shouldReturnSpacesForUser() {
        when(spaceRepository.findByUserId("user123")).thenReturn(List.of(mockSpace));

        List<Space> result = spaceService.getSpacesByUser("user123");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo("space123");
    }

    @Test
    void shouldCreateSpaceSuccessfully() {
        User mockUser = new User();
        mockUser.setId("user123");

        when(userRepository.findById("user123")).thenReturn(Optional.of(mockUser));
        when(spaceRepository.save(mockSpace)).thenReturn(mockSpace);

        Space result = spaceService.createSpace(mockSpace);

        assertThat(result).isEqualTo(mockSpace);
        verify(spaceRepository).save(mockSpace);
    }

    @Test
    void shouldThrowWhenCreatingSpaceForNonexistentUser() {
        when(userRepository.findById("user123")).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class, () -> spaceService.createSpace(mockSpace));
        assertThat(ex.getReason()).contains("User not found");
    }

    @Test
    void shouldUpdateSpaceColorKey() {
        UpdateSpaceRequest updateRequest = new UpdateSpaceRequest();
        updateRequest.setColorKey("red");

        when(spaceRepository.findById("space123")).thenReturn(Optional.of(mockSpace));
        when(spaceRepository.save(any())).thenReturn(mockSpace);

        Space result = spaceService.updateSpaceColorKey("space123", updateRequest);

        assertThat(result.getColorKey()).isEqualTo("red");
    }

    @Test
    void shouldDeleteSpaceAndItsTasks() {
        Task task1 = new Task();
        task1.setId("task123");

        when(spaceRepository.findById("space123")).thenReturn(Optional.of(mockSpace));
        when(taskRepository.findBySpaceId("space123")).thenReturn(List.of(task1));

        spaceService.deleteSpace("space123");

        verify(taskRepository).deleteAll(List.of(task1));
        verify(spaceRepository).delete(mockSpace);
    }
}