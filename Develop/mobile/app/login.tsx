import { useState } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
<KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Text style={{ fontSize: 40, fontWeight: '900', textAlign: 'center', color: '#1A1A1A', marginBottom: 6 }}>
            ROAM
          </Text>
          <Text style={{ textAlign: 'center', color: '#737373', marginBottom: 32, fontSize: 15 }}>
            Discover National Parks
          </Text>

          {/* Tab switcher */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#F5F5F0',
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}>
            <Pressable
              style={{
                flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
                backgroundColor: isLogin ? 'white' : 'transparent',
                shadowColor: isLogin ? '#000' : 'transparent',
                shadowOpacity: isLogin ? 0.08 : 0,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: isLogin ? 2 : 0,
              }}
              onPress={() => setIsLogin(true)}
            >
              <Text style={{ fontWeight: '700', color: isLogin ? '#1A1A1A' : '#737373' }}>Sign In</Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
                backgroundColor: !isLogin ? 'white' : 'transparent',
                shadowColor: !isLogin ? '#000' : 'transparent',
                shadowOpacity: !isLogin ? 0.08 : 0,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: !isLogin ? 2 : 0,
              }}
              onPress={() => setIsLogin(false)}
            >
              <Text style={{ fontWeight: '700', color: !isLogin ? '#1A1A1A' : '#737373' }}>Sign Up</Text>
            </Pressable>
          </View>

          {isLogin ? <LoginForm /> : <SignupForm />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
