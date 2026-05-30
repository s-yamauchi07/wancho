import { FlatList, Pressable } from 'react-native';
import { YStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { FontAwesome6 } from '@expo/vector-icons';
import { fontSizes, wanchoColors } from '../../../tamagui.config';
import { Category } from '@/types/categories';
import { CATEGORIES } from '@/constants/categories';

type Props = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (id: number) => void;
};

export default function CategoryGrid({ categories, selectedCategoryId, onSelect }: Props) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      numColumns={3}
      scrollEnabled={false}
      renderItem={({ item }) => {
        const isSelected = item.id === selectedCategoryId;

        return (
          <Pressable
            onPress={() => onSelect(item.id)}
            style={{ flex: 1, padding: 6 }}
          >
            <YStack
              alignItems="center"
              gap={6}
              paddingVertical={12}
              borderRadius={12}
              borderWidth={2}
              borderColor={isSelected ? item.bgColor : 'transparent'}
              backgroundColor={wanchoColors.lightGray}
            >
              <YStack
                width={44}
                height={44}
                borderRadius={22}
                alignItems="center"
                justifyContent="center"
              >
                <FontAwesome6 
                  name={item.icon as keyof typeof FontAwesome6.glyphMap} 
                  size={32} 
                  color={item.bgColor} 
                />
              </YStack>
              <SizableText
                fontSize={fontSizes.caption}
                color="$charcoal"
                textAlign="center"
                numberOfLines={2}
              >
                {item.name}
              </SizableText>
            </YStack>
          </Pressable>
        );
      }}
    />
  );
}
