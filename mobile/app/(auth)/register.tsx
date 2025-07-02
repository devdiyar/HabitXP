import {useAuth} from "@/context/AuthContext";
import {useState} from "react";
import {Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {router} from "expo-router";
import Container from "@/components/Container";
import Title from "@/components/Title";
import Link from "@/components/Link";
import NormalText from "@/components/NormalText";
import PrimaryButton from "@/components/PrimaryButton";
import {ROUTES} from "@/routes";
import InputField from "@/components/InputField";
import useTheme from "@/hooks/useTheme";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {isNotEmpty, isSecurePassword, isValidEmail} from "@/utils/validators";

export default function RegisterScreen() {
    const {register} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const colors = useTheme();

    const handleRegister = async () => {
        if (loading) return;
        const newErrors: typeof errors = {};

        if (!isNotEmpty(firstName)) newErrors.firstName = "Bitte Vorname eingeben";
        if (!isNotEmpty(lastName)) newErrors.lastName = "Bitte Nachname eingeben";
        if (!isNotEmpty(username)) newErrors.username = "Bitte Benutzernamen eingeben";
        if (!isNotEmpty(email)) newErrors.email = "Bitte Email eingeben";
        if (!isValidEmail(email)) newErrors.email = "Bitte eine gültige Email-Adresse eingeben";
        if (!isNotEmpty(password)) newErrors.password = "Bitte Passwort eingeben";
        if (!isSecurePassword(password)) newErrors.password = "Mind. 8 Zeichen und 1 Großbuchstabe";
        if (password !== repeatPassword) newErrors.repeatPassword = "Passwörter stimmen nicht überein";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await register({email, password, username, firstName, lastName});
        } catch (e: any) {
            const message = e?.response?.data?.message ?? e?.response?.data?.error;
            setErrors({
                server: message || "Etwas ist schiefgelaufen – versuche es erneut"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{backgroundColor: colors.background}}
            contentContainerStyle={{flexGrow: 1}}
            enableOnAndroid={true}
            keyboardShouldPersistTaps={"handled"}
            extraScrollHeight={20}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container style={styles.container}>
                    <Title style={styles.title}>Registrierung</Title>

                    <View style={styles.row}>
                        <InputField
                            label={"Vorname"}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder={"Vorname"}
                            style={{flex: 1}}
                            error={errors.firstName}
                        />
                        <InputField
                            label={"Nachname"}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder={"Nachname"}
                            style={{flex: 1}}
                            error={errors.lastName}
                        />
                    </View>

                    <InputField
                        label={"Email"}
                        value={email}
                        onChangeText={setEmail}
                        placeholder={"Email"}
                        error={errors.email}
                    />
                    <InputField
                        label={"Benutzername"}
                        value={username}
                        onChangeText={setUsername}
                        placeholder={"Benutzername"}
                        error={errors.username}
                    />
                    <InputField
                        label={"Passwort"}
                        value={password}
                        onChangeText={setPassword}
                        placeholder={"Passwort"}
                        secureTextEntry={true}
                        error={errors.password}
                    />
                    <InputField
                        value={repeatPassword}
                        onChangeText={setRepeatPassword}
                        placeholder={"Passwort wiederholen"}
                        secureTextEntry={true}
                        error={errors.repeatPassword}
                    />

                    {errors.server && <NormalText style={styles.serverError}>{errors.server}</NormalText>}

                    <PrimaryButton title={"Registrieren"} loading={loading} onPress={handleRegister}/>

                    <TouchableOpacity onPress={() => router.replace(ROUTES.LOGIN)}>
                        <NormalText style={styles.signInLink}>
                            Du hast bereits einen Account? <Link>Anmelden</Link>
                        </NormalText>
                    </TouchableOpacity>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {padding: 20, justifyContent: "center"},
    title: {
        marginBottom: 24,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16
    },
    serverError: {color: "red", marginBottom: 12},
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#333",
    },
    socialRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    orText: {
        marginHorizontal: 10,
        color: "#aaa",
    },
    signInLink: {textAlign: "center", marginTop: 24},
});