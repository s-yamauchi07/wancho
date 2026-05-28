import { AlertDialog } from '@tamagui/alert-dialog';
import { Button } from '@tamagui/button';
import { fontSizes } from '../../tamagui.config';
import { XStack } from '@tamagui/stacks';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  buttonLabel?: string;
  onConfirm?: () => void;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
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
                backgroundColor="$sage"
                borderRadius={30}
                paddingHorizontal={32}
                marginHorizontal={16}
                marginTop={16}
                borderWidth={0}
                onPress={() => onOpenChange(false)}
              >
                <Button.Text color="$white" fontSize={fontSizes.body}>
                  キャンセル
                </Button.Text>
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                backgroundColor="$firebrick"
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
