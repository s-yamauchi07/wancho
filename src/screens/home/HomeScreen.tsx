import { useEffect } from 'react';
import { usePetStore } from '@/store/petStore';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Avatar } from '@tamagui/avatar';
import { Progress } from '@tamagui/progress';
import { fontSizes, lineHeights, wanchoColors } from '../../../tamagui.config';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';
import { PieChart } from 'react-native-gifted-charts';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const { fetchPets, pets } = usePetStore();
  const { fetchExpensesByMonth, monthlyExpenses } = useExpenseStore();
  const selectedMonth = new Date().toISOString().slice(0,7);
  const pet = pets[0];
  const displayedMonth = Number(selectedMonth.split('-')[1]); 
  const totalAmount = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  // TODO: 積立機能ができたらplaceholderを変更する
  const savingGoal = 10000;
  const monthlySaving = 6000;
  const achievementRate = Math.floor(monthlySaving / savingGoal * 100);

  useEffect(() => {
    fetchPets();
    fetchExpensesByMonth(selectedMonth);
  },[]);
  

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

  // chartの汎用ラベル表示
  const renderLabelComponent = (data: { value: number, color: string, label: string }[]) => {
    return data.map(({ value, color, label }) => (
      <XStack 
        key={label} 
        justifyContent="space-between"
        paddingBottom={4}
        borderBottomWidth={1}
        borderBottomColor={wanchoColors.sage}
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
            fontSize={fontSizes.body}
          >
            {label}
          </SizableText>
        </XStack>
        <SizableText 
          color={wanchoColors.charcoal}
          fontSize={fontSizes.body}
        >
          ¥{value}
        </SizableText>
      </XStack>
    ));
  };


  // TODO: 今後nullではなくloadingのコンポーネントを表示させるように改修する。
  if (!pet) return null;
  return (
    <ScrollView>
      <YStack flex={1} backgroundColor="$ivory">
        <YStack padding={16} gap={16} paddingBottom={32}>
          <YStack
            backgroundColor="$ivory"
            borderRadius={12}
            padding={16}
            alignItems="center"
            gap={12}
          >
            <Avatar circular size="$12">
              {pet.photoUri == null ? (
                <Avatar.Image src={require('../../../assets/pet-registration/pet_avatar_default.png')} />
              ) : (
                <Avatar.Image src={pet.photoUri} />
              )}
            </Avatar>
            <SizableText 
              fontSize={fontSizes.heading1} 
              color={wanchoColors.charcoal}
              fontWeight="bold"
            >
              {pet.name}
            </SizableText>
          </YStack>

          {/* カテゴリ別グラフセクション */}
          <YStack
            backgroundColor="$white"
            borderRadius={12}
            padding={16}
            gap={16}
          >
            <SizableText fontSize={fontSizes.title} lineHeight={lineHeights.title} fontWeight="bold" color={wanchoColors.charcoal}>
              今月の支出({displayedMonth}月) ¥{totalAmount.toLocaleString()}
            </SizableText>
            {chartData.length > 0 ? (
              <YStack gap={16} alignItems="center">
                <PieChart
                  data={chartData}
                  radius={100}
                  innerRadius={50}
                  donut
                />
                <YStack width="100%">
                  <YStack gap={4}>
                    {renderLabelComponent(chartData)}
                  </YStack>
                </YStack>
              </YStack>
            ) : (
              <SizableText fontSize={fontSizes.body} color="$greige">
                今月の支出はありません
              </SizableText>
            )}
          </YStack>

          {/* 積立目標プログレスバーセクション */}
          <YStack
            backgroundColor="$white"
            borderRadius={12}
            padding={16}
            gap={12}
          >
            <SizableText fontSize={fontSizes.title} lineHeight={lineHeights.title} fontWeight="bold" color="$charcoal">
              積立目標
            </SizableText>
            <XStack justifyContent="space-between">
              <SizableText>目標金額: ¥{savingGoal}/月</SizableText>
              <XStack>
                <SizableText fontSize={fontSizes.title}>{achievementRate}</SizableText>
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
              <SizableText fontWeight="bold">¥{monthlySaving}</SizableText>
              <SizableText fontWeight="bold">/</SizableText>
              <SizableText>¥{savingGoal}</SizableText>
            </XStack>
          </YStack>

          {/* 最近の支出セクション */}
          <YStack gap={8}>
            <XStack justifyContent="space-between" alignItems="center">
              <SizableText fontSize={fontSizes.heading2} fontWeight="bold" color="$charcoal">
                最近の支出
              </SizableText>
            </XStack>
            <YStack backgroundColor="$white" borderRadius={12}>
            </YStack>
          </YStack>

        </YStack>
      </YStack>
    </ScrollView>
  );
}
