'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CityLocation {
  name: string;
  nameVN: string;
  lat: number;
  lng: number;
  type: 'japan' | 'world';
  description: string;
  descriptionVN: string;
}

export default function WorldMap() {
  const { themeColor, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MapContainer, setMapContainer] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [TileLayer, setTileLayer] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Marker, setMarker] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Popup, setPopup] = useState<any>(null);

  // 23 địa điểm Nhật Bản + 30 địa điểm quốc tế để match với GlobalNetwork stats
  const cities: CityLocation[] = [
    // 23 địa điểm Nhật Bản (match với stats: 日本国内拠点 23)
    {
      name: 'Tokyo (本社)',
      nameVN: 'Tokyo (Trụ sở chính)',
      lat: 35.6762,
      lng: 139.6503,
      type: 'japan',
      description: 'FPT Software Japan 本社',
      descriptionVN: 'Trụ sở chính FPT Software Japan'
    },
    {
      name: 'Osaka',
      nameVN: 'Osaka',
      lat: 34.6937,
      lng: 135.5023,
      type: 'japan',
      description: 'FPT関西支社',
      descriptionVN: 'Chi nhánh FPT Kansai'
    },
    {
      name: 'Nagoya',
      nameVN: 'Nagoya',
      lat: 35.1815,
      lng: 136.9066,
      type: 'japan',
      description: 'FPT中部支社',
      descriptionVN: 'Chi nhánh FPT Chubu'
    },
    {
      name: 'Yokohama',
      nameVN: 'Yokohama',
      lat: 35.4437,
      lng: 139.6380,
      type: 'japan',
      description: 'FPT横浜支社',
      descriptionVN: 'Chi nhánh FPT Yokohama'
    },
    {
      name: 'Kyoto',
      nameVN: 'Kyoto',
      lat: 35.0116,
      lng: 135.7681,
      type: 'japan',
      description: 'FPT京都支社',
      descriptionVN: 'Chi nhánh FPT Kyoto'
    },
    {
      name: 'Sapporo',
      nameVN: 'Sapporo',
      lat: 43.0642,
      lng: 141.3469,
      type: 'japan',
      description: 'FPT北海道支社',
      descriptionVN: 'Chi nhánh FPT Hokkaido'
    },
    {
      name: 'Fukuoka',
      nameVN: 'Fukuoka',
      lat: 33.5904,
      lng: 130.4017,
      type: 'japan',
      description: 'FPT九州支社',
      descriptionVN: 'Chi nhánh FPT Kyushu'
    },
    {
      name: 'Sendai',
      nameVN: 'Sendai',
      lat: 38.2682,
      lng: 140.8694,
      type: 'japan',
      description: 'FPT東北支社',
      descriptionVN: 'Chi nhánh FPT Tohoku'
    },
    {
      name: 'Hiroshima',
      nameVN: 'Hiroshima',
      lat: 34.3853,
      lng: 132.4553,
      type: 'japan',
      description: 'FPT中国支社',
      descriptionVN: 'Chi nhánh FPT Chugoku'
    },
    {
      name: 'Kanazawa',
      nameVN: 'Kanazawa',
      lat: 36.5944,
      lng: 136.6256,
      type: 'japan',
      description: 'FPT北陸支社',
      descriptionVN: 'Chi nhánh FPT Hokuriku'
    },
    {
      name: 'Niigata',
      nameVN: 'Niigata',
      lat: 37.9161,
      lng: 139.0364,
      type: 'japan',
      description: 'FPT新潟支社',
      descriptionVN: 'Chi nhánh FPT Niigata'
    },
    {
      name: 'Shizuoka',
      nameVN: 'Shizuoka',
      lat: 34.9756,
      lng: 138.3828,
      type: 'japan',
      description: 'FPT静岡支社',
      descriptionVN: 'Chi nhánh FPT Shizuoka'
    },
    {
      name: 'Matsumoto',
      nameVN: 'Matsumoto',
      lat: 36.2048,
      lng: 137.9702,
      type: 'japan',
      description: 'FPT長野支社',
      descriptionVN: 'Chi nhánh FPT Nagano'
    },
    {
      name: 'Takasaki',
      nameVN: 'Takasaki',
      lat: 36.3229,
      lng: 139.0106,
      type: 'japan',
      description: 'FPT群馬支社',
      descriptionVN: 'Chi nhánh FPT Gunma'
    },
    {
      name: 'Utsunomiya',
      nameVN: 'Utsunomiya',
      lat: 36.5658,
      lng: 139.8836,
      type: 'japan',
      description: 'FPT栃木支社',
      descriptionVN: 'Chi nhánh FPT Tochigi'
    },
    {
      name: 'Mito',
      nameVN: 'Mito',
      lat: 36.3418,
      lng: 140.4468,
      type: 'japan',
      description: 'FPT茨城支社',
      descriptionVN: 'Chi nhánh FPT Ibaraki'
    },
    {
      name: 'Chiba',
      nameVN: 'Chiba',
      lat: 35.6074,
      lng: 140.1065,
      type: 'japan',
      description: 'FPT千葉支社',
      descriptionVN: 'Chi nhánh FPT Chiba'
    },
    {
      name: 'Saitama',
      nameVN: 'Saitama',
      lat: 35.8617,
      lng: 139.6455,
      type: 'japan',
      description: 'FPT埼玉支社',
      descriptionVN: 'Chi nhánh FPT Saitama'
    },
    {
      name: 'Kobe',
      nameVN: 'Kobe',
      lat: 34.6901,
      lng: 135.1956,
      type: 'japan',
      description: 'FPT神戸支社',
      descriptionVN: 'Chi nhánh FPT Kobe'
    },
    {
      name: 'Nara',
      nameVN: 'Nara',
      lat: 34.6851,
      lng: 135.8049,
      type: 'japan',
      description: 'FPT奈良支社',
      descriptionVN: 'Chi nhánh FPT Nara'
    },
    {
      name: 'Wakayama',
      nameVN: 'Wakayama',
      lat: 34.2261,
      lng: 135.1675,
      type: 'japan',
      description: 'FPT和歌山支社',
      descriptionVN: 'Chi nhánh FPT Wakayama'
    },
    {
      name: 'Okayama',
      nameVN: 'Okayama',
      lat: 34.6617,
      lng: 133.9341,
      type: 'japan',
      description: 'FPT岡山支社',
      descriptionVN: 'Chi nhánh FPT Okayama'
    },
    {
      name: 'Kumamoto',
      nameVN: 'Kumamoto',
      lat: 32.8031,
      lng: 130.7079,
      type: 'japan',
      description: 'FPT熊本支社',
      descriptionVN: 'Chi nhánh FPT Kumamoto'
    },

    // 30 địa điểm quốc tế chính (match với stats: 国・地域 30)
    {
      name: 'Singapore',
      nameVN: 'Singapore',
      lat: 1.3521,
      lng: 103.8198,
      type: 'world',
      description: 'FPT Software Singapore Hub',
      descriptionVN: 'Trung tâm FPT Software Singapore'
    },
    {
      name: 'Ho Chi Minh City',
      nameVN: 'TP. Hồ Chí Minh',
      lat: 10.8231,
      lng: 106.6297,
      type: 'world',
      description: 'FPT Software Vietnam HQ',
      descriptionVN: 'Trụ sở chính FPT Software Việt Nam'
    },
    {
      name: 'Hanoi',
      nameVN: 'Hà Nội',
      lat: 21.0285,
      lng: 105.8542,
      type: 'world',
      description: 'FPT Software Hanoi',
      descriptionVN: 'FPT Software Hà Nội'
    },
    {
      name: 'Manila',
      nameVN: 'Manila',
      lat: 14.5995,
      lng: 120.9842,
      type: 'world',
      description: 'FPT Software Philippines',
      descriptionVN: 'FPT Software Philippines'
    },
    {
      name: 'Sydney',
      nameVN: 'Sydney',
      lat: -33.8688,
      lng: 151.2093,
      type: 'world',
      description: 'FPT Software Australia',
      descriptionVN: 'FPT Software Australia'
    },
    {
      name: 'Yangon',
      nameVN: 'Yangon',
      lat: 16.8661,
      lng: 96.1951,
      type: 'world',
      description: 'FPT Software Myanmar',
      descriptionVN: 'FPT Software Myanmar'
    },
    {
      name: 'Kuala Lumpur',
      nameVN: 'Kuala Lumpur',
      lat: 3.1390,
      lng: 101.6869,
      type: 'world',
      description: 'FPT Software Malaysia',
      descriptionVN: 'FPT Software Malaysia'
    },
    {
      name: 'Bangkok',
      nameVN: 'Bangkok',
      lat: 13.7563,
      lng: 100.5018,
      type: 'world',
      description: 'FPT Software Thailand',
      descriptionVN: 'FPT Software Thailand'
    },
    {
      name: 'San Jose',
      nameVN: 'San Jose',
      lat: 37.3382,
      lng: -121.8863,
      type: 'world',
      description: 'FPT Software USA',
      descriptionVN: 'FPT Software USA'
    },
    {
      name: 'London',
      nameVN: 'London',
      lat: 51.5074,
      lng: -0.1278,
      type: 'world',
      description: 'FPT Software UK',
      descriptionVN: 'FPT Software UK'
    },
    {
      name: 'Frankfurt',
      nameVN: 'Frankfurt',
      lat: 50.1109,
      lng: 8.6821,
      type: 'world',
      description: 'FPT Software Germany',
      descriptionVN: 'FPT Software Germany'
    },
    {
      name: 'Paris',
      nameVN: 'Paris',
      lat: 48.8566,
      lng: 2.3522,
      type: 'world',
      description: 'FPT Software France',
      descriptionVN: 'FPT Software France'
    },
    {
      name: 'Seoul',
      nameVN: 'Seoul',
      lat: 37.5665,
      lng: 126.9780,
      type: 'world',
      description: 'FPT Software Korea',
      descriptionVN: 'FPT Software Korea'
    },
    {
      name: 'Mumbai',
      nameVN: 'Mumbai',
      lat: 19.0760,
      lng: 72.8777,
      type: 'world',
      description: 'FPT Software India',
      descriptionVN: 'FPT Software India'
    },
    {
      name: 'Jakarta',
      nameVN: 'Jakarta',
      lat: -6.2088,
      lng: 106.8456,
      type: 'world',
      description: 'FPT Software Indonesia',
      descriptionVN: 'FPT Software Indonesia'
    },
    {
      name: 'Dubai',
      nameVN: 'Dubai',
      lat: 25.2048,
      lng: 55.2708,
      type: 'world',
      description: 'FPT Software UAE',
      descriptionVN: 'FPT Software UAE'
    },
    {
      name: 'Toronto',
      nameVN: 'Toronto',
      lat: 43.6532,
      lng: -79.3832,
      type: 'world',
      description: 'FPT Software Canada',
      descriptionVN: 'FPT Software Canada'
    },
    {
      name: 'São Paulo',
      nameVN: 'São Paulo',
      lat: -23.5505,
      lng: -46.6333,
      type: 'world',
      description: 'FPT Software Brazil',
      descriptionVN: 'FPT Software Brazil'
    },
    {
      name: 'Mexico City',
      nameVN: 'Mexico City',
      lat: 19.4326,
      lng: -99.1332,
      type: 'world',
      description: 'FPT Software Mexico',
      descriptionVN: 'FPT Software Mexico'
    },
    {
      name: 'Buenos Aires',
      nameVN: 'Buenos Aires',
      lat: -34.6118,
      lng: -58.3960,
      type: 'world',
      description: 'FPT Software Argentina',
      descriptionVN: 'FPT Software Argentina'
    },
    {
      name: 'Cape Town',
      nameVN: 'Cape Town',
      lat: -33.9249,
      lng: 18.4241,
      type: 'world',
      description: 'FPT Software South Africa',
      descriptionVN: 'FPT Software South Africa'
    },
    {
      name: 'Cairo',
      nameVN: 'Cairo',
      lat: 30.0444,
      lng: 31.2357,
      type: 'world',
      description: 'FPT Software Egypt',
      descriptionVN: 'FPT Software Egypt'
    },
    {
      name: 'Istanbul',
      nameVN: 'Istanbul',
      lat: 41.0082,
      lng: 28.9784,
      type: 'world',
      description: 'FPT Software Turkey',
      descriptionVN: 'FPT Software Turkey'
    },
    {
      name: 'Tel Aviv',
      nameVN: 'Tel Aviv',
      lat: 32.0853,
      lng: 34.7818,
      type: 'world',
      description: 'FPT Software Israel',
      descriptionVN: 'FPT Software Israel'
    },
    {
      name: 'Warsaw',
      nameVN: 'Warsaw',
      lat: 52.2297,
      lng: 21.0122,
      type: 'world',
      description: 'FPT Software Poland',
      descriptionVN: 'FPT Software Poland'
    },
    {
      name: 'Prague',
      nameVN: 'Prague',
      lat: 50.0755,
      lng: 14.4378,
      type: 'world',
      description: 'FPT Software Czech Republic',
      descriptionVN: 'FPT Software Czech Republic'
    },
    {
      name: 'Stockholm',
      nameVN: 'Stockholm',
      lat: 59.3293,
      lng: 18.0686,
      type: 'world',
      description: 'FPT Software Sweden',
      descriptionVN: 'FPT Software Sweden'
    },
    {
      name: 'Helsinki',
      nameVN: 'Helsinki',
      lat: 60.1699,
      lng: 24.9384,
      type: 'world',
      description: 'FPT Software Finland',
      descriptionVN: 'FPT Software Finland'
    },
    {
      name: 'Oslo',
      nameVN: 'Oslo',
      lat: 59.9139,
      lng: 10.7522,
      type: 'world',
      description: 'FPT Software Norway',
      descriptionVN: 'FPT Software Norway'
    },
    {
      name: 'Copenhagen',
      nameVN: 'Copenhagen',
      lat: 55.6761,
      lng: 12.5683,
      type: 'world',
      description: 'FPT Software Denmark',
      descriptionVN: 'FPT Software Denmark'
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadLeaflet = async () => {
        const leaflet = await import('leaflet');
        const reactLeaflet = await import('react-leaflet');
        
        // Import CSS
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css);
        
        setMap(leaflet.default);
        setMapContainer(reactLeaflet.MapContainer);
        setTileLayer(reactLeaflet.TileLayer);
        setMarker(reactLeaflet.Marker);
        setPopup(reactLeaflet.Popup);
        setMounted(true);
      };
      
      loadLeaflet();
    }
  }, []);

  if (!mounted || !Map || !MapContainer) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="h-[550px] bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    );
  }

  const createCustomIcon = (type: 'japan' | 'world') => {
    const color = type === 'japan' 
      ? (themeColor === 'emerald' ? '#10b981' : '#3b82f6')
      : '#ef4444';
    
    return new Map.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="8" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12.5" cy="12.5" r="4" fill="white"/>
        </svg>
      `)}`,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };



  return (
    <div className="bg-white p-6 rounded-xl shadow-lg relative z-10">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'vn' ? 'Bản Đồ Tương Tác' : 'インタラクティブマップ'}
        </h3>
      </div>

      {/* Map */}
      <div 
        className="h-[550px] rounded-lg overflow-hidden border border-gray-200 relative z-10"
        onClick={() => setIsMapInteractive(true)}
      >
        <MapContainer
          key={isMapInteractive ? 'interactive' : 'static'} // Force re-render
          center={[35.6762, 139.6503]} // Tokyo center
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={isMapInteractive}
          doubleClickZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Markers */}
          {cities.map((city, index) => (
            <Marker
              key={index}
              position={[city.lat, city.lng]}
              icon={createCustomIcon(city.type)}
            >
              <Popup>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {language === 'vn' ? city.nameVN : city.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'vn' ? city.descriptionVN : city.description}
                  </p>
                  <div className={`mt-2 inline-block px-2 py-1 rounded text-xs text-white ${
                    city.type === 'japan' 
                      ? (themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500')
                      : 'bg-red-500'
                  }`}>
                    {city.type === 'japan' 
                      ? (language === 'vn' ? 'Nhật Bản' : '日本')
                      : (language === 'vn' ? 'Quốc tế' : '海外')
                    }
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Interactive hint overlay */}
        {!isMapInteractive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[0.5px] z-10 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm text-gray-700 font-medium">
                {language === 'vn' ? 'Click để tương tác với bản đồ' : 'クリックして地図と対話'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
