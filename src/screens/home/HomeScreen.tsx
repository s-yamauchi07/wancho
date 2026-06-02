import { useEffect } from 'react';
import { usePetStore } from '@/store/petStore';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Avatar } from '@tamagui/avatar';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';

export default function HomeScreen() {
  const { fetchPets, pets } = usePetStore();
  const { fetchExpensesByMonth, monthlyExpenses } = useExpenseStore();
  const selectedMonth = new Date().toISOString().slice(0,7);
  const pet = pets[0];

  useEffect(() => {
    fetchPets();
    fetchExpensesByMonth(selectedMonth);
  },[]);
  
  const displayedMonth = Number(selectedMonth.split('-')[1]); 
  const totalAmount = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

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

  // TODO: 今後nullではなくloadingのコンポーネントを表示させるように改修する。
  if (!pet) return null;
  return (
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

        {/* 今月の支出合計セクション */}
        <YStack
          backgroundColor="$white"
          borderRadius={12}
          padding={16}
          gap={4}
        >
          <SizableText fontSize={fontSizes.heading1} color={wanchoColors.charcoal}>
            今月の支出({displayedMonth}月): ¥{totalAmount.toLocaleString()}
          </SizableText>
        </YStack>

        {/* カテゴリ別グラフセクション */}
        <YStack
          backgroundColor="$white"
          borderRadius={12}
          padding={16}
          gap={8}
        >
          <SizableText fontSize={fontSizes.heading2} fontWeight="bold" color="$charcoal">
            カテゴリ別支出
          </SizableText>
          {/* TODO(human) 5-2: PieChart コンポーネントを配置し、5-1 のデータを渡す */}

          {/* TODO(human) 5-3: 各カテゴリの色丸・名前・金額を並べた凡例を表示する */}

          {/* TODO(human) 5-4: monthlyExpenses が空のとき「今月の支出はありません」を表示する */}
        </YStack>

        {/* 積立目標プログレスバーセクション */}
        <YStack
          backgroundColor="$white"
          borderRadius={12}
          padding={16}
          gap={8}
        >
          <SizableText fontSize={fontSizes.heading2} fontWeight="bold" color="$charcoal">
            積立目標
          </SizableText>
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
  );
}
