import { useState, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, ActivityIndicator, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stateMap from '../constants/stateMap';

interface Props {
  onSelect: (state: string) => void;
  searching?: boolean;
}

const toTitle = (s: string) =>
  s.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function StatePickerModal({ onSelect, searching = false }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState('');
  const inputRef = useRef<TextInput>(null);

  const suggestions = inputValue.length > 0
    ? Object.keys(stateMap).filter((s) =>
        s.startsWith(inputValue.toLowerCase()) ||
        s.split(' ').some((w) => w.startsWith(inputValue.toLowerCase()))
      ).slice(0, 8)
    : [];

  const handleSelect = (stateName: string) => {
    const titled = toTitle(stateName);
    setSelected(titled);
    setInputValue(titled);
    setShowSuggestions(false);
    inputRef.current?.blur();
    onSelect(stateName);
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    setSelected('');
    setShowSuggestions(true);
  };

  return (
    <View style={styles.wrapper}>
      {/* Input row */}
      <View style={styles.inputRow}>
        {searching ? (
          <ActivityIndicator size="small" color="#737373" style={styles.icon} />
        ) : (
          <Ionicons name="search-outline" size={16} color="#737373" style={styles.icon} />
        )}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={searching ? `Loading ${selected}…` : inputValue}
          onChangeText={handleChangeText}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search a state…"
          placeholderTextColor="#A3A3A3"
          editable={!searching}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (suggestions.length > 0) handleSelect(suggestions[0]);
          }}
        />
        {inputValue.length > 0 && !searching && (
          <Pressable onPress={() => { setInputValue(''); setSelected(''); setShowSuggestions(false); }}>
            <Ionicons name="close-circle" size={16} color="#A3A3A3" style={styles.clearIcon} />
          </Pressable>
        )}
      </View>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="always"
            scrollEnabled={suggestions.length > 5}
            style={{ maxHeight: 240 }}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.suggestion, pressed && styles.suggestionPressed]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionName}>{toTitle(item)}</Text>
                <Text style={styles.suggestionAbbr}>{stateMap[item]}</Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 999,
    elevation: 999,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    overflow: 'hidden',
  },
  suggestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  suggestionPressed: {
    backgroundColor: '#F5F5F0',
  },
  suggestionName: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  suggestionAbbr: {
    fontSize: 12,
    color: '#A3A3A3',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
});
