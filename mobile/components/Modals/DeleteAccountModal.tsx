import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from "@/constants/Colors";

interface DeleteModalProps {
    visible: boolean;
    title: string;
    type?: 'habit' | 'space';
    affectedItems?: string[];
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteModal({
                                        visible,
                                        title,
                                        type,
                                        affectedItems,
                                        onConfirm,
                                        onCancel
                                    }: Readonly<DeleteModalProps>) {
    const colors = Colors.dark;

    return (
        <Modal transparent animationType="fade" visible={visible} statusBarTranslucent={true}>
            <View style={styles.modalBackground}>
                <View style={[styles.modalContent, {backgroundColor: colors.background}]}>
                    <Text style={[styles.modalText, {color: colors.subtitle}]}>
                        Bist du dir sicher, dass du{'\n\n'}
                        <Text style={{fontWeight: 'bold'}}>{title}</Text>{'\n\n'}
                        löschen möchtest?
                    </Text>

                    <View style={styles.modalButtonRow}>
                        <TouchableOpacity
                            style={[styles.modalButton, {backgroundColor: 'crimson'}]}
                            onPress={onConfirm}>
                            <Text style={styles.closeButtonText}>Löschen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, {backgroundColor: colors.primary}]}
                            onPress={onCancel}>
                            <Text style={styles.closeButtonText}>Abbrechen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
