import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SpaceCard from './SpaceCard';
import { useSpaces } from '@/hooks/useSpaces';
import { useTasks } from '@/hooks/useTasks';
import { Space } from '@/types/space';
import CreateSpaceModal from '@/components/Modals/CreateSpaceModal';
import { createSpace, updateSpace } from '@/services/spaceService';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';

interface SpaceListProps {
  shouldShowModal?: boolean;
}

const SpaceList = ({ shouldShowModal }: SpaceListProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [spaceToEdit, setSpaceToEdit] = useState<Space | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { user } = useAuth();

  const { data: spaces = [], isLoading, isError } = useSpaces();
  const { data: tasks = [] } = useTasks();

  const handleEdit = (space: Space) => {
    setSpaceToEdit(space);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (shouldShowModal) {
      setIsModalVisible(true);
    }
  }, [shouldShowModal]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.scrollView, { overflow: 'visible' }]}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isLoading && <Text style={{ color: 'white' }}>Lade Spaces...</Text>}
        {isError && <Text style={{ color: 'red' }}>Fehler beim Laden</Text>}

        {spaces.map((space: Space) => (
          <SpaceCard
            key={space.id}
            space={space}
            tasks={tasks.filter(t => t.spaceId === space.id)}
            onEdit={handleEdit}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
          />
        ))}
      </ScrollView>

      {isModalVisible && (
        <CreateSpaceModal
          isVisible={isModalVisible}
          initialData={spaceToEdit || undefined}
          isEditing={!!spaceToEdit}
          existingSpaces={spaces}
          onDone={async (name, colorKey) => {
            try {
              if (spaceToEdit) {
                await updateSpace(spaceToEdit.id, { colorKey });
              } else {
                await createSpace({ name, colorKey, userId: user!.id });
              }
              await queryClient.invalidateQueries({ queryKey: ['spaces'] });
            } catch (error) {
              console.error(
                'Fehler beim Erstellen/Aktualisieren des Spaces:',
                error,
              );
            } finally {
              setIsModalVisible(false);
              setSpaceToEdit(null);
            }
          }}
          onClose={() => {
            setIsModalVisible(false);
            setSpaceToEdit(null);
          }}
        />
      )}
    </View>
  );
};

export default SpaceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
