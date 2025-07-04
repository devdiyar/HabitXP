import List from '@/components/habit/HabitList';
import GamificationCard from '@/components/Gamification/GamificationCard';
import Container from '@/components/Container';
import {Text} from "react-native";
import {useUserData} from "@/hooks/useUserData";
import {useFocusEffect} from "expo-router";
import React from "react";

export default function HomeScreen() {
    const {data: userData, isLoading, isError, refetch} = useUserData();

    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [])
    );

    if (isLoading) return <Text>Loading...</Text>;
    if (isError || !userData) return <Text>Fehler beim Laden der Daten</Text>;

    return (
        <Container>
            <GamificationCard/>
            <List/>
        </Container>
    );
}
