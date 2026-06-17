import { TouchableOpacity } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRef } from 'react';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { FontAwesome6 } from '@expo/vector-icons';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import { Expense } from '@/types/expense';
import { ExpenseRow } from './ExpenseRow';

type SwipeableRowProps = {
  item: Expense;
  onEdit?: (item: Expense) => void;
  onDelete?: (item: Expense) => void;
  showDate: boolean;
}

// 各費用リストの1行分のコンポーネント
export const SwipeableExpenseRow = ({
  item,
  onEdit,
  onDelete,
  showDate,
} : SwipeableRowProps) => {
  const ref = useRef<SwipeableMethods | null>(null);

  const handleEdit = (item: Expense) => {
    ref.current?.close();
    onEdit?.(item);
  };

  const handleDelete = (item: Expense) => {
    ref.current?.close();
    onDelete?.(item);
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
      <ExpenseRow 
        item={item}
        showDate={showDate}
      />
    </ReanimatedSwipeable>
  );
};
