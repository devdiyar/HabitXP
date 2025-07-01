import {Ionicons} from '@expo/vector-icons';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {useState} from "react";
import {completeTask, deleteTask} from "@/services/taskService";
import {Colors} from "@/constants/Colors";
import RewardModal from "@/components/Modals/RewardModal";
import {RewardItem} from "@/types/reward";
import {queryClient} from '@/lib/queryClient';
import {selectLevelUpBonus} from '@/services/userService';
import {useUserData} from "@/hooks/useUserData";
import LevelUpModal from '../Modals/LevelUpModal';
import DeleteModal from "@/components/Modals/DeleteModal";
import OptionsDropdown from "@/components/OptionsDropdown";
import {router} from "expo-router";

interface CardProps {
    id: string;
    title: string;
    durationValue: string;
    durationUnit: "MINUTES" | "HOURS"
    times: number;
    frequency: string;
    done: boolean;
    spaceColorKey: keyof typeof Colors.habit;
    completionsCount: number;
    isDropdownOpen: boolean;
    setDropdownOpen: (id: string | null) => void;
}

const frequencyMap: Record<string, string> = {
    DAILY: "täglich",
    WEEKLY: "wöchentlich",
    MONTHLY: "monatlich",
};

export default function Card({
                                 id,
                                 title,
                                 durationValue,
                                 durationUnit,
                                 times,
                                 frequency,
                                 done,
                                 spaceColorKey,
                                 completionsCount,
                                 isDropdownOpen,
                                 setDropdownOpen,
                             }: Readonly<CardProps>) {
    const [showModal, setShowModal] = useState(false);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {data: userData} = useUserData();

    const handleLevelUpChoice = async (choice: "HEALTH" | "TASK_LIMIT") => {
        try {
            if (!userData?.id) return;
            await selectLevelUpBonus(userData.id, choice);
            setShowLevelUpModal(false);
            await queryClient.invalidateQueries({queryKey: ['userData']});
        } catch (error) {
            console.error("Fehler beim Anwenden der Belohnung:", error);
        }
    };

    const [rewards, setRewards] = useState<RewardItem[]>([]);

    const colorSet = Colors.habit[spaceColorKey];
    const backgroundColor = done ? colorSet.completed : colorSet.bg;
    const accentColor = done ? colorSet.completedAccent : colorSet.ac;

    const handleComplete = async () => {
        if (done) return;

        try {
            const response = await completeTask(id);
            const effectiveXP = userData?.xpBonusActive ? response.rewardXP * userData.xpFactor : response.rewardXP;
            if (response.completed) {
                if (response.levelup) {
                    setShowLevelUpModal(true);
                }
                await queryClient.invalidateQueries({queryKey: ['tasks']});
                await queryClient.invalidateQueries({queryKey: ['userData']});
                setRewards([
                    {label: "XP", value: effectiveXP},
                    {label: "Coins", value: response.rewardCoins},
                ]);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Fehler beim Abschließen des Tasks:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTask(id);
            await queryClient.invalidateQueries({queryKey: ['tasks']});
            await queryClient.invalidateQueries({queryKey: ['userData']});
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Fehler beim Löschen:", err);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => setDropdownOpen(null)}>
            <View
                style={[styles.container, {backgroundColor}]}>
                <View>
                    <View style={styles.top}>
                        {/* Badge */}
                        <View style={[styles.timeBadge, {backgroundColor: accentColor}]}>
                            <Text style={styles.duration}>
                                {durationValue} {durationUnit === "HOURS"
                                ? (durationValue === "1" ? "Stunde" : "Stunden")
                                : (durationValue === "1" ? "Minute" : "Minuten")}
                            </Text>
                        </View>

                        <OptionsDropdown
                            accentColor={accentColor}
                            onEdit={() => router.push(`/habit/${id}`)}
                            onDelete={() => setShowDeleteModal(true)}
                            isOpen={isDropdownOpen}
                            setIsOpen={(open) => setDropdownOpen(open ? id : null)}
                        />

                    </View>
                    <View
                        style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}
                    >
                        <Text style={styles.label}>{title}</Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={styles.deadline}>
                        {frequency !== "NONE" ? `${times}x ${frequencyMap[frequency]} (${completionsCount}/${times})` : ""}
                    </Text>

                    <TouchableOpacity onPress={handleComplete}>
                        <Ionicons
                            name={"checkmark-circle"}
                            size={50}
                            color={"white"}
                            style={{opacity: done ? 0.4 : 1}}
                        />
                    </TouchableOpacity>
                </View>

                <RewardModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    title={"Habit abgeschlossen!"}
                    description={"Du hast Belohnungen erhalten:"}
                    rewards={rewards}
                    animationType={"confetti"}
                />

                <LevelUpModal
                    visible={showLevelUpModal}
                    onSelect={handleLevelUpChoice}
                />

                <DeleteModal
                    visible={showDeleteModal}
                    title={title}
                    type="habit"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 70,
        padding: 8,
        borderRadius: 20,
        marginBottom: 18,
        marginHorizontal: 2,
    },
    editButton: {
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 38,
        right: 0,
        borderRadius: 8,
        paddingVertical: 6,
        minWidth: 140,
        paddingHorizontal: 4,
        zIndex: 10,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        width: '100%',
    },
    menuItemActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        width: '100%',
    },
    menuText: {
        fontSize: 16,
        color: "white"
    },
    duration: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '800',
        padding: 2,
    },
    label: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        paddingLeft: 16
    },
    deadline: {
        alignSelf: 'flex-end',
        paddingLeft: 16,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 50,
        opacity: 0.8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center'
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});