import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { ContentProvider } from '../context/ContentContext';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import HomeScreen from '../screens/main/HomeScreen';
import SubjectListScreen from '../screens/main/SubjectListScreen';
import SubjectDetailsScreen from '../screens/main/SubjectDetailsScreen';
import LessonViewerScreen from '../screens/main/LessonViewerScreen';
import PdfViewerScreen from '../screens/main/PdfViewerScreen';
import HtmlViewerScreen from '../screens/main/HtmlViewerScreen';
import ImageViewerScreen from '../screens/main/ImageViewerScreen';
import DownloadManagerScreen from '../screens/main/DownloadManagerScreen';
import OfflineMaterialsScreen from '../screens/main/OfflineMaterialsScreen';
import UpdatesScreen from '../screens/main/UpdatesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import AboutScreen from '../screens/main/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ICONS = { Home: 'home', Subjects: 'book', Downloads: 'cloud-download', Profile: 'person' };

function Tabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: route.name !== 'Home',
      tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Subjects" component={SubjectListScreen} />
      <Tab.Screen name="Downloads" component={DownloadManagerScreen} options={{ title: 'Download Manager' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Student Profile' }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="SubjectDetails" component={SubjectDetailsScreen} options={{ title: 'Subject' }} />
      <Stack.Screen name="LessonViewer" component={LessonViewerScreen} options={{ title: 'Lessons' }} />
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} options={{ title: 'PDF' }} />
      <Stack.Screen name="HtmlViewer" component={HtmlViewerScreen} options={{ title: 'Lesson' }} />
      <Stack.Screen name="ImageViewer" component={ImageViewerScreen} options={{ title: 'Image' }} />
      <Stack.Screen name="OfflineMaterials" component={OfflineMaterialsScreen} options={{ title: 'Offline Materials' }} />
      <Stack.Screen name="Updates" component={UpdatesScreen} options={{ title: 'Updates' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return <SplashScreen />;
  if (user) return <ContentProvider><MainStack /></ContentProvider>;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign in' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset password' }} />
    </Stack.Navigator>
  );
}
