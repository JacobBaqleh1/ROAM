import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface HomeSearchMapProps {
  stateMap: Record<string, string>;
  loading: string | null;
  onStateClick: (stateName: string) => void;
  onHover: (stateName: string | null) => void;
}

export default function HomeSearchMap({
  stateMap,
  loading,
  onStateClick,
  onHover,
}: HomeSearchMapProps) {
  return (
    <div className="hidden md:block pb-10">
      <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "auto" }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name as string;
              const key = name.toLowerCase();
              if (!stateMap[key]) return null;
              const isLoading = loading === name;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => !loading && onHover(name)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onStateClick(name)}
                  style={{
                    default: {
                      fill: isLoading ? "#1B4332" : "rgba(255,255,255,0.55)",
                      stroke: "rgba(255,255,255,0.8)",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                      transition: "fill 0.15s ease",
                    },
                    hover: {
                      fill: "#2D6A4F",
                      stroke: "rgba(255,255,255,0.9)",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#1B4332",
                      stroke: "rgba(255,255,255,0.9)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
