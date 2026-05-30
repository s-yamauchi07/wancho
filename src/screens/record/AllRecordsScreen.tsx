import { SectionList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { SwipeableExpenseRow } from '../../components/record/SwipeableExpenseRow';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import { useExpenseStore } from '@/store/expenseStore';
import { CATEGORIES } from '@/constants/categories';
import { Expense } from '@/types/expense';
import ExpenseFormModal from './ExpenseFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';

type Section = {
  title: string;
  data: Expense[];
};

function formatSectionDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${year}年${month}月${day}日`;
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
  const { monthlyExpenses, deleteExpense } = useExpenseStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [confirmingItem, setConfirmingItem] = useState<Expense | null>(null);

  const filteredExpenses = selectedCategoryId
    ? monthlyExpenses.filter((e) => e.categoryId === selectedCategoryId)
    : monthlyExpenses;

  const sections = groupByDate(filteredExpenses);
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

        {/* カテゴリフィルタータグ */}
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
