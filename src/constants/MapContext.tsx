import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useMemo,
    useState,
  } from "react";
  
  import { LatLngLiteral } from "leaflet";
  
  
  
  export interface MapContextProps {
    children?: ReactNode;
    locationEnabled?: boolean;
   // updatingData:boolean;
    setLocationEnabled?: Dispatch<SetStateAction<boolean>>;
    setListSourceName?: Dispatch<SetStateAction<string[]>>;
    positionOrigin?: LatLngLiteral | null;
    setPositionOrigin?: Dispatch<SetStateAction<LatLngLiteral | null>>;
    markers?: LatLngLiteral[] | null;
    setMarkers?: Dispatch<SetStateAction<LatLngLiteral[]>>;
    listSource?: any[];
    //updateProbe?: (updateParams: UpdateParams) => Promise<void>;
  }
  export interface GetListBody {
    start: number;
    stop: number;
  }
  
  export const MapContext = createContext<MapContextProps | null>(null);
  
  const MapProvider = ({ children }: MapContextProps) => {
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [listSource, setListSource] = useState<any[]>([]);
   
    const [positionOrigin, setPositionOrigin] = useState<LatLngLiteral | null>(
      null
    );
   
    const [markers, setMarkers] = useState<LatLngLiteral[]>([]);
    const [updatingData, setUpdatingData] = useState<boolean>(false);
    
    // const getListSource = async () => {
    //   try {
    //     const listSource: any[] = await ;
    //     setListSource(listSource);
    //    setUpdatingData(true);
    //     const filteredMarkers = listSource
    //       ?.filter((source) => {
    //         return (
    //           source.latitude !== 0 &&
    //           source.longitude !== 0 &&
    //           source.altitude !== 0
    //         );
    //       })
    //       .map((source) => ({
    //         lat: source.latitude,
    //         lng: source.longitude,
    //         alt: source.altitude,
    //       }));
    //     setMarkers!(filteredMarkers as LatLngLiteral[]);
    //     setLocationEnabled(true)
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    const apiUrl = import.meta.env.VITE_API_URL;

const fetchBoutiques = async () => {
  try {
    const response = await fetch(`${apiUrl}/boutique`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const boutiques = await response.json();
    console.log(boutiques);
  } catch (error) {
    console.error('Failed to fetch boutiques:', error);
  }
};
    const getLocation = () => {
      if (navigator.geolocation) {
        setLocationEnabled(false)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPositionOrigin({ lat: latitude, lng: longitude });
            setLocationEnabled(true)
          },
          (error) => {
            setLocationEnabled(true)
            console.error("geoloc error:", error.message);
          }
        );
      } else {
        console.error(
          "no geoloc on your browser"
        );
      }
    };
    // const updateProbe = async (updateParams: UpdateParams) => {
    //   setUpdatingData(false);
    //   try {
    //     await updateAProbe(updateParams);
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   setUpdatingData(true);
    // };
  
   
    useMemo(() => {
       getLocation();
       fetchBoutiques();
      //getListSource();
    }, []);
  
    return (
      <MapContext.Provider
        value={{
          locationEnabled,
        // updatingData,
          setLocationEnabled,
          positionOrigin,
          setPositionOrigin,
          markers,
          setMarkers,
          listSource,
         // updateProbe,
        }}
      >
        {children}
      </MapContext.Provider>
    );
  };
  
  export default MapProvider;