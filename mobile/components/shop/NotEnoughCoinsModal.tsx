import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "@/constants/Colors";

interface NotEnoughCoinsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function NotEnoughCoinsModal({visible, onClose}: Readonly<NotEnoughCoinsModalProps>) {
    const theme = Colors["dark"];

    return (
        <Modal transparent={true} animationType="fade" visible={visible}>
            <View style={styles.modalBackground}>
                <View style={[styles.modalContent, {backgroundColor: theme.background}]}>
                    <Text style={[styles.modalTitle, {color: theme.title}]}>Limit erreicht</Text>
                    <Text style={[styles.modalText, {color: theme.subtitle}]}>
                        Du hast nicht genügend Coins um diesen Bonus zu kaufen!
                    </Text>
                    <TouchableOpacity style={[styles.closeButton, {backgroundColor: theme.primary}]} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Schließen</Text>
                    </TouchableOpacity>
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
        textAlign: "center",
    },
    closeButton: {
        marginTop: 20,
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
