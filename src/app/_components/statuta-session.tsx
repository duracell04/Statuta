"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { StatutaState } from "../../domain/types";
import { createCanonicalScenario } from "../../fixtures/quartierleben-association";

interface StatutaSession {
  readonly state: StatutaState;
  readonly setState: Dispatch<SetStateAction<StatutaState>>;
  readonly selectedDocumentVersionId: string | undefined;
  readonly setSelectedDocumentVersionId: Dispatch<SetStateAction<string | undefined>>;
}

const StatutaSessionContext = createContext<StatutaSession | undefined>(undefined);

export function StatutaSessionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, setState] = useState(createCanonicalScenario);
  const [selectedDocumentVersionId, setSelectedDocumentVersionId] = useState<string>();
  const value = useMemo(
    () => ({ state, setState, selectedDocumentVersionId, setSelectedDocumentVersionId }),
    [state, selectedDocumentVersionId],
  );

  return (
    <StatutaSessionContext.Provider value={value}>{children}</StatutaSessionContext.Provider>
  );
}

export function useStatutaSession(): StatutaSession {
  const session = useContext(StatutaSessionContext);
  if (!session) throw new Error("useStatutaSession must be used within StatutaSessionProvider.");
  return session;
}

export function DocumentLanguage({ languageTag }: Readonly<{ languageTag: string }>) {
  useEffect(() => {
    document.documentElement.lang = languageTag;
  }, [languageTag]);

  return null;
}
