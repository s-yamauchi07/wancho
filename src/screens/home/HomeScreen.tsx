import { useEffect } from 'react';
import { usePetStore } from '@/store/petStore';
import { YStack, XStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Avatar } from '@tamagui/avatar';
import { fontSizes, wanchoColors } from '../../../tamagui.config';

export default function HomeScreen() {
  const { fetchPets, pets } = usePetStore();
  const pet = pets[0];
  
  useEffect(() => {
    fetchPets();
  },[]);

  // TODO: 今後nullではなくloadingのコンポーネントを表示させるように改修する。
  if (!pet) return null;
  return (
    <YStack flex={1} backgroundColor="$ivory">
        <YStack padding={16} gap={16} paddingBottom={32}>
          <YStack
            backgroundColor="$ivory"
            borderRadius={12}
            padding={16}
            alignItems="center"
            gap={12}
          >
            <Avatar circular size="$12">
              {pet.photoUri === null ? (
                <Avatar.Image src={require('../../../assets/pet-registration/pet_avatar_default.png')} />
              ) : (
                <Avatar.Image src={pet.photoUri} />
              )}
            </Avatar>
            <SizableText 
              fontSize={fontSizes.heading1} 
              color={wanchoColors.charcoal}
              fontWeight="bold"
            >
              {pet.name}
            </SizableText>
          </YStack>

          {/* 今月の支出合計セクション */}
          <YStack
            backgroundColor="$white"
            borderRadius={12}
            padding={16}
            gap={4}
          >
            <SizableText fontSize={fontSizes.footnote} color="$greige">
              今月の支出
            </SizableText>
          </YStack>

          {/* カテゴリ別グラフセクション */}
          <YStack
            backgroundColor="$white"
            borderRadius={12}
            padding={16}
            gap={8}
          >
            <SizableText fontSize={fontSizes.heading2} fontWeight="bold" color="$charcoal">
              カテゴリ別支出
            </SizableText>
          </YStack>

          {/* 積立目標プログレスバーセクション */}
          <YStack
            backgroundColor="$white"
            borderRadius={12}
            padding={16}
            gap={8}
          >
            <SizableText fontSize={fontSizes.heading2} fontWeight="bold" color="$charcoal">
              積立目標
            </SizableText>
          </YStack>

          {/* 最近の支出セクション */}
          <YStack gap={8}>
            <XStack justifyContent="space-between" alignItems="center">
              <SizableText fontSize={fontSizes.heading2} fontWeight="bold" color="$charcoal">
                最近の支出
              </SizableText>
            </XStack>
            <YStack backgroundColor="$white" borderRadius={12}>
            </YStack>
          </YStack>

        </YStack>
    </YStack>
  );
}
