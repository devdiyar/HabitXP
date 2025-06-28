import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import Container from "@/components/Container";
import Title from "@/components/Title";
import {Ionicons} from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import InputField from "@/components/InputField";
import NormalText from "@/components/NormalText";
import PrimaryButton from "@/components/PrimaryButton";
import {router} from "expo-router";
import DropdownSelect from "@/components/DropdownSelect";
import {Frequency, NewTask} from "@/types/task";
import {queryClient} from "@/lib/queryClient";
import {useUserData} from "@/hooks/useUserData";
import {createTask} from "@/services/taskService";
import {useHabitForm} from "@/hooks/useHabitForm";
import {useMemo, useState} from "react";
import {frequencyLabels, frequencyOptions, getDurationLabel} from "@/utils/habitFormUtils";
import {useSpaces} from "@/hooks/useSpaces";
import {createSpace} from "@/services/spaceService";
import CreateSpaceModal from "../Modals/CreateSpaceModal";

interface HabitFormScreenProps {
    initialValues?: Partial<NewTask>;
    disabledFields?: string[];
    onSubmit?: (habit: NewTask) => Promise<void>;
}

export default function HabitFormScreen({
                                            initialValues = {},
                                            disabledFields = [],
                                            onSubmit,
                                        }: Readonly<HabitFormScreenProps>) {

    const colors = useTheme();
    const {data: userData} = useUserData();
    const {data: spaces, refetch} = useSpaces();
    const [isSpaceModalVisible, setIsSpaceModalVisible] = useState(false);

    const {
        title, setTitle,
        frequency, setFrequency,
        times, setTimes,
        durationValue, setDurationValue,
        durationUnit, setDurationUnit,
        space, setSpace,
    } = useHabitForm(initialValues);

    const durationOptions = useMemo(() => [
        {label: getDurationLabel("MINUTES", durationValue), value: "MINUTES"},
        {label: getDurationLabel("HOURS", durationValue), value: "HOURS"},
    ], [durationValue]);

    const handleSave = async () => {
        if (!title || !space) {
            alert("Bitte Titel und Space ausfüllen");
            return;
        }

        const habit: NewTask = {
            userId: userData?.id!,
            title,
            duration: `${durationValue}${durationUnit === "HOURS" ? "h" : "min"}`,
            frequency,
            times: frequency !== "NONE" ? parseInt(times) : 1,
            spaceId: space,
        };

        try {
            if (onSubmit) {
                await onSubmit(habit);
            } else {
                await createTask(habit);
            }
            await queryClient.invalidateQueries({queryKey: ['tasks']});
            await queryClient.invalidateQueries({queryKey: ['userData']});
            router.replace("/");
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            alert("Fehler beim Speichern des Habits");
        }
    };

    return (
        <Container>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name={"arrow-back"} size={30} color={colors.title}/>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Ionicons name={"calendar"} size={24} color={colors.primary} style={styles.headerIcon}/>
                        <Title>{initialValues.title ? "Gewohnheit bearbeiten" : "Gewohnheit erstellen"}</Title>
                    </View>

                    <InputField
                        value={title}
                        onChangeText={setTitle}
                        placeholder={"Gewohnheit"}
                        editable={!disabledFields.includes("title")}
                    />

                    <NormalText style={styles.label}>Space</NormalText>
                    <View style={styles.spaceRow}>
                        <DropdownSelect
                            value={space}
                            data={spaces?.map(s => ({label: s.name, value: s.id})) || []}
                            onChange={(item) => setSpace(item.value)}
                            style={styles.spaceDropdown}
                        />
                        <TouchableOpacity
                            style={styles.addSpaceButton}
                            onPress={() => setIsSpaceModalVisible(true)}
                        >
                            <Ionicons name={"add-circle-outline"} size={28} color={colors.primary}/>
                        </TouchableOpacity>
                    </View>

                    <NormalText style={styles.label}>Zeitintervall</NormalText>
                    <View style={styles.row}>
                        {frequencyOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[
                                    styles.optionButton,
                                    {backgroundColor: frequency === opt.value ? colors.primary : colors.inputBackground},
                                ]}
                                onPress={() => setFrequency(opt.value as Frequency)}
                            >
                                <NormalText>{opt.label}</NormalText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.timeRow}>
                        {frequency !== "NONE" && (
                            <View>
                                <NormalText style={styles.label}>Wie oft pro {frequencyLabels[frequency]}?</NormalText>
                                <InputField
                                    value={times}
                                    onChangeText={setTimes}
                                    placeholder={"1"}
                                    keyboardType={"numeric"}
                                    style={styles.input}
                                />
                            </View>
                        )}

                        <View>
                            <NormalText style={styles.label}>Wie lange?</NormalText>
                            <View style={styles.durationRow}>
                                <InputField
                                    value={durationValue}
                                    onChangeText={setDurationValue}
                                    placeholder={"15"}
                                    keyboardType={"numeric"}
                                    style={[styles.input, {marginRight: 8}]}
                                />
                                <DropdownSelect
                                    value={durationUnit}
                                    data={durationOptions}
                                    onChange={(item) => setDurationUnit(item.value as "MINUTES" | "HOURS")}
                                    style={styles.unitDropdown}
                                />
                            </View>
                        </View>
                    </View>

                    <PrimaryButton title={initialValues.title ? "Speichern" : "Erstellen"} onPress={handleSave}/>

                </ScrollView>
            </KeyboardAvoidingView>
            <CreateSpaceModal
                isVisible={isSpaceModalVisible}
                onClose={() => setIsSpaceModalVisible(false)}
                existingSpaces={spaces || []}
                onDone={async (name, colorKey) => {
                    const newSpace = await createSpace({name, colorKey, userId: userData?.id!});
                    await refetch();
                    setSpace(newSpace.id);
                }}
            />

        </Container>

    );
}

const styles = StyleSheet.create({
    backButton: {
        zIndex: 10,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    headerIcon: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 12
    },
    spaceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10
    },
    spaceDropdown: {
        flex: 1
    },
    addSpaceButton: {
        padding: 5
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center"
    },
    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 16
    },
    input: {
        width: 75
    },
    durationRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    unitDropdown: {
        width: 110,
        marginBottom: 14,
    },
    optionButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 8,
    }
});
