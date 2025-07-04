package com.habitxp.backend.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SpaceTest {

    private Space space;

    @BeforeEach
    void setUp() {
        space = Space.builder()
                .id("space1")
                .userId("user1")
                .name("Work")
                .colorKey("blue")
                .build();
    }

    @Test
    void addTask_shouldAddTask() {
        String taskId = "task123";
        space.addTask(taskId);

        assertThat(space.getTaskIds()).contains(taskId);
        assertThat(space.getTaskIds()).hasSize(1);
    }

    @Test
    void removeTask_shouldRemoveTask() {
        String taskId = "task123";
        space.addTask(taskId);
        assertThat(space.getTaskIds()).contains(taskId);

        space.removeTask(taskId);

        assertThat(space.getTaskIds()).doesNotContain(taskId);
        assertThat(space.getTaskIds()).isEmpty();
    }

    @Test
    void removeTask_shouldDoNothingIfTaskIdNotPresent() {
        space.addTask("taskA");

        space.removeTask("nonexistentTask");

        assertThat(space.getTaskIds()).containsExactly("taskA");
    }
}