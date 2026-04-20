import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { LOGIN_USER } from '../utils/mutations';
import { useAuth } from '../utils/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: authLogin } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN_USER);

  const handleSubmit = async () => {
    if (!email || !password) return;
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      await authLogin((data as any).login.token);
    } catch (e: any) {
      Alert.alert('Login failed', e.message || 'Invalid credentials. Please try again.');
    }
  };

  const disabled = !email || !password || loading;

  return (
    <View style={{ gap: 16 }}>
      <View>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 6 }}>Email</Text>
        <TextInput
          style={{
            backgroundColor: '#F5F5F0',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 13,
            fontSize: 15,
            color: '#1A1A1A',
          }}
          placeholder="Your email"
          placeholderTextColor="#A3A3A3"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
      </View>
      <View>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 6 }}>Password</Text>
        <TextInput
          style={{
            backgroundColor: '#F5F5F0',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 13,
            fontSize: 15,
            color: '#1A1A1A',
          }}
          placeholder="Your password"
          placeholderTextColor="#A3A3A3"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Pressable
        style={{
          backgroundColor: disabled ? '#E5E5E5' : '#2ECC71',
          borderRadius: 999,
          paddingVertical: 15,
          alignItems: 'center',
          marginTop: 4,
        }}
        onPress={handleSubmit}
        disabled={disabled}
      >
        <Text style={{ color: disabled ? '#A3A3A3' : 'white', fontWeight: '700', fontSize: 15 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Text>
      </Pressable>
    </View>
  );
}
