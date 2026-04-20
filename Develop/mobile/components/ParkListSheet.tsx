import { useEffect, useCallback } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ParkCard from './ParkCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SNAP_PEEK = SCREEN_HEIGHT - 220;
const SNAP_HALF = SCREEN_HEIGHT * 0.45;
const SNAP_FULL = SCREEN_HEIGHT * 0.12;

interface Park {
  id: string;
  fullName: string;
  latitude?: string | number;
  longitude?: string | number;
  images?: { url: string }[];
  states?: string;
}

interface Props {
  parks: Park[];
  onClose: () => void;
}

export default function ParkListSheet({ parks, onClose }: Props) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const startY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(SNAP_PEEK, { damping: 50, stiffness: 300, mass: 0.8 });
  }, []);

  const closeSheet = useCallback(() => {
    translateY.value = withSpring(
      SCREEN_HEIGHT,
      { damping: 50, stiffness: 300, mass: 0.8 },
      (finished) => {
        if (finished) runOnJS(onClose)();
      },
    );
  }, [onClose, translateY]);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      startY.value = translateY.value;
    })
    .onChange((e) => {
      translateY.value = Math.max(SNAP_FULL, startY.value + e.translationY);
    })
    .onEnd((e) => {
      const y = translateY.value;
      const vy = e.velocityY;

      let target: number;
      if (vy < -800 || y < (SNAP_FULL + SNAP_HALF) / 2) {
        target = SNAP_FULL;
      } else if (vy > 800 || y > (SNAP_HALF + SNAP_PEEK) / 2) {
        target = SNAP_PEEK;
      } else {
        target = SNAP_HALF;
      }

      translateY.value = withSpring(target, { damping: 50, stiffness: 300, mass: 0.8 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.sheet, animatedStyle]}>
      <GestureDetector gesture={gesture}>
        <View style={styles.header}>
          <View style={styles.handle} />
          <Pressable style={styles.listBtn} onPress={closeSheet}>
            <Ionicons name="list-outline" size={16} color="white" />
            <Text style={styles.listBtnText}>List</Text>
          </Pressable>
        </View>
      </GestureDetector>
      <FlatList
        data={parks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ParkCard park={item as any} />}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  listBtn: {
    position: 'absolute',
    right: 16,
    top: 10,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 5,
  },
  listBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
