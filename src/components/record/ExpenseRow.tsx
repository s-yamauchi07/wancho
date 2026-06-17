import { XStack, YStack } from "@tamagui/stacks";
import { SizableText } from "@tamagui/text";
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import { FontAwesome6 } from "@expo/vector-icons";
import { CATEGORIES } from '@/constants/categories';
import { Expense } from "@/types/expense";

type ExpenseRowProps = {
  item: Expense;
  showDate: boolean;
}

function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${Number(month)}/${Number(day)}`;
}

export const ExpenseRow = ({showDate, item }: ExpenseRowProps) => {
  const category = CATEGORIES.find((c) => c.id === item.categoryId);

  return(
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
          borderColor={category?.bgColor ?? wanchoColors.sage}
          borderWidth={1}
          alignItems="center"
          justifyContent="center"
        >
          <FontAwesome6
            name={(category?.icon ?? 'ellipsis') as any}
            size={18}
            color={category?.bgColor ?? wanchoColors.greige}
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
  )
}
