import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, View, TextInput, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { z } from 'zod';

const petSchema = z.object({
  photoUri: z.string().nullable(),
  name: z.string().min(1,'お名前を入力してください'),
});

// ZodのスキーマからTypeScriptの型を自動生成する。
type PetSchema = z.infer<typeof petSchema>;

export default function PetRegisterScreen() {
  // フォームの型をPetSchema型として管理し、バリデーションをzodResolverに委譲。
  const { control, handleSubmit, formState: { errors } } = useForm<PetSchema>({
    resolver: zodResolver(petSchema),
    defaultValues: { name: '', photoUri: null },
  })

  const onSubmit = (data: PetSchema) => {
    console.log(data);
  }

  return (
    <View style={styles.container}>
      {/* Controllerを使って値を検知。renderの引数のfieldはuseControllerPropsの値。value=現在の入力されている値 */}
      {/* NOTE: https://react-hook-form.com/docs/usecontroller */}
      <Controller
        control={control}
        name='photoUri'
        render={({ field: { value } }) =>
          <TouchableOpacity style={styles.imageArea} onPress={() => console.log('画像選択')}>
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
      <View>
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
  inputForm: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderWidth:1,
    borderRadius: 30,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
