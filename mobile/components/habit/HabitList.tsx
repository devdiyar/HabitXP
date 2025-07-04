import React, {useMemo, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import Card from '../habit/Card';
import {Task} from "@/types/task";
import useTheme from "@/hooks/useTheme";
import {useTasks} from "@/hooks/useTasks";
import {useSpaces} from "@/hooks/useSpaces";
import {Colors} from "@/constants/Colors";
import {Space} from "@/types/space";
import {DurationUnit} from "@/types/duration";

export default function List() {
    const colors = useTheme();
    const {data: habits = [], isLoading, isError} = useTasks();
    const {data: spaces = []} = useSpaces();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const options = ['Alle', 'Heute', 'Woche', 'Monat'];
    let hasShownCompletedDivider = false;

    const frequencyFilters: { [key: number]: ((task: Task) => boolean) | undefined } = {
        0: undefined,
        1: (task: Task) => task.frequency === 'DAILY',
        2: (task: Task) => task.frequency === 'WEEKLY',
        3: (task: Task) => task.frequency === 'MONTHLY',
    };

    const filteredData = useMemo(() => {
        const filterByFrequency = frequencyFilters[selectedIndex];
        const filtered = filterByFrequency ? habits.filter(filterByFrequency) : habits;

        return [...filtered].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            const titleComparison = a.title.localeCompare(b.title);
            if (titleComparison !== 0) {
                return titleComparison;
            }

            const getMinutes = (duration: string) => {
                const match = duration.match(/^(\d+)(min|h)$/);
                if (!match) return Number.MAX_SAFE_INTEGER;
                const value = parseInt(match[1], 10);
                return match[2] === 'h' ? value * 60 : value;
            };
            return getMinutes(a.duration) - getMinutes(b.duration);
        });
    }, [selectedIndex, habits]);

    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Fehler beim Laden der Aufgaben</Text>;

    return (
        <View style={{flex: 1}}>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {options.map((label, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionContainer,
                                selectedIndex === index && {backgroundColor: colors.primary},
                            ]}
                            onPress={() => setSelectedIndex(index)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedIndex === index && styles.optionTextSelected,
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({item, index}) => {
                    const match = item.duration?.match(/^([\d.,]+)(min|h|pcs|m|km|l)$/);
                    const durationValue = match?.[1] || "0";

                    const durationUnitMap: Record<string, DurationUnit> = {
                        h: "HOURS",
                        min: "MINUTES",
                        pcs: "PIECES",
                        m: "METERS",
                        km: "KILOMETERS",
                        l: "LITERS",
                    };
                    const matchedUnit = match?.[2] ?? "min";
                    const durationUnit: DurationUnit = durationUnitMap[matchedUnit];

                    const space = spaces.find((s: Space) => s.id === item.spaceId);
                    if (!space) return null;
                    const spaceColorKey: keyof typeof Colors.habit = space.colorKey;

                    let showCompletedDivider = false;
                    if (item.completed && !hasShownCompletedDivider) {
                        showCompletedDivider = true;
                        hasShownCompletedDivider = true;
                    }

                    return (
                        <>
                            {showCompletedDivider && (
                                <View style={styles.dividerContainer}>
                                    <View style={styles.line}/>
                                    <Text style={styles.dividerText}>Abgeschlossen</Text>
                                    <View style={styles.line}/>
                                </View>
                            )}

                            <Card
                                id={item.id}
                                title={item.title}
                                durationValue={durationValue}
                                durationUnit={durationUnit}
                                times={item.times}
                                frequency={item.frequency}
                                done={item.completed}
                                spaceColorKey={spaceColorKey}
                                completionsCount={item.completionsCount}
                                isDropdownOpen={openDropdownId === item.id}
                                setDropdownOpen={setOpenDropdownId}
                            />
                        </>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 10,
        paddingBottom: 16
    },
    optionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 24,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    optionText: {
        color: '#909396',
        fontSize: 16,
        fontWeight: '600',
    },
    optionTextSelected: {
        color: 'white',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginHorizontal: 16,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    dividerText: {
        marginHorizontal: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#909396',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

});
