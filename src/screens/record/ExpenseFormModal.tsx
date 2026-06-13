import { Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { wanchoColors } from '../../../tamagui.config';
import { Expense } from '@/types/expense';
import ExpenseForm from '@/components/record/ExpenseForm';

type Props = {
  visible: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
};

export default function ExpenseFormModal({ visible, onClose, editingExpense }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {visible && (
          <ExpenseForm 
            editingExpense={editingExpense}
            onSubmitSuccess={onClose}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: wanchoColors.ivory,
  },
});
