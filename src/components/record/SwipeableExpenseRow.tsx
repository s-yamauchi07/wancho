import { TouchableOpacity } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRef } from 'react';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { FontAwesome6 } from '@expo/vector-icons';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import { CATEGORIES } from '@/constants/categories';
import { Expense } from '@/types/expense';

type SwipeableRowProps = {
  item: Expense;
  onEdit: (item: Expense) => void;
  onDelete: (item: Expense) => void;
  showDate: boolean;
}

function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${Number(month)}/${Number(day)}`;
}

// 各費用リストの1行分のコンポーネント
export const SwipeableExpenseRow = ({
  item, 
  onEdit, 
  onDelete, 
  showDate
} : SwipeableRowProps) => {
  const category = CATEGORIES.find((c) => c.id === item.categoryId);
  const ref = useRef<SwipeableMethods | null>(null);

  const handleEdit = (item: Expense) => {
    ref.current?.close();
    onEdit(item);
  };

  const handleDelete = (item: Expense) => {
    ref.current?.close();
    onDelete(item);
  };

  const renderRightActions = (item: Expense) => {
    return (
      <XStack>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <YStack
            style={{
              backgroundColor : wanchoColors.sage,
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: '100%',
            }}
          >
            <FontAwesome6 name='edit' size={20} color={wanchoColors.white} />
            <SizableText style={{color: wanchoColors.white, fontSize: fontSizes.footnote}}>編集</SizableText>
          </YStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <YStack 
            style={{
              backgroundColor : wanchoColors.firebrick, 
              alignItems: 'center',
              justifyContent: 'center',
              width: 72, 
              height: '100%'
            }}
          >
            <FontAwesome6 name='trash-can' size={20} color={wanchoColors.white} />
            <SizableText style={{color: wanchoColors.white, fontSize: fontSizes.footnote}}>削除</SizableText>
          </YStack>
        </TouchableOpacity>
      </XStack>
    )
  }; 

  return (
    <ReanimatedSwipeable
      ref={ref}
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
    >
      <XStack
        paddingVertical={12}
        paddingHorizontal={16}
        backgroundColor="$white"
        borderBottomWidth={1}
        borderBottomColor="$lightGray"
        alignItems="center"
        gap={12}
      >
        <YStack
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor={category?.bgColor ?? wanchoColors.lightGray}
          alignItems="center"
          justifyContent="center"
        >
          <FontAwesome6
            name={(category?.icon ?? 'ellipsis') as any}
            size={18}
            color={wanchoColors.greige}
          />
        </YStack>
        <YStack flex={1}>
          <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
            {category?.name ?? 'その他'}
          </SizableText>
          <XStack gap={4}>
          {showDate && (
            <SizableText fontSize={fontSizes.caption} color="$greige">
              {formatDate(item.date)}
            </SizableText>
          )}
          {item.memo && (
            <SizableText fontSize={fontSizes.caption} color="$greige">
              {item.memo}
            </SizableText>
          )}
          </XStack>
        </YStack>
        <SizableText fontSize={fontSizes.body} fontWeight="bold" color="$charcoal">
          {formatAmount(item.amount)}
        </SizableText>
      </XStack>
    </ReanimatedSwipeable>
  );
};