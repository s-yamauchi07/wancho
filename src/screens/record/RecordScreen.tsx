import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@tamagui/button';
import { FontAwesome6 } from '@expo/vector-icons';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import ExpenseFormModal from './ExpenseFormModal';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecordStackParamList } from '@/navigation/RecordNavigator';

function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return `${year}年${month}月`;
}

function shiftMonth(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${Number(month)}/${Number(day)}`;
}

function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}


export default function RecordScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { 
    fetchExpensesByMonth,
    monthlyExpenses, 
    selectedMonth, 
    setSelectedMonth 
  } = useExpenseStore();  
  const expenses = monthlyExpenses;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const navigation = useNavigation<NativeStackNavigationProp<RecordStackParamList, 'RecordMain'>>();
  
  useEffect(() => {
    fetchExpensesByMonth(selectedMonth);
  }, [selectedMonth]);

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const category = CATEGORIES.find((c) => c.id === item.categoryId)
    return (
      <Pressable onPress={() => {}}>
        <XStack
          paddingVertical={12}
          paddingHorizontal={16}
          backgroundColor="$white"
          borderRadius={12}
          marginBottom={8}
          alignItems="center"
          gap={12}
        >
          {/* カテゴリアイコン（仮: 丸背景） */}
          <YStack
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor={category?.bgColor}
            alignItems="center"
            justifyContent="center"
          >
            <SizableText fontSize={fontSizes.caption} color="$white">
              <FontAwesome6 name={category?.icon} size={20} />
            </SizableText>
          </YStack>

          {/* カテゴリ名・メモ */}
          <YStack flex={1}>
            <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
              {category?.name}
            </SizableText>
            <XStack gap={4}>
              <SizableText fontSize={fontSizes.caption} color="$greige">
                {formatDate(item.date)}
              </SizableText>
              {item.memo && (
                <SizableText fontSize={fontSizes.caption} color="$greige">
                  {item.memo}
                </SizableText>
              )}
            </XStack>
          </YStack>

          {/* 金額・日付 */}
          <YStack alignItems="flex-end">
            <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
              {formatAmount(item.amount)}
            </SizableText>
          </YStack>
        </XStack>
      </Pressable>
    )
  };

  return (
    <YStack flex={1} backgroundColor="$ivory">
      {/* 月切り替え */}
      <XStack
        paddingHorizontal={24}
        paddingVertical={16}
        justifyContent="space-between"
        alignItems="center"
      >
        <Pressable onPress={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}>
          <FontAwesome6 name="arrow-left" size={24} color={wanchoColors.charcoal} />
        </Pressable>
        <SizableText fontSize={fontSizes.heading1} fontWeight="bold" color="$charcoal">
          {formatMonth(selectedMonth)}
        </SizableText>
        <Pressable onPress={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}>
          <FontAwesome6 name="arrow-right"size={24} color={wanchoColors.charcoal} />
        </Pressable>
      </XStack>

      {/* 合計金額 */}
      <YStack
        marginHorizontal={16}
        padding={16}
        backgroundColor="$white"
        borderRadius={12}
        marginBottom={24}
        gap={4}
      >
        <SizableText fontSize={fontSizes.footnote} color="$greige">
          今月の合計
        </SizableText>
        <SizableText 
          fontSize={fontSizes.display}
          lineHeight={fontSizes.display * 1.5}
          fontWeight="bold"
          color="$charcoal"
        >
          {formatAmount(totalAmount)}
        </SizableText>
      </YStack>

      {/* 最近の支出・全て見る */}
      <XStack 
        justifyContent="space-between" 
        paddingHorizontal={16} 
        marginBottom={8}
      >
        <SizableText
          fontSize={fontSizes.title}
          lineHeight={fontSizes.title * 1.5}
          color="$charcoal"
        >
          最近の支出
        </SizableText>
        <Pressable onPress={() => navigation.navigate('AllRecords')}>
          <SizableText fontSize={fontSizes.footnote} color="$sage" fontWeight="bold">
            全て見る →
          </SizableText>
        </Pressable>
      </XStack>

      {/* 支出一覧 */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={60}>
            <SizableText fontSize={fontSizes.body} color="$greige">
              記録がありません
            </SizableText>
          </YStack>
        }
      />

      {/* FAB */}
      <Button
        position="absolute"
        bottom={24}
        right={24}
        width={56}
        height={56}
        borderRadius={28}
        backgroundColor="$sage"
        borderWidth={0}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome6 name="add" size={22} color={wanchoColors.white} />
      </Button>

      {/* 支出追加モーダル */}
      <ExpenseFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
});
