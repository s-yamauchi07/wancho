import { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Dimensions,
  ViewToken,
  ImageSourcePropType,
} from 'react-native';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Button } from '@tamagui/button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fontSizes } from '../../../tamagui.config';

type OnboardingParamList = {
  Welcome: undefined;
  PetRegister: undefined;
};

type Slide = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const slides: Slide[] = [
  {
    id: '1',
    image: require('../../../assets/onboarding/slide1.png'),
    title: 'wanchoへようこそ',
    description: 'ペットとの毎日をもっと豊かに。\nわんちゃんにかかる支出をかんたんに記録・管理できます。',
  },
  {
    id: '2',
    image: require('../../../assets/onboarding/slide2.png'),
    title: '支出を見える化しよう',
    description: '医療費・フード・おやつなど\nカテゴリ別に支出を記録して毎月の傾向をチェックできます。',
  },
  {
    id: '3',
    image: require('../../../assets/onboarding/slide3.png'),
    title: '積立目標を立てよう',
    description: '将来の医療費に備えて\n毎月の積立目標を設定し達成度を確認できます。',
  },
];

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<OnboardingParamList, 'Welcome'>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // NOTE: viewableItemsは今画面に表示されている要素を返す。
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
    <YStack flex={1} backgroundColor="$ivory">
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <YStack
            width={width}
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingHorizontal={40}
            gap={24}
          >
            <Image
              source={item.image}
              style={{ width: width * 0.7, height: width * 0.7 * 1.5 }}
              resizeMode="contain"
              accessibilityLabel={item.title}
            />
            <SizableText fontSize={fontSizes.heading1} fontWeight="bold" textAlign="center" color="$charcoal">
              {item.title}
            </SizableText>
            <SizableText fontSize={fontSizes.body} textAlign="center" color="$greige" lineHeight={22}>
              {item.description}
            </SizableText>
          </YStack>
        )}
      />

      <YStack paddingBottom={60} alignItems="center" gap={20}>
        <XStack gap={8}>
          {slides.map((_, index) => (
            <YStack
              key={index}
              height={8}
              borderRadius={4}
              width={currentIndex === index ? 20 : 8}
              backgroundColor={currentIndex === index ? '$sage' : '$sandBeige'}
            />
          ))}
        </XStack>

        <Button
          onPress={handleNext}
          backgroundColor="$sage"
          paddingVertical={10}
          paddingHorizontal={48}
          borderRadius={30}
          pressStyle={{ opacity: 0.8 }}
          borderWidth={0}
        >
          <Button.Text color="$white" fontSize={fontSizes.body} fontWeight="bold">
            {currentIndex === slides.length - 1 ? 'はじめる' : '次へ'}
          </Button.Text>
        </Button>

        <SizableText
          onPress={() => navigation.navigate('PetRegister')}
          color="$greige"
          fontSize={fontSizes.body}
        >
          スキップ
        </SizableText>
      </YStack>
    </YStack>
  );
}
