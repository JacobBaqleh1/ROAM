import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { router } from 'expo-router';

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

function ParkPin({ name }: { name: string }) {
  const label = name.length > 26 ? name.slice(0, 24) + '…' : name;
  return (
    <View style={styles.markerContainer}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{label}</Text>
      </View>
      <View style={styles.pinHead} />
    </View>
  );
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
            tracksViewChanges={false}
          >
            <ParkPin name={park.fullName} />
            <Callout onPress={() => router.push(`/(tabs)/park/${park.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{park.fullName}</Text>
                <Text style={styles.calloutLink}>View Details</Text>
              </View>
            </Callout>
          </Marker>
        ) : null
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  pill: {
    backgroundColor: 'white',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  pinHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E5383B',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  callout: {
    maxWidth: 180,
    padding: 4,
  },
  calloutName: {
    fontWeight: '700',
    fontSize: 13,
    color: '#1A1A1A',
  },
  calloutLink: {
    color: '#2ECC71',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});
