import {useQuery} from "@tanstack/react-query";
import {getTasks} from "@/services/taskService";
import {Task} from "@/types/task";
import {useAuth} from "@/context/AuthContext";
import {filterCompletionsByFrequency} from "@/utils/filterCompletionsByFrequency";

export function useTasks() {
    const {userId} = useAuth();

    return useQuery<Task[]>({
        queryKey: ['tasks', userId],
        queryFn: async () => {
            const data = await getTasks();

            return data.map(task => {
                const completionsInPeriod = filterCompletionsByFrequency(task.completions, task.frequency);
                
                return {
                    ...task,
                    completionsCount: completionsInPeriod.length,
                    isCompleted: task.completed,
                };
            });
        },
        enabled: !!userId,
        refetchOnWindowFocus: true,
        refetchInterval: 5 * 60 * 1000
    });
}
