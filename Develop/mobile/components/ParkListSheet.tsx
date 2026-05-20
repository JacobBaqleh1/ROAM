import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ParkCard from './ParkCard';

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
  parkCount: number;
  query: string;
}

export default function ParkListSheet({ parks, parkCount, query }: Props) {
  const [containerHeight, setContainerHeight] = useState(0);
  const translateY = useSharedValue(9999);
  const startY = useSharedValue(0);

  const snapPeek = containerHeight - 80;
  const snapHalf = containerHeight * 0.50;
  const snapFull = containerHeight * 0.12;

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setContainerHeight(h);
    translateY.value = withSpring(h - 80, { damping: 50, stiffness: 300, mass: 0.8 });
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      startY.value = translateY.value;
    })
    .onChange((e) => {
      translateY.value = Math.max(snapFull, startY.value + e.translationY);
    })
    .onEnd((e) => {
      const y = translateY.value;
      const vy = e.velocityY;

      let target: number;
      if (vy < -800 || y < (snapFull + snapHalf) / 2) {
        target = snapFull;
      } else if (vy > 800 || y > (snapHalf + snapPeek) / 2) {
        target = snapPeek;
      } else {
        target = snapHalf;
      }

      translateY.value = withSpring(target, { damping: 50, stiffness: 300, mass: 0.8 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.sheet, animatedStyle]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <View style={styles.header}>
          <View style={styles.handle} />
          <Text style={styles.countText}>
            {parkCount}+ parks in <Text style={styles.countQuery}>{query}</Text>
          </Text>
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
    paddingBottom: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginBottom: 10,
    alignSelf: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  countQuery: {
    textTransform: 'capitalize',
    color: '#2ECC71',
  },
});
