import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Screen transitions
  isTransitioning: false,
  transitionDirection: 'forward', // 'forward' or 'backward'
  
  // Loading states
  globalLoading: false,
  loadingMessage: '',
  
  // Modals and overlays
  modals: {
    mapEditor: false,
    characterDetails: false,
    settings: false,
    help: false
  },
  
  // Notifications
  notifications: [],
  
  // Theme and display
  theme: 'dark',
  animations: true,
  soundEnabled: true,
  
  // Form states
  forms: {
    story: {
      isDirty: false,
      isValid: true,
      errors: {}
    },
    character: {
      isDirty: false,
      isValid: true,
      errors: {}
    }
  },
  
  // Navigation history
  navigationHistory: ['main'],
  
  // Mobile/responsive
  isMobile: false,
  screenSize: 'desktop', // 'mobile', 'tablet', 'desktop'
  
  // Performance
  performanceMode: false,
  reducedMotion: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTransitioning: (state, action) => {
      state.isTransitioning = action.payload;
    },
    
    setTransitionDirection: (state, action) => {
      state.transitionDirection = action.payload;
    },
    
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || '';
    },
    
    toggleModal: (state, action) => {
      const { modalName, isOpen } = action.payload;
      state.modals[modalName] = isOpen;
    },
    
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'info', // 'success', 'error', 'warning', 'info'
        autoClose: true,
        duration: 5000,
        ...action.payload
      };
      
      state.notifications.push(notification);
      
      // Keep only last 5 notifications
      if (state.notifications.length > 5) {
        state.notifications = state.notifications.slice(-5);
      }
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    toggleAnimations: (state) => {
      state.animations = !state.animations;
    },
    
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    
    updateFormState: (state, action) => {
      const { formName, updates } = action.payload;
      state.forms[formName] = { ...state.forms[formName], ...updates };
    },
    
    addToNavigationHistory: (state, action) => {
      state.navigationHistory.push(action.payload);
      
      // Keep only last 10 screens in history
      if (state.navigationHistory.length > 10) {
        state.navigationHistory = state.navigationHistory.slice(-10);
      }
    },
    
    goBackInHistory: (state) => {
      if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop();
      }
    },
    
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
      state.isMobile = action.payload === 'mobile';
    },
    
    setPerformanceMode: (state, action) => {
      state.performanceMode = action.payload;
    },
    
    setReducedMotion: (state, action) => {
      state.reducedMotion = action.payload;
    },
    
    resetUI: (state) => {
      return {
        ...initialState,
        theme: state.theme,
        animations: state.animations,
        soundEnabled: state.soundEnabled,
        screenSize: state.screenSize,
        isMobile: state.isMobile
      };
    }
  }
});

export const {
  setTransitioning,
  setTransitionDirection,
  setGlobalLoading,
  toggleModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  toggleAnimations,
  toggleSound,
  updateFormState,
  addToNavigationHistory,
  goBackInHistory,
  setScreenSize,
  setPerformanceMode,
  setReducedMotion,
  resetUI
} = uiSlice.actions;

export default uiSlice.reducer;