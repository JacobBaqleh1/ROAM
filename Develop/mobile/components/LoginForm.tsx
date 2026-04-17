import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading }] = useMutation(LOGIN_USER);

  const handleSubmit = async () => {
    if (!email || !password) return;
    try {
      const { data } = await login({ variables: { email, password } });
      await Auth.login((data as any).login.token);
    } catch (e: any) {
      Alert.alert('Login failed', e.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-3 text-base"
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
      </View>
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-3 text-base"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Pressable
        className={`rounded-lg py-3 items-center ${(!email || !password || loading) ? 'bg-gray-300' : 'bg-green-500'}`}
        onPress={handleSubmit}
        disabled={!email || !password || loading}
      >
        <Text className="text-white font-bold text-base">
          {loading ? 'Signing in...' : 'Sign In'}
        </Text>
      </Pressable>
    </View>
  );
}
