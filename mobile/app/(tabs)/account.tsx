import {useAuth} from "@/context/AuthContext";
import {Pressable, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Container from "@/components/Container";
import GamificationCard from "@/components/Gamification/GamificationCard";
import {useUserData} from "@/hooks/useUserData";
import {useRouter} from "expo-router";

export default function AccountScreen() {
    const router = useRouter();
    const {logout, user} = useAuth();
    const {data: userData, isLoading, isError} = useUserData();

    return (
        <Container>
            {isLoading && <Text>Loading...</Text>}
            {isError && <Text>Fehler beim Laden der Daten</Text>}
            {userData && <GamificationCard allowStreakModal={false}/>}

            <Pressable style={styles.buttonContainer} onPress={() => router.push('/settings')}>
                <Ionicons name="settings-outline" size={24} color="white"/>
                <Text style={styles.buttonText}>Einstellungen</Text>
            </Pressable>

            <Pressable style={styles.logoutContainer} onPress={logout}>
                <Ionicons name={"log-out-outline"} size={24} color={"#e63946"}/>
                <Text style={styles.logoutText}>Ausloggen</Text>
            </Pressable>
        </Container>
    );
}

const styles = StyleSheet.create({
    logoutContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginTop: 32,
    },
    logoutText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#e63946",
        fontWeight: "bold"
    },

    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
    },
    buttonText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "bold",
        color: "white", // Standardfarbe für Einstellungen
    },
});