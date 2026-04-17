import { useState } from 'react';
import {
  Modal, View, Text, FlatList, Pressable, TextInput, SafeAreaView,
} from 'react-native';
import stateMap from '../constants/stateMap';

interface Props {
  onSelect: (state: string) => void;
}

const STATE_NAMES = Object.keys(stateMap).map(
  (s) => s.charAt(0).toUpperCase() + s.slice(1)
);

export default function StatePickerModal({ onSelect }: Props) {
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
        className="bg-white rounded-3xl px-6 py-3 flex-row items-center justify-center border border-gray-300"
        onPress={() => setVisible(true)}
      >
        <Text className="text-base text-gray-700 mr-2">
          {selected || 'Select a state'}
        </Text>
        <Text className="text-gray-500">▼</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
            <Text className="text-xl font-bold">Select a State</Text>
            <Pressable onPress={() => { setVisible(false); setSearch(''); }}>
              <Text className="text-blue-600 text-base">Cancel</Text>
            </Pressable>
          </View>
          <View className="px-4 py-2 border-b border-gray-200">
            <TextInput
              className="bg-gray-100 rounded-lg px-3 py-2 text-base"
              placeholder="Search states..."
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                onPress={() => handleSelect(item)}
              >
                <Text className="text-base text-gray-800">{item}</Text>
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}
