import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [addUser, { loading }] = useMutation(ADD_USER);

  const handleSubmit = async () => {
    if (!username || !email || !password) return;
    try {
      const { data } = await addUser({
        variables: { input: { username, email, password } },
      });
      await Auth.login((data as any).addUser.token);
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">Username</Text>
        <TextInput
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-3 text-base"
          placeholder="Your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
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
        className={`rounded-lg py-3 items-center ${(!username || !email || !password || loading) ? 'bg-gray-300' : 'bg-blue-600'}`}
        onPress={handleSubmit}
        disabled={!username || !email || !password || loading}
      >
        <Text className="text-white font-bold text-base">
          {loading ? 'Creating account...' : 'Create Account'}
        </Text>
      </Pressable>
    </View>
  );
}
