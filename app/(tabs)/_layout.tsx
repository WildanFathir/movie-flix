import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

const TabIcon = (
  props: Readonly<{
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
    size: number;
  }>,
) => {
  const { name, color, size } = props;
  return (
    <View className="items-center justify-center">
      <Ionicons name={name} color={color} size={size} />
    </View>
  );
};

const renderHomeIcon = (props: { color: string; size: number }) => {
  return <TabIcon name="home" color={props.color} size={props.size} />;
};

const renderSearchIcon = (props: { color: string; size: number }) => {
  return <TabIcon name="search" color={props.color} size={props.size} />;
};

const renderFavoritesIcon = (props: { color: string; size: number }) => {
  return <TabIcon name="heart" color={props.color} size={props.size} />;
};

const renderProfileIcon = (props: { color: string; size: number }) => {
  return <TabIcon name="person" color={props.color} size={props.size} />;
};

const renderHeaderBackground = () => {
  return (
    <View
      style={{
        backgroundColor: '#faab43',
        flex: 1,
      }}
    />
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#faab43',
        tabBarInactiveTintColor: '#D1D5DB',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          position: 'absolute',
          bottom: 20,
          borderRadius: 50,
          marginHorizontal: 15,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerBackground: renderHeaderBackground,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Top Movies',
          tabBarLabel: 'Home',
          tabBarIcon: renderHomeIcon,
        }}
      />

      {/* Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
          tabBarIcon: renderSearchIcon,
        }}
      />

      {/* Favorites Tab */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarLabel: 'Favorites',
          tabBarIcon: renderFavoritesIcon,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
