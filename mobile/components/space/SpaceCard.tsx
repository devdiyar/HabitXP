import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import HabitCard from './HabitCard';
import {Space} from '@/types/space';
import {Task} from '@/types/task';
import {Colors} from '@/constants/Colors';
import DeleteModal from '@/components/Modals/DeleteModal';
import OptionsDropdown from '@/components/OptionsDropdown';
import {queryClient} from '@/lib/queryClient';
import {deleteSpace} from '@/services/spaceService';
import {Ionicons} from '@expo/vector-icons';

interface SpaceProps {
    space: Space;
    tasks: Task[];
    onEdit?: (space: Space) => void;
    openDropdownId: string | null;
    setOpenDropdownId: (id: string | null) => void;
}

const SpaceCard = ({
                       space,
                       tasks,
                       onEdit,
                       openDropdownId,
                       setOpenDropdownId,
                   }: SpaceProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const isDropdownOpen = openDropdownId === space.id;

    const handleDelete = async () => {
        try {
            await deleteSpace(space.id);
            await queryClient.invalidateQueries({queryKey: ['spaces']});
            await queryClient.invalidateQueries({queryKey: ['tasks']});
            await queryClient.invalidateQueries({queryKey: ['userData']});
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
        }
    };

    const renderHabitRows = () => {
        const rows = [];
        for (let i = 0; i < tasks.length; i += 2) {
            const habit1 = tasks[i];
            const habit2 = tasks[i + 1];
            const color = Colors.habit[space.colorKey];

            rows.push(
                <View key={i} style={styles.habitRow}>
                    <HabitCard name={habit1.title} bg={color.bg}/>
                    {habit2 && <HabitCard name={habit2.title} bg={color.bg}/>}
                </View>,
            );
        }
        return rows;
    };

    return (
        <View
            style={[
                styles.container,
                isDropdownOpen && {zIndex: 10, elevation: 20},
            ]}
        >
            <TouchableOpacity style={[styles.header,
                {
                    backgroundColor: Colors.habit[space.colorKey].bg,
                    borderRadius: 21,
                    paddingHorizontal: 12,
                },
            ]}
                              onPress={() => setIsExpanded(!isExpanded)}
            >
                <View style={styles.titleWrapper}>
                    <Text style={styles.title} numberOfLines={2}>{space.name}</Text>
                </View>

                <View style={styles.iconRow}>
                    <OptionsDropdown
                        accentColor={Colors.habit[space.colorKey].ac}
                        onEdit={() => {
                            setOpenDropdownId(null);
                            onEdit?.(space);
                        }} onDelete={() => {
                        setOpenDropdownId(null);
                        setShowDeleteModal(true);
                    }}
                        isOpen={isDropdownOpen}
                        setIsOpen={open => setOpenDropdownId(open ? space.id : null)}
                    />
                    <Ionicons
                        name={
                            isExpanded ? 'chevron-expand-outline' : 'chevron-collapse-outline'
                        }
                        size={24}
                        color="white"
                    />
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.habitContainer}>{renderHabitRows()}</View>
            )}

            <DeleteModal
                visible={showDeleteModal}
                title={space.name}
                type="space"
                affectedItems={tasks.map(task => task.title)}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </View>
    );
};

export default SpaceCard;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    titleWrapper: {
        flex: 1,
        paddingRight: 20,
    },
    title: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        paddingLeft: 16,
        flexShrink: 1,
        flexWrap: "wrap",
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    stats: {
        color: 'white',
        fontSize: 14,
    },
    coinIcon: {
        fontSize: 16,
    },
    habitContainer: {
        marginTop: 10,
        gap: 10,
        zIndex: 1,
    },
    habitRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        zIndex: 1,
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
    iconRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
});
