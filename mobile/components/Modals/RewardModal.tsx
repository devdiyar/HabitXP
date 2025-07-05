import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Colors } from '@/constants/Colors';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface RewardItem {
  label: string;
  value: number | string;
}

interface RewardModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  rewards?: RewardItem[];
  animationType?: 'confetti' | 'flame' | 'none';
}

export default function RewardModal({
  visible,
  onClose,
  title,
  description = 'Du hast folgendes erhalten:',
  rewards = [],
  animationType = 'none',
}: Readonly<RewardModalProps>) {
  const theme = Colors['dark'];
  const flameAnimations = useRef<Animated.Value[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      flameAnimations.current = [...Array(10)].map(() => new Animated.Value(0));

      if (animationType === 'flame') {
        flameAnimations.current.forEach((anim, i) => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500 + i * 100,
            useNativeDriver: true,
          }).start();
        });
      }
    }
  }, [visible, onClose, animationType]);

  const renderFlames = () => {
    return flameAnimations.current.map((anim, i) => {
      const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100 - Math.random() * 50],
      });

      const opacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      });

      const translateX = (Math.random() - 0.5) * 150;

      return (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            top: height / 2,
            left: width / 2,
            transform: [{ translateX: translateX }, { translateY: translateY }],
            opacity: opacity,
          }}
        >
          <Ionicons name="flame" size={40} color="#FF5722" />
        </Animated.View>
      );
    });
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.modalBackground}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.background }]}
        >
          <Text style={[styles.modalTitle, { color: theme.title }]}>
            {title}
          </Text>
          <Text style={[styles.modalText, { color: theme.subtitle }]}>
            {description}
          </Text>

          {rewards.map((reward, index) => (
            <Text
              key={index}
              style={[styles.rewardText, { color: theme.title }]}
            >
              {reward.label}: {reward.value}
            </Text>
          ))}

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>

        {animationType === 'flame' && renderFlames()}
        {animationType === 'confetti' && (
          <ConfettiCannon
            count={150}
            origin={{ x: width / 2, y: height }}
            explosionSpeed={400}
            fallSpeed={3000}
            fadeOut
          />
        )}
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
  },
  rewardText: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: '600',
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
