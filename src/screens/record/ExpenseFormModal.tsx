import { Modal, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Button } from '@tamagui/button';
import { Input } from '@tamagui/input';
import { Ionicons } from '@expo/vector-icons';
import CategoryGrid from '@/components/record/CategoryGrid';
import { CATEGORIES } from '../../constants/categories';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { usePetStore } from '@/store/petStore';
import { useExpenseStore } from '@/store/expenseStore';
import ErrorAlertDialog from '@/components/ErrorAlertDialog';
import { Expense } from '@/types/expense';

type Props = {
  visible: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
};

const expenseSchema = z.object({
  categoryId: z.int(),
  amount: z.coerce.number<number>().int().min(1,'0円以上を入力してください'),
  date: z.date(),
  memo: z.string().nullable()
})

type ExpenseSchema = z.infer<typeof expenseSchema>;

export default function ExpenseFormModal({ visible, onClose, editingExpense }: Props) {
  const [show, setShow] = useState(false);
  const pets = usePetStore((state) => state.pets);
  const { addExpense, updateExpense, isLoading, error } = useExpenseStore();
  const [showError, setShowError] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      categoryId: undefined,
      date: new Date(),
      memo: null,
    }
  });

  useEffect(() => {
    if(visible) {
      editingExpense ? reset({...editingExpense, date: new Date(editingExpense.date + 'T00:00:00') }) : reset()
    }
  },[visible, editingExpense]);

  const onSubmit = async (data: ExpenseSchema) => {
    const formattedDate = data.date.toISOString().split('T')[0];

    if(editingExpense) {
      await updateExpense(editingExpense.id, {...data, date: formattedDate})
    } else {
      const petId = pets[0]?.id;
      if(!petId) {
        setShowError(true);
        return;
      }
      await addExpense({...data, date: formattedDate, petId})
    }
    const { error: storeError } = useExpenseStore.getState();
    if (storeError) {
      setShowError(true);
      return;
    }
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
          <YStack flex={1} backgroundColor="$ivory">

            {/* ヘッダー */}
            <XStack
              paddingHorizontal={16}
              paddingVertical={12}
              justifyContent="space-between"
              alignItems="center"
              borderBottomWidth={1}
              borderBottomColor="$lightGray"
            >
              <SizableText fontSize={fontSizes.heading2} fontWeight="bold" color="$charcoal">
                {editingExpense ? '支出を編集' : '支出を追加'}
              </SizableText>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color={wanchoColors.charcoal} />
              </Pressable>
            </XStack>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
            >
              {/* 日付 */}
              <Controller
                control={control}
                name="date"
                render={({ field: {value, onChange}}) => 
                  <YStack gap={8}>
                    <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
                      日付
                    </SizableText>
                    {/* TODO: 日付選択の実装 */}
                    {show &&
                      <RNDateTimePicker
                        value={value}
                        display="inline"
                        locale="jp"
                        onChange={(_, selectedDate) => {
                          if (selectedDate) onChange(selectedDate);
                          setShow(false);
                        }}
                      />
                    }
                    <Pressable onPress={() => setShow(true)}>
                      <XStack
                        backgroundColor="$white"
                        borderRadius={8}
                        padding={12}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <SizableText fontSize={fontSizes.body} color="$charcoal">
                          {`${value.getFullYear()}/${String(value.getMonth() + 1).padStart(2, '0')}/${String(value.getDate()).padStart(2, '0')}`}
                        </SizableText>
                        <Ionicons name="calendar-outline" size={20} color={wanchoColors.greige} />
                      </XStack>
                    </Pressable>
                  </YStack>
                }
              />
              <YStack>
              {errors.date && 
                <SizableText fontSize={fontSizes.footnote} color="$firebrick">
                  日付を選択してください
                </SizableText>
              }
              </YStack>

              {/* 金額 */}
              <YStack gap={8}>
                <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
                  金額
                </SizableText>
                <XStack
                  backgroundColor="$white"
                  borderRadius={8}
                  paddingHorizontal={12}
                  alignItems="center"
                  gap={4}
                >
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, value }}) => 
                      <Input
                        flex={1}
                        unstyled
                        placeholder="0"
                        keyboardType="numeric"
                        value={value != null ? String(value) : ''}
                        onChangeText={onChange}
                        fontSize={fontSizes.body}
                        color="$charcoal"
                        paddingVertical={12}
                      />
                    }
                  />
                  <SizableText fontSize={fontSizes.body} color="$greige">
                    円
                  </SizableText>
                </XStack>
              </YStack>
              <YStack>
              {errors.amount && 
                <SizableText fontSize={fontSizes.footnote} color="$firebrick">
                  金額を入力してください。
                </SizableText>
              }
              </YStack>
              <YStack gap={24}>
                {/* カテゴリ選択 */}
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field: { value, onChange }}) => 
                  <YStack gap={8}>
                    <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
                      カテゴリ
                    </SizableText>
                    <CategoryGrid
                      categories={CATEGORIES}
                      selectedCategoryId={value ?? null}
                      onSelect={onChange}
                    />
                  </YStack>
                  } 
                />
                <YStack>
                {errors.categoryId && 
                  <SizableText fontSize={fontSizes.footnote} color="$firebrick">
                    カテゴリを選択してください
                  </SizableText>
                }
              </YStack>

              {/* メモ */}
              <YStack gap={8}>
                <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
                  メモ（任意）
                </SizableText>
                <Controller 
                  control={control}
                  name="memo"
                  render={({ field: { onChange, value }}) => 
                    <Input
                      unstyled
                      placeholder="メモを入力"
                      value={value ?? ''} 
                      onChangeText={onChange}
                      fontSize={fontSizes.body}
                      color="$charcoal"
                      backgroundColor="$white"
                      borderRadius={8}
                      padding={12}
                      multiline
                      numberOfLines={3}
                    />
                  }
                />
              </YStack>
              </YStack>
              {/* 保存ボタン */}
              {/* TODO: isLoading 中はローディング表示に切り替える */}
              <YStack paddingHorizontal={16} paddingVertical={16}>
                <Button
                  backgroundColor="$sage"
                  borderRadius={30}
                  borderWidth={0}
                  pressStyle={{ opacity: 0.8 }}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading === true}
                >
                  <Button.Text fontSize={fontSizes.body} color="$white" fontWeight="bold">
                    {isLoading ? "保存中..." : "保存" }
                  </Button.Text>
                </Button>
              </YStack>
            </ScrollView>

            <ErrorAlertDialog
              open={showError}
              onOpenChange={setShowError}
              title="エラーが発生しました"
              description={error}
            />
          </YStack>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: wanchoColors.ivory,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
