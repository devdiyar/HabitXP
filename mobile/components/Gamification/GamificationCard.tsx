import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import ProgressBar from "@/components/Gamification/ProgressBar";
import StatIndicator from "@/components/Gamification/StatIndicator";
import RewardModal from "@/components/Modals/RewardModal";
import {useRemainingTime} from "@/hooks/useRemainingTime";
import {useTasks} from "@/hooks/useTasks";
import {useUserData} from '@/hooks/useUserData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_MILESTONES = [5, 10, 25, 50, 100];

const GAMIFICATION_ICONS = {
    diamond: require('@/assets/images/icons/gamification/diamand.png'),
    coin: require("@/assets/images/icons/gamification/coin.png")
};

interface GamificationCardProps {
    allowStreakModal?: boolean;
}

const GamificationCard: React.FC<GamificationCardProps> = ({allowStreakModal = true}) => {

    const {data: userData, isLoading, isError} = useUserData();
    const {data: habits = []} = useTasks();
    const [showStreakModal, setShowStreakModal] = useState(false);

    if (!userData || isLoading || isError) return null;

    const {
        health,
        maxHealth,
        currentXP,
        xpGoal,
        level,
        coins,
        streak,
        avatars,
        xpBonusActive,
        xpFactor,
        xpFactorUntil,
        taskLimit
    } = userData;

    const avatar = (avatars && avatars.length > 0) ? avatars[0] : 'diamond';
    const remainingTime = useRemainingTime(xpFactorUntil);

    useEffect(() => {
        const checkAndShowStreakModal = async () => {
            if (!allowStreakModal) return;

            if (STREAK_MILESTONES.includes(streak)) {
                const key = `streak_shown_${streak}`;
                const wasShown = await AsyncStorage.getItem(key);
                if (!wasShown) {
                    setShowStreakModal(true);
                    await AsyncStorage.setItem(key, "true");
                }
            }
        };

        checkAndShowStreakModal().catch(console.error);
    }, [streak, allowStreakModal]);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.row}>
                    {/* Avatar */}
                    <View style={styles.avatarBox}>
                        <Image source={GAMIFICATION_ICONS[avatar as keyof typeof GAMIFICATION_ICONS]}
                               style={styles.diamond}/>
                    </View>

                    {/* Bars & Stats */}
                    <View style={styles.barsBox}>
                        {/* HP Bar */}
                        <ProgressBar current={health} max={maxHealth} color={"#e74c3c"} label={"Health"}
                                     icon={<Ionicons name={"heart"} size={24} color={"#e74c3c"}/>}
                        />
                        {/* XP Bar */}
                        <ProgressBar
                            current={currentXP}
                            max={xpGoal}
                            color={"#f1c40f"}
                            label={"Experience"}
                            icon={<Ionicons name="star" size={24} color="#f1c40f"/>}
                            highlighted={xpBonusActive && remainingTime !== null}
                        />
                        <ProgressBar
                            current={habits.length}
                            max={taskLimit}
                            color={"#3498db"}
                            label={`Habits`}
                            icon={<Ionicons name="journal" size={24} color={"#3498db"}></Ionicons>}/>
                    </View>
                </View>

                {/* Coin + Level */}
                <View style={styles.coinlvlBox}>
                    <Text style={styles.lvlText}>Lvl {level}</Text>


                    <View style={styles.rightStatsBox}>
                        {xpBonusActive && remainingTime && (
                            <View style={styles.xpBonusContainer}>
                                <Text style={styles.xpBonusIcon}>x{xpFactor} ·</Text>
                                <Text style={styles.xpBonusText}>
                                    {remainingTime.hours}h {remainingTime.minutes}min
                                </Text>
                            </View>
                        )}
                        <StatIndicator
                            value={streak}
                            iconType={"icon"}
                            iconName={"flame"}
                            iconColor={"#ff5722"}
                        />

                        <StatIndicator
                            value={coins}
                            iconType={"image"}
                            iconSource={GAMIFICATION_ICONS.coin}
                        />
                    </View>
                </View>
            </View>

            <RewardModal
                visible={showStreakModal}
                onClose={() => setShowStreakModal(false)}
                title={`${streak} Tage Streak!`}
                description={'Starke Leistung!'}
                animationType="flame"
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 26,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        paddingBottom: 12,
    },
    avatarBox: {
        backgroundColor: '#221a3f',
        padding: 30,
        alignItems: 'center',
        marginRight: 15,
    },
    diamond: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 2,
    },
    barsBox: {
        flex: 1,
        justifyContent: 'center',
    },
    xpBonusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    xpBonusIcon: {
        color: "#FFD700",
        fontWeight: "bold",
        marginRight: 5,
        fontSize: 20
    },
    xpBonusTextContainer: {
        flexDirection: "column",
        alignItems: "center"
    },
    xpBonusText: {
        color: "#FFD700",
        fontSize: 13,
        fontWeight: "bold"
    },
    progressWrapper: {
        marginBottom: 20,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        alignItems: "center",
        width: 30,
        marginRight: 10
    },
    progressBarBackground: {
        flex: 1,
        height: 18,
        backgroundColor: '#23272F',
        borderRadius: 9,
        overflow: "hidden"
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 9,
    },
    progressInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
        marginLeft: 35,
        paddingHorizontal: 4,
    },
    progressText: {
        color: "white",
        fontSize: 14
    },
    progressLabel: {
        color: 'white',
        fontSize: 14,
        textAlign: 'right',
    },
    coinlvlBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginHorizontal: 4,
    },
    lvlText: {
        color: "white",
        fontSize: 18,
        marginTop: 2,
        textAlign: "center"
    },
    rightStatsBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16
    },
});

export default GamificationCard;
