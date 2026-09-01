import { createContext, useContext, useState } from "react";
import { SDRS, type SDR } from "../data/sdrs";

type SDRContextType = {
  activeSdr: SDR;
  setActiveSdr: (sdr: SDR) => void;
  allSdrs: SDR[];
};

const SDRContext = createContext<SDRContextType | null>(null);

export function SDRProvider({ children }: { children: React.ReactNode }) {
  const [activeSdr, setActiveSdr] = useState<SDR>(SDRS[0]);
  return (
    <SDRContext.Provider value={{ activeSdr, setActiveSdr, allSdrs: SDRS }}>
      {children}
    </SDRContext.Provider>
  );
}

export function useSDR() {
  const ctx = useContext(SDRContext);
  if (!ctx) throw new Error("useSDR must be used within SDRProvider");
  return ctx;
}
