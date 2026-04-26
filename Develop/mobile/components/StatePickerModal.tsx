import { useState } from 'react';
import {
  Modal, View, Text, FlatList, Pressable, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import stateMap from '../constants/stateMap';

interface Props {
  onSelect: (state: string) => void;
  searching?: boolean;
}

const STATE_NAMES = Object.keys(stateMap).map(
  (s) => s.charAt(0).toUpperCase() + s.slice(1)
);

export default function StatePickerModal({ onSelect, searching = false }: Props) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState('');

  const filtered = STATE_NAMES.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (state: string) => {
    setSelected(state);
    setVisible(false);
    setSearch('');
    onSelect(state.toLowerCase());
  };

  return (
    <>
      <Pressable
        style={{
          backgroundColor: '#F5F5F0',
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
        onPress={() => !searching && setVisible(true)}
      >
        <Ionicons name="search-outline" size={18} color="#737373" />
        <Text style={{ flex: 1, fontSize: 15, color: selected ? '#1A1A1A' : '#A3A3A3' }}>
          {searching ? 'Searching...' : selected || 'Find parks by state'}
        </Text>
        {searching ? (
          <ActivityIndicator size="small" color="#737373" />
        ) : (
          <Ionicons name="options-outline" size={18} color="#737373" />
        )}
      </Pressable>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Select a State</Text>
            <Pressable onPress={() => { setVisible(false); setSearch(''); }}>
              <Text style={{ color: '#2ECC71', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
          </View>
          <View className="px-4 py-3 border-b border-gray-100">
            <View
              style={{
                backgroundColor: '#F5F5F0',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              <Ionicons name="search-outline" size={16} color="#A3A3A3" />
              <TextInput
                style={{ flex: 1, paddingVertical: 10, fontSize: 15, color: '#1A1A1A' }}
                placeholder="Search states..."
                placeholderTextColor="#A3A3A3"
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
            </View>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F5F5F0',
                  backgroundColor: pressed ? '#F5F5F0' : 'white',
                })}
                onPress={() => handleSelect(item)}
              >
                <Text style={{ fontSize: 16, color: '#1A1A1A' }}>{item}</Text>
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}
