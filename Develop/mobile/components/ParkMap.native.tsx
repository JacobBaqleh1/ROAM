import { useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { router } from 'expo-router';
import { Text } from 'react-native';

interface Park {
  id: string;
  fullName: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Props {
  parks: Park[];
  region: Region;
}

export default function ParkMap({ parks, region }: Props) {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={{ flex: 1 }}
      initialRegion={region}
    >
      {parks.map((park) =>
        park.latitude && park.longitude ? (
          <Marker
            key={park.id}
            coordinate={{
              latitude: parseFloat(String(park.latitude)),
              longitude: parseFloat(String(park.longitude)),
            }}
          >
            <Callout onPress={() => router.push(`/(tabs)/park/${park.id}`)}>
              <View style={{ maxWidth: 160 }}>
                <Text style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>{park.fullName}</Text>
                <Text style={{ color: '#2563EB', marginTop: 2 }}>View Details →</Text>
              </View>
            </Callout>
          </Marker>
        ) : null
      )}
    </MapView>
  );
}
