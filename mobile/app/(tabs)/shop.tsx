import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import useTheme from '@/hooks/useTheme';
import { buyBonus, fetchBonuses } from '@/services/shopService';
import { useUserData } from '@/hooks/useUserData';
import { Bonus } from '@/types/bonus';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import BonusAlreadyActiveModal from '@/components/shop/BonusAlreadyActiveModal';
import NotEnoughCoinsModal from '@/components/shop/NotEnoughCoinsModal';
import UnknownErrorModal from '@/components/shop/UnknownErrorModal';
import PurchaseSuccessfulModal from '@/components/shop/PurchaseSuccessful';
import { queryClient } from '@/lib/queryClient';

const coinIcon = require('../../assets/images/icons/gamification/coin.png');

const getIconForBonusType = (type: string) => {
  switch (type) {
    case 'HEALTH':
      return <Ionicons name="heart" size={24} color="#e74c3c" />;
    case 'XP_BOOST':
      return <Ionicons name="star" size={24} color="#f1c40f" />;
    case 'StreakFreeze':
      return <Ionicons name="snow" size={24} color="#AEE5F9" />;
    default:
      return null;
  }
};

const ShopTab = ({
  items,
  colors,
  userData,
  setShowCoinsModal,
  setShowBonusAlreadyActiveModal,
  setShowUnknownErrorModal,
  setShowPurchaseSuccessfulModal,
}: {
  items: Bonus[];
  colors: any;
  userData: any;
  setShowCoinsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBonusAlreadyActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUnknownErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPurchaseSuccessfulModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <View style={styles.tabContainer}>
    {items.map(offer => (
      <Pressable
        key={offer.id}
        style={[styles.offerCard, { backgroundColor: colors.card }]}
        onPress={async () => {
          if (!userData) return;

          if (userData.coins < offer.cost) {
            setShowCoinsModal(true);
            return;
          }

          try {
            const response = await buyBonus(offer.id, userData.id);
            setShowPurchaseSuccessfulModal(true);
            await queryClient.invalidateQueries({ queryKey: ['userData'] });
          } catch (err: any) {
            const message = err?.message || '';

            if (message.includes('Bonus mit selben Typ bereits aktiv')) {
              setShowBonusAlreadyActiveModal(true);
            } else {
              setShowUnknownErrorModal(true);
            }
          }
        }}
      >
        <View style={styles.offerContent}>
          <Text style={[styles.offerTitle, { color: colors.title }]}>
            {offer.name} {getIconForBonusType(offer.type)}
          </Text>
        </View>
        <View style={styles.offerFooter}>
          <Image source={coinIcon} style={styles.coinIcon} />
          <Text style={styles.offerPrice}> {offer.cost} </Text>
        </View>
      </Pressable>
    ))}
  </View>
);

const Shop = () => {
  const colors = useTheme();
  const layout = Dimensions.get('window');

  const { data: userData } = useUserData();
  const queryClient = useQueryClient();

  const { data: allBonuses = [], isLoading } = useQuery<Bonus[]>({
    queryKey: ['bonuses'],
    queryFn: fetchBonuses,
  });

  const xpBonuses = allBonuses.filter(b => b.type === 'XP_BOOST');
  const healthBonuses = allBonuses.filter(b => b.type === 'HEALTH');
  const streakBonuses = allBonuses.filter(b => b.type === 'StreakFreeze');

  const [showCoinsModal, setShowCoinsModal] = useState(false);
  const [showBonusAlreadyActiveModal, setShowBonusAlreadyActiveModal] =
    useState(false);
  const [showUnknownErrorModal, setShowUnknownErrorModal] = useState(false);
  const [showPurchaseSuccessfulModal, setShowPurchaseSuccessfulModal] =
    useState(false);
  const [activeTab, setActiveTab] = useState<'xp' | 'skip' | 'health'>('xp');
  return (
    <Container>
      <Text style={[styles.title, { color: colors.title }]}>
        Shop <Ionicons name="pricetag-outline" size={22} />
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 20,
        }}
      >
        <Pressable onPress={() => setActiveTab('xp')}>
          <Text
            style={[
              styles.tabButton,
              activeTab === 'xp' && styles.activeTabButton,
            ]}
          >
            XP Boosts
          </Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('skip')}>
          <Text
            style={[
              styles.tabButton,
              activeTab === 'skip' && styles.activeTabButton,
            ]}
          >
            Streak Freeze
          </Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('health')}>
          <Text
            style={[
              styles.tabButton,
              activeTab === 'health' && styles.activeTabButton,
            ]}
          >
            Health
          </Text>
        </Pressable>
      </View>

      {activeTab === 'xp' && (
        <ShopTab
          items={xpBonuses}
          colors={colors}
          userData={userData}
          setShowCoinsModal={setShowCoinsModal}
          setShowBonusAlreadyActiveModal={setShowBonusAlreadyActiveModal}
          setShowUnknownErrorModal={setShowUnknownErrorModal}
          setShowPurchaseSuccessfulModal={setShowPurchaseSuccessfulModal}
        />
      )}

      {activeTab === 'skip' && (
        <ShopTab
          items={streakBonuses}
          colors={colors}
          userData={userData}
          setShowCoinsModal={setShowCoinsModal}
          setShowBonusAlreadyActiveModal={setShowBonusAlreadyActiveModal}
          setShowUnknownErrorModal={setShowUnknownErrorModal}
          setShowPurchaseSuccessfulModal={setShowPurchaseSuccessfulModal}
        />
      )}

      {activeTab === 'health' && (
        <ShopTab
          items={healthBonuses}
          colors={colors}
          userData={userData}
          setShowCoinsModal={setShowCoinsModal}
          setShowBonusAlreadyActiveModal={setShowBonusAlreadyActiveModal}
          setShowUnknownErrorModal={setShowUnknownErrorModal}
          setShowPurchaseSuccessfulModal={setShowPurchaseSuccessfulModal}
        />
      )}
      <NotEnoughCoinsModal
        visible={showCoinsModal}
        onClose={() => setShowCoinsModal(false)}
      />
      <BonusAlreadyActiveModal
        visible={showBonusAlreadyActiveModal}
        onClose={() => setShowBonusAlreadyActiveModal(false)}
      />
      <UnknownErrorModal
        visible={showUnknownErrorModal}
        onClose={() => setShowUnknownErrorModal(false)}
      />
      <PurchaseSuccessfulModal
        visible={showPurchaseSuccessfulModal}
        onClose={() => setShowPurchaseSuccessfulModal(false)}
      />
    </Container>
  );
};

export default Shop;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 10,
  },
  tabContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 20,
  },
  offerCard: {
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  offerContent: {
    padding: 20,
    justifyContent: 'center',
  },
  offerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#2c2a37',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  offerTitle: {
    fontSize: 22,
  },
  offerPrice: {
    color: '#efd632',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: 'gray',
    fontSize: 16,
  },
  activeTabButton: {
    color: 'white',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
