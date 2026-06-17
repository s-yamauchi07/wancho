import { useCallback, useEffect } from 'react';
import { FlatList, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { PieChart } from 'react-native-gifted-charts';
import { ScrollView } from 'react-native-gesture-handler';
import { HomeStackParamList } from '@/navigation/HomeNavigator';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Avatar } from '@tamagui/avatar';
import { Progress } from '@tamagui/progress';
import { fontSizes, lineHeights, wanchoColors } from '../../../tamagui.config';
import { usePetStore } from '@/store/petStore';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';
import { SwipeableExpenseRow } from '@/components/record/SwipeableExpenseRow'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function HomeScreen() {
  const { fetchPets, pets } = usePetStore();
  const { 
    fetchExpensesByMonth, 
    monthlyExpenses,
    setSelectedMonth
  } = useExpenseStore();
  const getCurrentYearMonth = () => {
    return new Date().toISOString().slice(0,7);
  }

  const pet = pets[0];
  const totalAmount = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  // TODO: 積立機能ができたらplaceholderを変更する
  const savingGoal = 10000;
  const monthlySaving = 6000;
  const achievementRate = Math.floor(monthlySaving / savingGoal * 100);

  const recentExpenses = [...monthlyExpenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0,3);

  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>>();

  useEffect(() => {
    fetchPets();
  },[]);

  useFocusEffect(useCallback(() => {
    const currentMonth = getCurrentYearMonth();
    setSelectedMonth(currentMonth);
    fetchExpensesByMonth(currentMonth);
  },[]));
  
  const displayedMonth = Number(getCurrentYearMonth().split('-')[1]);

  // カテゴリごとにグループ分けする
  const groupByCategory = (expenses: Expense[]) => {
    const grouped = expenses.reduce<Record<number, number>>((acc, expense) => {
      const key = expense.categoryId;
      const amount = expense.amount;
      if(!acc[key]) {
        acc[key] = 0;
      }
      acc[key] = acc[key] + amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([categoryId, amount]) => ({
      categoryId,
      amount,
    }));
  };

  // グラフ用のデータに変換する。
  const chartData = groupByCategory(monthlyExpenses)
    .reduce<{ value: number, color: string, label: string}[]>((acc, { categoryId, amount }) => {
      const category = CATEGORIES.find((c) => c.id === Number(categoryId));
      if (!category) return acc;
      acc.push({
          value: amount,
          color: category.bgColor,
          label: category.name,
        });
        return acc;
    }, []);

  // 支出がない場合はグレーのダミースライスを表示する
  const displayChartData = chartData.length > 0
    ? chartData
    : [{ value: 1, color: wanchoColors.lightGray, label: '' }];

  // chartの汎用ラベル表示
  const renderLabelComponent = (data: { value: number, color: string, label: string }[]) => {
    return data.map(({ value, color, label }) => (
      <XStack 
        key={label} 
        justifyContent="space-between"
        paddingBottom={4}
        borderBottomWidth={1}
        borderBottomColor="$sage"
      >
        <XStack 
          alignItems="center"
          gap={6} 
        >
          <XStack
            alignItems="center"
            width={10}
            height={10}
            borderRadius={5}
            backgroundColor={color}
          />
          <SizableText 
            color={wanchoColors.charcoal}
            fontSize={fontSizes.heading2}
          >
            {label}
          </SizableText>
        </XStack>
        <SizableText 
          color={wanchoColors.charcoal}
          fontSize={fontSizes.heading2}
        >
          ¥{value.toLocaleString()}
        </SizableText>
      </XStack>
    ));
  };


  // TODO: 今後nullではなくloadingのコンポーネントを表示させるように改修する。
  if (!pet) return null;
  return (
    <ScrollView
      style={{backgroundColor: wanchoColors.ivory}}
      contentContainerStyle={{ flexGrow: 1}}
    >
      <YStack>
        <YStack padding={16} gap={16}>
          <XStack
            alignItems="center"
            gap={12}
          >
            <Avatar circular size="$4">
              {pet.photoUri == null ? (
                <Avatar.Image src={require('../../../assets/pet-registration/pet_avatar_default.png')} />
              ) : (
                <Avatar.Image src={pet.photoUri} />
              )}
            </Avatar>
            <SizableText 
              fontSize={fontSizes.title} 
              lineHeight={lineHeights.title}
              color={wanchoColors.charcoal}
              fontWeight="bold"
            >
              {pet.name}ちゃん
            </SizableText>
          </XStack>

          {/* カテゴリ別グラフセクション */}
          <YStack
            backgroundColor="$white"
            borderRadius={12}
            padding={16}
            gap={16}
          >
            <SizableText fontSize={fontSizes.title} lineHeight={lineHeights.title} fontWeight="bold" color={wanchoColors.charcoal}>
              今月の支出({displayedMonth}月)
            </SizableText>
            <YStack gap={16} alignItems="center">
              <PieChart
                data={displayChartData}
                radius={100}
                strokeColor="white"
                strokeWidth={2}
                innerCircleBorderColor="white"
                innerRadius={50}
                centerLabelComponent={() => (
                  <YStack alignItems="center" gap={4}>
                    <SizableText>合計</SizableText>
                    <SizableText fontSize={fontSizes.heading1} fontWeight="bold">
                      ¥{totalAmount.toLocaleString()}
                    </SizableText>
                  </YStack>
                )}
                donut
              />
              {chartData.length > 0 && (
                <>
                  <YStack width="100%" gap={4}>
                    {renderLabelComponent(chartData)}
                  </YStack>
                  <Pressable onPress={() => navigation.navigate('AllRecords')}>
                  <XStack justifyContent="center" alignItems="center" gap={4}>
                    <SizableText fontSize={fontSizes.body} color="$greige">
                      支出の詳細を見る
                    </SizableText>
                    <FontAwesome6 name="chevron-right" size={12} />
                  </XStack>
                </Pressable>
                </>
              )}
            </YStack>
          </YStack>

          {/* 積立目標プログレスバーセクション */}
          <YStack
            backgroundColor="$white"
            borderRadius={12}
            padding={16}
            gap={12}
          >
            <SizableText 
              fontSize={fontSizes.title} 
              lineHeight={lineHeights.title} 
              fontWeight="bold" 
              color="$charcoal"
            >
              積立目標
            </SizableText>
            <XStack justifyContent="space-between">
              <SizableText>目標金額: ¥{savingGoal.toLocaleString()}/月</SizableText>
              <XStack>
                <SizableText fontSize={fontSizes.title} lineHeight={lineHeights.heading2}>
                  {achievementRate.toLocaleString()}
                </SizableText>
                <SizableText fontSize={fontSizes.heading2}>%</SizableText>
              </XStack>
            </XStack>
            <Progress value={achievementRate}>
              <Progress.Indicator 
                transition="bouncy" 
                backgroundColor={wanchoColors.sage}
              />
            </Progress>
            <XStack gap={6} justifyContent="flex-end">
              <SizableText fontWeight="bold">¥{monthlySaving.toLocaleString()}</SizableText>
              <SizableText fontWeight="bold">/</SizableText>
              <SizableText>¥{savingGoal.toLocaleString()}</SizableText>
            </XStack>
          </YStack>

          <YStack 
            backgroundColor="$white"
            borderRadius={12}
            paddingVertical={16}
            gap={8}
          >
            <XStack 
              justifyContent="space-between" 
              alignItems="center"
              paddingHorizontal={16} 
              marginBottom={8}
            >
              <SizableText
                fontSize={fontSizes.title}
                lineHeight={lineHeights.title}
                fontWeight="bold"
                color="$charcoal"
              >
                最近の支出
              </SizableText>
              {chartData.length > 0 && (
                <Pressable onPress={() => navigation.navigate('AllRecords')}>
                  <SizableText fontSize={fontSizes.body} color="$sage" fontWeight="bold">
                    全て見る →
                  </SizableText>
                </Pressable>
              )}
            </XStack>
            {/* 支出一覧 */}
            <FlatList
              data={recentExpenses}
              scrollEnabled={false} 
              keyExtractor={(item) => String(item.id)}
              renderItem={({item}) => (
                <SwipeableExpenseRow
                  item={item}
                  showDate={true} 
                  enableSwipe={false}
                />
              )}
              ListEmptyComponent={
                <YStack 
                  flex={1} 
                  alignItems="center" 
                  justifyContent="center"
                  >
                  <SizableText fontSize={fontSizes.body} color="$greige">
                    記録がありません
                  </SizableText>
                </YStack>
              }
            />
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
