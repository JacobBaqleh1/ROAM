import { useState } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
} from 'react-native';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 py-8">
            <Text className="text-4xl font-black text-center mb-2">ROAM</Text>
            <Text className="text-center text-gray-500 mb-8">
              Discover National Parks
            </Text>

            {/* Tab switcher */}
            <View className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
              <Pressable
                className={`flex-1 py-2 rounded-lg items-center ${isLogin ? 'bg-white shadow-sm' : ''}`}
                onPress={() => setIsLogin(true)}
              >
                <Text className={`font-semibold ${isLogin ? 'text-gray-900' : 'text-gray-500'}`}>
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 py-2 rounded-lg items-center ${!isLogin ? 'bg-white shadow-sm' : ''}`}
                onPress={() => setIsLogin(false)}
              >
                <Text className={`font-semibold ${!isLogin ? 'text-gray-900' : 'text-gray-500'}`}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {isLogin ? <LoginForm /> : <SignupForm />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
