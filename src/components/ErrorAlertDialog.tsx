import { AlertDialog } from '@tamagui/alert-dialog';
import { Button } from '@tamagui/button';
import { fontSizes } from '../../tamagui.config';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | null;
  buttonLabel?: string;
};

export default function ErrorAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  buttonLabel = 'OK',
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
            fontWeight="bold"
            color="$charcoal"
          >
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description
            fontSize={fontSizes.body}
            color="$greige"
          >
            {description}
          </AlertDialog.Description>
          <AlertDialog.Action asChild>
            <Button
              backgroundColor="$firebrick"
              borderRadius={30}
              paddingHorizontal={32}
              marginHorizontal={16}
              marginTop={16}
              borderWidth={0}
              onPress={() => onOpenChange(false)}
            >
              <Button.Text color="$white" fontSize={fontSizes.body}>
                {buttonLabel}
              </Button.Text>
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
