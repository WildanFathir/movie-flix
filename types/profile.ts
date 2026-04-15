import { Ionicons } from '@expo/vector-icons';

export interface MenuItems {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}
