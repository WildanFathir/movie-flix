import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import type { MenuItems } from '@/types/profile';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const MenuItemData: MenuItems[] = [
  { icon: 'settings', label: 'Settings', onPress: () => {} },
  { icon: 'help-circle', label: 'Help & Support', onPress: () => {} },
  { icon: 'information-circle', label: 'About', onPress: () => {} },
];

const MenuItem = ({ icon, label, onPress }: MenuItems) => (
  <TouchableOpacity
    className="flex-row items-center justify-between w-full p-4 rounded-lg bg-gray-50"
    onPress={onPress}
  >
    <View className="flex-row items-start gap-4">
      <Ionicons name={icon} size={24} color="#faab43" />
      <Text className="text-lg text-gray-800">{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-col items-center gap-8 p-6">
        {/* Profile Header */}
        <View className="flex items-center w-full gap-4">
          <View className="items-center justify-center w-20 h-20 bg-[#faab43] rounded-full">
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View className="flex items-center w-full gap-1">
            <Text className="text-2xl font-bold text-gray-900">{user?.name}</Text>
            <Text className="text-gray-600">{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex items-center w-full gap-6">
          {MenuItemData.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>

        {/* Logout Button */}
        <Button title="Logout" onPress={handleLogout} variant="danger" />

        {/* App Version */}
        <Text className="text-sm text-center text-gray-500">MovieFlix v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
