import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@tamagui/button';
import { FontAwesome6 } from '@expo/vector-icons';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import ExpenseFormModal from './ExpenseFormModal';
import { SwipeableExpenseRow } from '@/components/record/SwipeableExpenseRow';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense } from '@/types/expense';
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

function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

export default function RecordScreen() {
  const { 
    fetchExpensesByMonth,
    monthlyExpenses, 
    selectedMonth, 
    setSelectedMonth,
    deleteExpense
  } = useExpenseStore();  
  const expenses = monthlyExpenses;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const navigation = useNavigation<NativeStackNavigationProp<RecordStackParamList, 'RecordMain'>>();
  const [editingExpense, setEditExpense] = useState<Expense | null>(null);
  const [confirmingItem, setConfirmingItem] = useState<Expense | null>(null);
  const [ModalVisible, setModalVisible] = useState<boolean>(false);
  
  useEffect(() => {
    fetchExpensesByMonth(selectedMonth);
  }, [selectedMonth]);

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
          <FontAwesome6 name="arrow-right" size={24} color={wanchoColors.charcoal} />
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
        renderItem={({item}) => (
          <SwipeableExpenseRow
            item={item}
            onEdit={setEditExpense}
            onDelete={setConfirmingItem}
            showDate={true} 
          />
        )}
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
        visible={ModalVisible || editingExpense !== null}
        onClose={() => {
          setModalVisible(false);
          setEditExpense(null);
        }}
        editingExpense={editingExpense}
      />
      {/* 削除確認用のModal */}
      <ConfirmDialog 
        open={confirmingItem !== null}
        onOpenChange={(open) => {if (!open) setConfirmingItem(null); }}
        title='本当に削除しますか？'
        buttonLabel='削除する'
        onConfirm={() => {
          if (confirmingItem) deleteExpense(confirmingItem.id);
          setConfirmingItem(null);
        }}
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
