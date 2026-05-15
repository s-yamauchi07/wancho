import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker'; 
import { usePetStore } from '@/store/petStore';
import { Alert, Image } from 'react-native';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { YStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';
import { Avatar } from '@tamagui/avatar';
import { Button } from '@tamagui/button';
import { Input } from '@tamagui/input';
import { fontSizes } from '../../../tamagui.config';
import ErrorAlertDialog from '@/components/ErrorAlertDialog';

const petSchema = z.object({
  photoUri: z.string().nullable(),
  name: z.string().min(1,'お名前を入力してください'),
});

// ZodのスキーマからTypeScriptの型を自動生成する。
type PetSchema = z.infer<typeof petSchema>;

export default function PetRegisterScreen() {
  const { addPet, error } = usePetStore();
  const { completeOnboarding } = useOnboardingStore();
  const [showError, setShowError] = useState(false);
  const navigation = useNavigation();

  // フォームの型をPetSchema型として管理し、バリデーションをzodResolverに委譲。
  const { control, handleSubmit, formState: { errors } } = useForm<PetSchema>({
    resolver: zodResolver(petSchema),
    defaultValues: { name: '', photoUri: null },
  })

  const pickImage = async(onChange: (url: string | null) => void) => {
    // 権限をリクエストし、結果をpermissionResultに保持。
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // 権限を拒否している場合は中断
    if (!permissionResult.granted) {
      Alert.alert('写真へのアクセス許可が必要です');
      return;
    }

    const imagePickResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    // 画像の取得が成功したら、imageuriをstateで管理する。
    if (!imagePickResult.canceled) {
      onChange(imagePickResult.assets[0].uri)
    }
  };

  const onSubmit = async(data: PetSchema) => {
    const success = await addPet(data);
    if (!success) {
      setShowError(true);
      return;
    }
    await completeOnboarding();

    // navigation.getParent()で1つ上のRootNavigatorのnavigationを取得する。
    // dispatch(CommonActions.reset({...}))で取得できた場合のみRootNavigationに対してアクションを送る。resetすることでonboardingで構築したstackを削除して、再度新規登録画面に戻るのを防ぐ
    navigation.getParent()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'TabNavigator' }], // stackをこの画面だけにする(前の画面に戻れないようにreset)
      })
    );
  };

  return (
    <YStack 
      flex={1}
      backgroundColor="$ivory"
      alignItems="center"
      justifyContent="center"
      gap="$6"
      paddingBottom={100}
    >
      <YStack alignItems="center">
        <SizableText 
          fontSize={fontSizes.heading1}
          fontWeight="bold"
        >
          わんこの登録をしよう
        </SizableText>
        <SizableText fontSize={fontSizes.body} color="$greige">
          大切な家族のプロフィールを教えてください
        </SizableText>
      </YStack>
      {/* Controllerを使って値を検知。renderの引数のfieldはuseControllerPropsの値。value=現在の入力されている値 */}
      {/* NOTE: https://react-hook-form.com/docs/usecontroller */}
      <Controller
        control={control}
        name='photoUri'
        render={({ field: { value, onChange } }) =>
          <YStack onPress={() => pickImage(onChange)} pressStyle={{ opacity: 0.8 }}>
            {value ? (
              <Image source={{ uri: value }} style={{ width: 120, height: 120, borderRadius: 60 }} />
            ) : (
              <YStack alignItems="center" gap="$2">
                <Avatar circular size="$12">
                  <Avatar.Image src={require('../../../assets/pet-registration/pet_avatar_default.png')} />
                </Avatar>
                <SizableText
                  fontSize={fontSizes.body}
                  color="$greige"
                >
                  写真を選ぶ
                </SizableText>
              </YStack>
            )}
          </YStack>
        }
      />
      <YStack>
        <SizableText fontSize={fontSizes.body}>
          お名前(必須)
        </SizableText>
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value } }) =>
            <Input
              unstyled
              onChangeText={onChange}
              value={value}
              placeholder="例: ぽち"
              width={200}
              fontSize={fontSizes.heading2}
              paddingVertical={12}
              marginBottom={4}
              borderBottomWidth={1}
              borderBottomColor="$sage"
            />
          }
        />
        {errors.name && <SizableText fontSize={fontSizes.footnote} color="$firebrick">お名前は必須です</SizableText>}
      </YStack>
      {/* ボタンエリア */}
      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={!!errors.name}
        backgroundColor="$sage"
        paddingVertical={10}
        paddingHorizontal={48}
        borderRadius={30}
        pressStyle={{ opacity: 0.8 }}
        borderWidth={0}
      >
        <Button.Text 
          color="$white"
          fontSize={fontSizes.body}
          fontWeight="bold"
        >
          登録
        </Button.Text>
      </Button>

      <ErrorAlertDialog
        open={showError}
        onOpenChange={setShowError}
        title="エラーが発生しました"
        description={error}
      />
    </YStack>
  );
}

