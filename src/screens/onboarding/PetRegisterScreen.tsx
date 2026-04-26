import { View, Text, StyleSheet } from 'react-native';

export default function PetRegisterScreen() {
  return (
    <View style={styles.container}>
      <Text>わんこ登録ページ</Text>
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
