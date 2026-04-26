import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingParamList = {
  Welcome: undefined;
  PetRegister: undefined;
};

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<OnboardingParamList, 'Welcome'>>();

  return (
    <View style={styles.container}>
      <Text>Welcomeページ</Text>
      <Button onPress={() => navigation.navigate('PetRegister')}>
        次へ
      </Button>
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
