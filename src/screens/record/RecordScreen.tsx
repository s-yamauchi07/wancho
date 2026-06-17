import { useState } from 'react';
import ExpenseForm from '@/components/record/ExpenseForm';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@/navigation/TabNavigator';
import SuccessDialog from '@/components/SuccessDialog';

export default function RecordScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList, 'Record'>>();
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  return (
    <>
      <ExpenseForm 
        onSubmitSuccess={() => setShowSuccessAlert(true)}
      />
      <SuccessDialog
        open={showSuccessAlert}
        onOpenChange={() => setShowSuccessAlert(false)} 
        title="保存しました！"
        cancelButtonLabel="続けて登録する"
        buttonLabel="Homeに戻る"
        onConfirm={() => {
          setShowSuccessAlert(false)
          navigation.navigate('Home')
        }}
      />
    </>
  );
}
