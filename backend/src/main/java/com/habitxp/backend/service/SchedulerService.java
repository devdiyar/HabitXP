package com.habitxp.backend.service;

import com.habitxp.backend.model.Frequency;
import com.habitxp.backend.model.Space;
import com.habitxp.backend.model.Task;
import com.habitxp.backend.model.User;
import com.habitxp.backend.repository.SpaceRepository;
import com.habitxp.backend.repository.TaskRepository;
import com.habitxp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final SpaceRepository spaceRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Scheduled(cron = "0 0 * * * *") // jede Stunde
    public void checkDeadlineTask() {
        LocalDate today = LocalDate.now();
        List<Task> allTasks = taskRepository.findAll();
        List<User> users = userRepository.findAll();

        for (User user : users) {

            boolean hasCompletedAny = false;

            List<Space> spaces = spaceRepository.findAllById(user.getSpaceIds());
            for (Space space : spaces) {
                List<Task> tasks = taskRepository.findAllById(space.getTaskIds());

                for (Task task : tasks) {
                    if (task.getDeadline() != null && task.getDeadline().isBefore(today)) {

                        if (task.isCompleted()) {
                            hasCompletedAny = true;
                        } else {
                            // Reset oder löschen
                            if (task.getFrequency() == Frequency.NONE) {
                                space.getTaskIds().remove(task.getId());
                                spaceRepository.save(space);
                                taskRepository.delete(task);
                            } else {
                                task.setCompletions(new ArrayList<>());
                                task.setCompleted(false);
                                taskRepository.save(task);
                            }
                        }
                    }
                }
            }

            if (!hasCompletedAny && !user.isStreakFreezeActive()) {
                user.setStreakBroken(true);
                user.setStreak(0);

                user.healthpenalty();
                user.coinPenalty();
            }
        }

    userRepository.saveAll(users);
    }


    @Scheduled(cron = "0 0 0 * * *") // täglich um Mitternacht
    public void checkUsersForHpPenalty() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getHealth() <= 0) {
                user.coinPenalty();
                userRepository.save(user);
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // täglich um Mitternacht
    public void restartStreak() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.isStreakBroken()) {
                user.setStreakBroken(false);
            }
        }
    }

    @Scheduled(cron = "0 0 * * * *") // jede Stunde
    public void checkUsersForStreakFreeze() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.streakFreezeReset();
        }
    }

    @Scheduled(cron = "0 0 * * * *") // jede Stunde
    public void checkUsersForXPFactor() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.xpFactorReset();
        }
    }

}
