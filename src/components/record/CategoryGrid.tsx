import { FlatList, Pressable } from 'react-native';
import { YStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { FontAwesome6 } from '@expo/vector-icons';
import { fontSizes, wanchoColors } from '../../../tamagui.config';

type Category = {
  id: number;
  name: string;
};

type Props = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (id: number) => void;
};

type CategoryStyle = {
  icon: keyof typeof FontAwesome6.glyphMap;
  color: string;
};

const CATEGORY_STYLE_MAP: Record<string, CategoryStyle> = {
  フード:       { icon: 'bowl-food',       color: wanchoColors.sage },
  おやつ:       { icon: 'bone',              color: wanchoColors.sandBeige },
  医療費:       { icon: 'hospital',           color: wanchoColors.palePink },
  トリミング:   { icon: 'scissors',             color: wanchoColors.lavender },
  ペット保険:   { icon: 'shield-dog',  color: wanchoColors.paleBlue },
  おもちゃ: { icon: 'soccer-ball',           color: wanchoColors.lavender },
  日用品:       { icon: 'shirt',        color: wanchoColors.sandBeige },
  ペットホテル: { icon: 'home',              color: wanchoColors.paleBlue },
  その他:       { icon: 'ellipsis', color: wanchoColors.lightGray },
};

const DEFAULT_STYLE: CategoryStyle = {
  icon: 'help-circle-outline',
  color: wanchoColors.lightGray,
};

export default function CategoryGrid({ categories, selectedCategoryId, onSelect }: Props) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      numColumns={3}
      scrollEnabled={false}
      renderItem={({ item }) => {
        const style = CATEGORY_STYLE_MAP[item.name] ?? DEFAULT_STYLE;
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
              borderColor={isSelected ? '$sage' : 'transparent'}
              backgroundColor={isSelected ? '$sandBeige' : '$lightGray'}
            >
              <YStack
                width={44}
                height={44}
                borderRadius={22}
                backgroundColor={style.color}
                alignItems="center"
                justifyContent="center"
              >
                <FontAwesome6 name={style.icon} size={22} color={wanchoColors.white} />
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
