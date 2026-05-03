import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker'; 
import { usePetStore } from '@/store/petStore';
import { 
  Alert, 
  Image,
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable
} from 'react-native';
import { useOnboardingStore } from '@/store/onboardingStore';

const petSchema = z.object({
  photoUri: z.string().nullable(),
  name: z.string().min(1,'お名前を入力してください'),
});

// ZodのスキーマからTypeScriptの型を自動生成する。
type PetSchema = z.infer<typeof petSchema>;

export default function PetRegisterScreen() {
  const { addPet, error: petError } = usePetStore();
  const { completeOnboarding } = useOnboardingStore();

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
    await addPet(data);
    if (petError) return;
    await completeOnboarding();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>わんこの登録をしよう</Text>
        <Text style={styles.subtitle}>まずは大切な家族のプロフィールを教えてね</Text>
      </View>
      {/* Controllerを使って値を検知。renderの引数のfieldはuseControllerPropsの値。value=現在の入力されている値 */}
      {/* NOTE: https://react-hook-form.com/docs/usecontroller */}
      <Controller
        control={control}
        name='photoUri'
        render={({ field: { value, onChange } }) =>
          <TouchableOpacity style={styles.imageArea} onPress={() => pickImage(onChange)}>
            {value ? (
              <Image source={{ uri: value }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>🐾</Text>
                <Text style={styles.imagePlaceholderText}>写真を選ぶ</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />
      <View style={styles.nameInput}>
        <Text>おなまえ(必須)</Text>
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value } }) =>
            <>
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder='ぽち'
                style={styles.inputForm}
              />
            </>
          }
        />
        {errors.name && <Text>お名前は必須です</Text>}
      </View>
      {/* ボタンエリア */}
      <Pressable 
        onPress={handleSubmit(onSubmit)}
        disabled={!!errors.name}
        style={styles.button}
      >
        <Text style={styles.buttonText}>登録</Text>
      </Pressable>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  imageArea: {
    width: 140,
    height: 140,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 60,
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: 4,
  },
  imagePlaceholderIcon: {
    fontSize: 72,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#999',
  },
  nameInput: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  inputForm: {
    width: 200,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderWidth:1,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 60
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
