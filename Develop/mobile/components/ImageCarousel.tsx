import { useRef, useState, useEffect } from 'react';
import { View, FlatList, Image, Dimensions, Text, Pressable } from 'react-native';

interface CarouselImage {
  url: string;
  altText?: string;
}

interface Props {
  images: CarouselImage[];
  autoPlay?: boolean;
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageCarousel({ images, autoPlay = false, height = 300 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  if (!images || images.length === 0) {
    return (
      <View style={{ height, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-gray-400">No images</Text>
      </View>
    );
  }

  return (
    <View style={{ height }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={{ width: SCREEN_WIDTH, height }}
            resizeMode="cover"
          />
        )}
      />
      {images.length > 1 && (
        <View className="absolute bottom-3 right-3 bg-black/50 px-2 py-1 rounded-full">
          <Text className="text-white text-xs">
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );
}
