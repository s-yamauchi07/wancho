import { SectionList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { SwipeableExpenseRow } from '../../components/record/SwipeableExpenseRow';
import { fontSizes, lineHeights, wanchoColors } from '../../../tamagui.config';
import { useExpenseStore } from '@/store/expenseStore';
import { CATEGORIES } from '@/constants/categories';
import { Expense } from '@/types/expense';
import ExpenseFormModal from './ExpenseFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/HomeNavigator';

type Section = {
  title: string;
  data: Expense[];
};

function formatSectionDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return `${year}年${month}月`
}

function shiftMonth(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`
}

function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

function groupByDate(expenses: Expense[]): Section[] {
  // 日付でグループ分けをする。
  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const key = expense.date;
    if (!acc[key]) {
      acc[key] = []; // 未登録のキー(日付)があれば空配列を準備
    }
    acc[key].push(expense);
    return acc;
  }, {});
  
  // SectionList用の配列を渡す関数を実装する
  return Object.keys(grouped)
    .sort((a,b) => b.localeCompare(a))
    .map((date) => ({
      title: date,
      data: grouped[date],
    }));
}

export default function AllRecordsScreen() {
  const { 
    fetchExpensesByMonth,
    monthlyExpenses, 
    selectedMonth,
    setSelectedMonth,
    deleteExpense 
  } = useExpenseStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [confirmingItem, setConfirmingItem] = useState<Expense | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'AllRecords'>>();

  const filteredExpenses = selectedCategoryId
    ? monthlyExpenses.filter((e) => e.categoryId === selectedCategoryId)
    : monthlyExpenses;

  const sections = groupByDate(filteredExpenses);
  const totalAmount = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  useEffect(() => {
    fetchExpensesByMonth(selectedMonth);
  }, [selectedMonth]);

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <YStack paddingVertical={8} paddingHorizontal={16} backgroundColor="$ivory">
      <SizableText fontSize={fontSizes.footnote} color="$greige" fontWeight="bold">
        {formatSectionDate(section.title)}
      </SizableText>
    </YStack>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <YStack flex={1} backgroundColor="$ivory">

        <XStack paddingHorizontal={16} paddingTop={16}>
          <Pressable onPress={() => navigation.goBack()}>
            <XStack alignItems="center" gap={4}>
              <FontAwesome6 name="chevron-left" color={wanchoColors.sage} />
              <SizableText color="$sage">戻る</SizableText>
            </XStack>
          </Pressable>
        </XStack>

        <XStack
          paddingHorizontal={24}
          paddingVertical={16}
          justifyContent="space-between"
          alignItems="center"
        >
          <Pressable onPress={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}>
            <FontAwesome6 name="arrow-left" size={24} color={wanchoColors.charcoal}/>
          </Pressable>
          <SizableText fontSize={fontSizes.heading1} fontWeight="bold" color="$charcoal">
            {formatMonth(selectedMonth)}
          </SizableText>
          <Pressable onPress={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}>
            <FontAwesome6 name="arrow-right" size={24} color={wanchoColors.charcoal}/>
          </Pressable>
        </XStack>

        <YStack
          marginHorizontal={16}
          padding={16}
          backgroundColor="$sage"
          borderRadius={12}
          marginBottom={24}
          gap={4}
        >
          <SizableText fontSize={fontSizes.body} color="$charcoal">
            今月の合計
          </SizableText>
          <SizableText
            fontSize={fontSizes.display}
            lineHeight={lineHeights.display}
            fontWeight="bold"
            color="$charcoal"
          >
            {formatAmount(totalAmount)}
          </SizableText>
        </YStack>

        <XStack flexWrap="wrap" paddingHorizontal={16} paddingVertical={12} gap={8}>
          <Pressable onPress={() => setSelectedCategoryId(null)}>
            <YStack
              paddingHorizontal={14}
              paddingVertical={6}
              borderRadius={20}
              borderWidth={1}
              borderColor={selectedCategoryId === null ? '$sage' : '$lightGray'}
              backgroundColor={selectedCategoryId === null ? '$sage' : '$white'}
            >
              <SizableText
                fontSize={fontSizes.caption}
                color={selectedCategoryId === null ? '$white' : '$greige'}
              >
                すべて
              </SizableText>
            </YStack>
          </Pressable>

          {CATEGORIES.map((category) => (
            <Pressable key={category.id} onPress={() => setSelectedCategoryId(category.id)}>
              <YStack
                paddingHorizontal={14}
                paddingVertical={6}
                borderRadius={20}
                borderWidth={1}
                borderColor={selectedCategoryId === category.id ? '$sage' : '$lightGray'}
                backgroundColor={selectedCategoryId === category.id ? '$sage' : '$white'}
              >
                <SizableText
                  fontSize={fontSizes.caption}
                  color={selectedCategoryId === category.id ? '$white' : '$greige'}
                >
                  {category.name}
                </SizableText>
              </YStack>
            </Pressable>
          ))}
        </XStack>

        {/* 支出一覧 */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SwipeableExpenseRow
              item={item}
              onEdit={setEditingExpense}
              onDelete={setConfirmingItem}
              showDate={false}
            />
          )}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={60}>
              <SizableText fontSize={fontSizes.body} color="$greige">
                記録がありません
              </SizableText>
            </YStack>
          }
        />
        <ExpenseFormModal
          visible={editingExpense !== null}
          onClose={() => setEditingExpense(null)}
          editingExpense={editingExpense}
        />
        <ConfirmDialog
          open={confirmingItem !== null}
          onOpenChange={(open) => { if (!open) setConfirmingItem(null); }}
          title="本当に削除しますか？"
          buttonLabel="削除する"
          onConfirm={() => {
            if (confirmingItem) deleteExpense(confirmingItem.id); 
            setConfirmingItem(null);
          }}
        />
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: wanchoColors.ivory,
  },
  listContent: {
    paddingBottom: 32,
  },
});
