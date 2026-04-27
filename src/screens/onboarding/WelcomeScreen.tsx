import { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingParamList = {
  Welcome: undefined;
  PetRegister: undefined;
};

type Slide = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: '1',
    image: '🐾',
    title: 'wanchoへようこそ',
    description: 'ペットとの毎日をもっと豊かに。\nわんちゃんにかかる支出を\nかんたんに記録・管理できます。',
  },
  {
    id: '2',
    image: '📊',
    title: '支出を見える化しよう',
    description: '医療費・フード・おやつなど\nカテゴリ別に支出を記録して\n毎月の傾向をチェックできます。',
  },
  {
    id: '3',
    image: '🎯',
    title: '積立目標を立てよう',
    description: '将来の医療費に備えて\n毎月の積立目標を設定し\n達成度を確認できます。',
  },
];

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<OnboardingParamList, 'Welcome'>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // NOTE: viewableItemsは￥ ＝今画面に表示されている要素を返す。
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('PetRegister');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.image}>{item.image}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      
      {/* ドットインジケーターの実装 */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'はじめる' : '次へ'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('PetRegister')}>
          <Text style={styles.buttonText}>
            スキップ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  image: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 26,
  },
  footer: {
    paddingBottom: 60,
    alignItems: 'center',
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  dotActive: {
    backgroundColor: '#333',
    width: 20,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
