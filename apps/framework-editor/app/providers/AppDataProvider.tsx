'use client'

import { useEffect, useState, ReactNode, useCallback } from 'react'
import {
  frameworks as pkgFrameworks,
  requirements as pkgRequirements,
  policies as dataPolicies,
  controls as dataControls,
  tasks as dataTasks,
  type TemplatePolicies,
  type TemplateControl,
  type TemplateTaskMap,
  type Framework as CompDataFramework,
  type Requirement as CompDataRequirement
} from '@comp/data'
import { Button } from '@/components/ui/button'
import { AppDataContext, InitialData } from '../contexts/AppDataContext'

const LOCAL_STORAGE_KEY = 'comp-initial-data'

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [appData, setAppData] = useState<InitialData>({
    frameworks: null,
    requirements: null,
    policies: null,
    controls: null,
    tasks: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  const persistData = useCallback((dataToPersist: InitialData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToPersist))
    console.log('AppData persisted to local storage.')
  }, [])

  const loadAndSetData = useCallback((source: 'package' | 'localStorage', data?: string | null) => {
    console.log(`Initializing data from ${source}...`)
    let loadedData: InitialData | null = null

    if (source === 'localStorage' && data) {
      try {
        loadedData = JSON.parse(data) as InitialData
      } catch (error) {
        console.error('Failed to parse data from local storage:', error)
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        return loadAndSetData('package')
      }
    }

    if (!loadedData || source === 'package') {
      const frameworksAsRecord: Record<string, CompDataFramework> = { ...(pkgFrameworks || {}) };
      
      const requirementsAsRecord: Record<string, Record<string, CompDataRequirement>> = {};
      if (pkgRequirements) {
        for (const fwId in pkgRequirements) {
          requirementsAsRecord[fwId] = pkgRequirements[fwId as keyof typeof pkgRequirements];
        }
      }
      
      loadedData = {
        frameworks: frameworksAsRecord,
        requirements: requirementsAsRecord,
        policies: dataPolicies,
        controls: dataControls,
        tasks: dataTasks,
      }
      persistData(loadedData)
      console.log('Data initialized from @comp/data and stored in local storage.')
    } else {
      console.log('Data loaded from local storage.')
    }

    setAppData(loadedData)
    setIsLoading(false)
  }, [persistData])

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedData) {
      loadAndSetData('localStorage', storedData)
    } else {
      loadAndSetData('package')
    }
  }, [loadAndSetData])

  const reinitializeData = useCallback(() => {
    console.log('Clearing local storage and re-initializing...')
    setIsLoading(true)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    loadAndSetData('package')
  }, [loadAndSetData])

  const addFramework = useCallback((frameworkId: string, framework: CompDataFramework) => {
    setAppData(prevAppData => {
      if (!prevAppData.frameworks) {
        console.error("Attempted to add framework when appData.frameworks is null.");
        return prevAppData; 
      }
      const updatedFrameworks = {
        ...prevAppData.frameworks,
        [frameworkId]: framework,
      };
      const newAppData = { ...prevAppData, frameworks: updatedFrameworks };
      persistData(newAppData);
      return newAppData;
    });
  }, [persistData]);

  const updateFramework = useCallback((frameworkId: string, frameworkData: Partial<CompDataFramework>) => {
    setAppData(prevAppData => {
      if (!prevAppData.frameworks || !prevAppData.frameworks[frameworkId]) {
        console.error("Attempted to update a non-existent framework or frameworks is null.");
        return prevAppData;
      }
      const updatedFrameworks = {
        ...prevAppData.frameworks,
        [frameworkId]: {
          ...prevAppData.frameworks[frameworkId],
          ...frameworkData,
        },
      };
      const newAppData = { ...prevAppData, frameworks: updatedFrameworks };
      persistData(newAppData);
      return newAppData;
    });
  }, [persistData]);

  const deleteFramework = useCallback((frameworkId: string) => {
    setAppData(prevAppData => {
      if (!prevAppData.frameworks) {
        console.error("Attempted to delete framework when appData.frameworks is null.");
        return prevAppData;
      }
      const { [frameworkId]: _, ...remainingFrameworks } = prevAppData.frameworks;
      const newAppData = { ...prevAppData, frameworks: remainingFrameworks };
      persistData(newAppData);
      return newAppData;
    });
  }, [persistData]);

  return (
    <AppDataContext.Provider value={{ 
      appData, 
      isLoading, 
      reinitializeData,
      addFramework,
      updateFramework,
      deleteFramework
    }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={reinitializeData} variant="outline" size="sm" className="bg-white hover:bg-gray-100">
          Clear & Re-initialize Data
        </Button>
      </div>
    </AppDataContext.Provider>
  )
} 