import { View, Text, StyleSheet } from 'react-native';

export default function RecordScreen() {
  return (
    <View style={styles.container}>
      <Text>記録</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
