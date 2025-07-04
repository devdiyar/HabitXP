package com.habitxp.backend.service;

import com.habitxp.backend.dto.CompletionResponse;
import com.habitxp.backend.dto.StatusResponse;
import com.habitxp.backend.model.Frequency;
import com.habitxp.backend.model.FrequencyOrder;
import com.habitxp.backend.model.Task;
import com.habitxp.backend.model.User;
import com.habitxp.backend.repository.SpaceRepository;
import com.habitxp.backend.repository.TaskRepository;
import com.habitxp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final SpaceRepository spaceRepository;
    private final SpaceService spaceService;

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AIAgentService aiagent;

    public List<Task> getTasksByUser(String userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        tasks.forEach(task -> {
            task.updateCompletionStatus();
            taskRepository.save(task);
        });
        return tasks;
    }

    public Task getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        task.updateCompletionStatus();
        taskRepository.save(task);
        return task;
    }

    public Task createTask(Task task) {
        task.setRewardXP(aiagent.calculateXP(task));
        task.setRewardCoins(aiagent.calculateCoins(task));

        User user = getUserById(task.getUserId());
        long currentTaskCount = taskRepository.countByUserId(user.getId());
        if (currentTaskCount >= user.getTaskLimit()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task Limit reached (" + user.getTaskLimit() + ")");
        }

        Task savedTask = taskRepository.save(task);

        if (task.getSpaceId() != null) {
            spaceRepository.findById(task.getSpaceId()).ifPresent(space -> {
                space.addTask(savedTask.getId());
                spaceRepository.save(space);
            });
        }
        return savedTask;
    }

    public Task updateTask(Task updatedTask) {
        Task existing = getTaskById(updatedTask.getId());

        existing.setTitle(updatedTask.getTitle());
        existing.setDuration(updatedTask.getDuration());
        existing.setFrequency(updatedTask.getFrequency());
        existing.setTimes(updatedTask.getTimes());
        existing.setSpaceId(updatedTask.getSpaceId());

        return taskRepository.save(existing);
    }


    public void deleteTask(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (task.getSpaceId() != null) {
            spaceRepository.findById(task.getSpaceId()).ifPresent(space -> {
                space.removeTask(taskId);
                spaceRepository.save(space);
            });
        }

        taskRepository.deleteById(taskId);
    }

    public CompletionResponse completeTask(String taskId, String userId) {
        Task task = getTaskById(taskId);
        User user = getUserById(userId);

        //levelup überprüfen
        boolean success = task.markAsCompleted(user);
        taskRepository.save(task);

        boolean completed = task.isPeriodCompleted();
        int level = user.getLevel();
        boolean levelup = false;

        if (success && completed) {
            applyRewardsToUser(user, task);

            user = getUserById(userId);
            if (user.getLevel() > level) {
                levelup = true;
            }
        }

        return new CompletionResponse(
                success,
                completed,
                levelup,
                task.remainingCompletions(),
                task.getRewardXP(),
                task.getRewardCoins()
        );
    }

    public StatusResponse getTaskStatus(String taskId) {
        Task task = getTaskById(taskId);
        task.updateCompletionStatus();

        return new StatusResponse(
                task.isCompleted(),
                task.remainingCompletions()
        );
    }

    private User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public void applyRewardsToUser(User user, Task task) {
        user.addXP(task.getRewardXP());
        user.setCoins(user.getCoins() + task.getRewardCoins());

        List<Task> userTasks = taskRepository.findByUserId(user.getId());
        Frequency lowestFrequency = determineLowestFrequency(userTasks);

        if (!hasAlreadyCountedStreak(user, lowestFrequency, userTasks)) {
            user.setStreak(user.getStreak() + 1);
            user.setLastStreakUpdate(LocalDate.now());
        }

        userRepository.save(user);
    }

    private Frequency determineLowestFrequency(List<Task> tasks) {
        return tasks.stream()
                .map(Task::getFrequency)
                .filter(f -> {
                    try {
                        FrequencyOrder.valueOf(f.name());
                        return true;
                    } catch (IllegalArgumentException e) {
                        return false;
                    }
                })
                .min(Comparator.comparingInt(f -> FrequencyOrder.valueOf(f.name()).getOrder()))
                .orElse(Frequency.DAILY);
    }

    private boolean hasAlreadyCountedStreak(User user, Frequency lowestFrequency, List<Task> tasks) {
        LocalDate today = LocalDate.now();

        switch (lowestFrequency) {
            case DAILY:
                return user.getLastStreakUpdate() != null && user.getLastStreakUpdate().isEqual(today);
            case WEEKLY:
                WeekFields weekFields = WeekFields.of(Locale.getDefault());
                int currentWeek = today.get(weekFields.weekOfWeekBasedYear());
                int currentYear = today.getYear();

                if (user.getLastStreakUpdate() == null) return false;

                int lastWeek = user.getLastStreakUpdate().get(weekFields.weekOfWeekBasedYear());
                int lastYear = user.getLastStreakUpdate().getYear();

                return lastWeek == currentWeek && lastYear == currentYear;

            case MONTHLY:
                if (user.getLastStreakUpdate() == null) return false;

                return user.getLastStreakUpdate().getYear() == today.getYear()
                        && user.getLastStreakUpdate().getMonth() == today.getMonth();

            default:
                return false;
        }
    }


}
