import { createContext, useContext, useEffect, useState } from "react";
import { SDRS, type SDR } from "../data/sdrs";
import { useAuth } from "./AuthContext";

type SDRContextType = {
  activeSdr: SDR;
  setActiveSdr: (sdr: SDR) => void;
  allSdrs: SDR[];
};

const SDRContext = createContext<SDRContextType | null>(null);

export function SDRProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activeSdr, setActiveSdr] = useState<SDR>(SDRS[0]);

  // Once the real logged-in user resolves, default the "active SDR" view
  // to whoever actually signed in instead of always the first mock SDR.
  useEffect(() => {
    if (!user) return;
    const matched = SDRS.find((s) => s.email.toLowerCase() === user.email.toLowerCase());
    if (matched) setActiveSdr(matched);
  }, [user]);

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
