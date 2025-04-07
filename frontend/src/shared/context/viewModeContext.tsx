'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ViewMode = 'grid' | 'list';

interface ViewModeContextType {
  bucketsPageView: ViewMode;
  setBucketsPageView: (mode: ViewMode) => void;
  bucketFilesPageView: ViewMode;
  setBucketFilesPageView: (mode: ViewMode) => void;
  starredPageView: ViewMode;
  setStarredPageView: (mode: ViewMode) => void;
  sharedPageView: ViewMode;
  setSharedPageView: (mode: ViewMode) => void;
  isMounted: boolean;
}

const ViewModeContext = createContext<ViewModeContextType>({
  bucketsPageView: 'grid',
  setBucketsPageView: () => {},
  bucketFilesPageView: 'grid',
  setBucketFilesPageView: () => {},
  starredPageView: 'grid',
  setStarredPageView: () => {},
  sharedPageView: 'grid',
  setSharedPageView: () => {},
  isMounted: false
});

export const useViewMode = () => useContext(ViewModeContext);

interface ViewModeProviderProps {
  children: ReactNode;
}

export const ViewModeProvider = ({ children }: ViewModeProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  
  const [bucketsPageView, setBucketsPageView] = useState<ViewMode>('grid');
  const [bucketFilesPageView, setBucketFilesPageView] = useState<ViewMode>('grid');
  const [starredPageView, setStarredPageView] = useState<ViewMode>('grid');
  const [sharedPageView, setSharedPageView] = useState<ViewMode>('grid');

  useEffect(() => {
    const loadSavedViewModes = () => {
      const savedBucketsView = localStorage.getItem('bucketsPageView');
      if (savedBucketsView === 'grid' || savedBucketsView === 'list') {
        setBucketsPageView(savedBucketsView);
      }

      const savedBucketFilesView = localStorage.getItem('bucketFilesPageView');
      if (savedBucketFilesView === 'grid' || savedBucketFilesView === 'list') {
        setBucketFilesPageView(savedBucketFilesView);
      }

      const savedStarredView = localStorage.getItem('starredPageView');
      if (savedStarredView === 'grid' || savedStarredView === 'list') {
        setStarredPageView(savedStarredView);
      }
      
      const savedSharedView = localStorage.getItem('sharedPageView');
      if (savedSharedView === 'grid' || savedSharedView === 'list') {
        setSharedPageView(savedSharedView);
      }
      
      setIsMounted(true);
    };

    loadSavedViewModes();
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bucketsPageView', bucketsPageView);
    }
  }, [bucketsPageView, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bucketFilesPageView', bucketFilesPageView);
    }
  }, [bucketFilesPageView, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('starredPageView', starredPageView);
    }
  }, [starredPageView, isMounted]);
  
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sharedPageView', sharedPageView);
    }
  }, [sharedPageView, isMounted]);

  return (
    <ViewModeContext.Provider
      value={{
        bucketsPageView,
        setBucketsPageView,
        bucketFilesPageView,
        setBucketFilesPageView,
        starredPageView,
        setStarredPageView,
        sharedPageView,
        setSharedPageView,
        isMounted
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}; 