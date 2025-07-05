import React, { useState } from 'react';
import Container from '@/components/Container';
import SpaceList from './../../components/space/SpaceList';
import Title from '@/components/Title';
import { StyleSheet } from 'react-native';
import useTheme from '@/hooks/useTheme';

const Space = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const colors = useTheme();

  return (
    <Container>
      <Title style={styles.title}>Spaces</Title>
      <SpaceList shouldShowModal={shouldShowModal} />
    </Container>
  );
};

export default Space;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 10,
    zIndex: 100,
  },
});
