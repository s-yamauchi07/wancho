import { Category } from "@/types/categories";
import { wanchoColors } from "tamagui.config";

export const CATEGORIES: Category[] = [
  { id: 1, name: 'フード', icon: 'bowl-food', bgColor: wanchoColors.sage },
  { id: 2, name: 'おやつ', icon: 'bone', bgColor: wanchoColors.taupe},
  { id: 3, name: '医療費', icon: 'hospital', bgColor: wanchoColors.palePink},
  { id: 4, name: 'トリミング', icon: 'scissors', bgColor: wanchoColors.lavender},
  { id: 5, name: 'ペット保険', icon: 'shield-dog', bgColor: wanchoColors.paleBlue},
  { id: 6, name: 'おもちゃ', icon: 'soccer-ball', bgColor: wanchoColors.mint },
  { id: 7, name: '日用品', icon: 'shirt', bgColor: wanchoColors.camel },
  { id: 8, name: 'ペットホテル', icon: 'house', bgColor:wanchoColors.mauve },
  { id: 9, name: 'その他', icon: 'ellipsis', bgColor: wanchoColors.greige },
];
