import { AlertDialog } from '@tamagui/alert-dialog';
import { Button } from '@tamagui/button';
import { fontSizes } from '../../tamagui.config';
import { XStack } from '@tamagui/stacks';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  cancelButtonLabel?: string;
  buttonLabel?: string;
  onConfirm?: () => void;
};

export default function SuccessDialog({
  open,
  onOpenChange,
  title,
  cancelButtonLabel = 'キャンセル',
  buttonLabel = 'OK',
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content
          backgroundColor="$ivory"
          borderRadius={16}
          padding={24}
        >
          <AlertDialog.Title
            fontSize={fontSizes.heading2}
            color="$greige"
            textAlign="center"
          >
            {title}
          </AlertDialog.Title>
          <XStack>
            <AlertDialog.Cancel asChild>
              <Button
                backgroundColor="$sandBeige"
                borderRadius={30}
                paddingHorizontal={32}
                marginHorizontal={16}
                marginTop={16}
                borderWidth={0}
                onPress={() => onOpenChange(false)}
              >
                <Button.Text color="$greige" fontSize={fontSizes.body}>
                  {cancelButtonLabel}
                </Button.Text>
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                backgroundColor="$sage"
                borderRadius={30}
                paddingHorizontal={32}
                marginHorizontal={16}
                marginTop={16}
                borderWidth={0}
                onPress={() => onConfirm?.()}
              >
                <Button.Text color="$white" fontSize={fontSizes.body}>
                  {buttonLabel}
                </Button.Text>
              </Button>
            </AlertDialog.Action>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
