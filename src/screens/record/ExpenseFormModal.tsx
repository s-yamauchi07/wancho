import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Pressable, StyleSheet } from 'react-native';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Button } from '@tamagui/button';
import { Input } from '@tamagui/input';
import { Ionicons } from '@expo/vector-icons';
import CategoryGrid from '@/components/record/CategoryGrid';
import { CATEGORIES } from '../../constants/categories';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import RNDateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ExpenseFormModal({ visible, onClose }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [show, setShow] = useState(false);

  // TODO: React Hook Form + Zod でバリデーションを追加する
  // TODO: 保存時に useExpenseStore().addExpense() を呼ぶ
  const handleSubmit = () => {
    console.log({ selectedCategoryId, date, amount, memo });
    onClose();
  };

  const pickDate = (selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    setShow(false);
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
              支出を追加
            </SizableText>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={wanchoColors.charcoal} />
            </Pressable>
          </XStack>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <YStack gap={24}>

              {/* カテゴリ選択 */}
              <YStack gap={8}>
                <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
                  カテゴリ
                </SizableText>
                <CategoryGrid
                  categories={CATEGORIES}
                  selectedCategoryId={selectedCategoryId}
                  onSelect={setSelectedCategoryId}
                />
              </YStack>

              {/* 日付 */}
              <YStack gap={8}>
                <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
                  日付
                </SizableText>
                {/* TODO: 日付選択の実装 */}
                {show && 
                  <RNDateTimePicker
                    value={date}
                    display="inline"
                    locale="jp"
                    onChange={(_, selectedDate) => pickDate(selectedDate)}
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
                      {`${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`}
                    </SizableText>
                    <Ionicons name="calendar-outline" size={20} color={wanchoColors.greige} />
                  </XStack>
                </Pressable>
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
                  {/* TODO: バリデーション（数字のみ・必須）を追加する */}
                  <Input
                    flex={1}
                    unstyled
                    placeholder="0"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    fontSize={fontSizes.body}
                    color="$charcoal"
                    paddingVertical={12}
                  />
                  <SizableText fontSize={fontSizes.body} color="$greige">
                    円
                  </SizableText>
                </XStack>
              </YStack>

              {/* メモ */}
              <YStack gap={8}>
                <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
                  メモ（任意）
                </SizableText>
                <Input
                  unstyled
                  placeholder="メモを入力"
                  value={memo}
                  onChangeText={setMemo}
                  fontSize={fontSizes.body}
                  color="$charcoal"
                  backgroundColor="$white"
                  borderRadius={8}
                  padding={12}
                  multiline
                  numberOfLines={3}
                />
              </YStack>

            </YStack>
          </ScrollView>

          {/* 保存ボタン */}
          {/* TODO: isLoading 中はローディング表示に切り替える */}
          <YStack paddingHorizontal={16} paddingBottom={16}>
            <Button
              backgroundColor="$sage"
              borderRadius={30}
              borderWidth={0}
              pressStyle={{ opacity: 0.8 }}
              onPress={handleSubmit}
            >
              <Button.Text fontSize={fontSizes.body} color="$white" fontWeight="bold">
                保存
              </Button.Text>
            </Button>
          </YStack>

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
  },
});
