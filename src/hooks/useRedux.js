import { useSelector, useDispatch } from 'react-redux';

// Custom hooks for easier Redux usage
export const useAppSelector = (selector) => useSelector(selector);
export const useAppDispatch = () => useDispatch();

// Game state hooks
export const useGameState = () => {
  return useAppSelector(state => state.game);
};

export const useCurrentScreen = () => {
  return useAppSelector(state => state.game.currentScreen);
};

export const useStoryData = () => {
  return useAppSelector(state => state.game.story);
};

export const useCharacters = () => {
  return useAppSelector(state => state.game.characters);
};

export const useBattlefieldMap = () => {
  return useAppSelector(state => state.game.battlefieldMap);
};

// New hooks for API response data
export const useApiGameData = () => {
  return useAppSelector(state => state.game.apiGameData);
};

export const usePersonas = () => {
  return useAppSelector(state => state.game.personas);
};

export const useFactions = () => {
  return useAppSelector(state => state.game.factions);
};

export const useBaseStory = () => {
  return useAppSelector(state => state.game.baseStory);
};

export const useGameId = () => {
  return useAppSelector(state => state.game.gameId);
};

// API state hooks
export const useApiState = () => {
  return useAppSelector(state => state.api);
};

export const useStorySubmission = () => {
  return useAppSelector(state => state.api.storySubmission);
};

export const useGameBattleInit = () => {
  return useAppSelector(state => state.api.gameBattleInit);
};

export const useExperiences = () => {
  return useAppSelector(state => state.api.experiences);
};

// New hook for experience data with pagination
export const useExperienceData = () => {
  return useAppSelector(state => state.api.experienceData);
};

export const useWarResults = () => {
  return useAppSelector(state => state.api.warResults);
};

export const useGameDataFetch = () => {
  return useAppSelector(state => state.api.gameDataFetch);
};

// UI state hooks
export const useUIState = () => {
  return useAppSelector(state => state.ui);
};

export const useNotifications = () => {
  return useAppSelector(state => state.ui.notifications);
};

export const useModals = () => {
  return useAppSelector(state => state.ui.modals);
};

export const useTheme = () => {
  return useAppSelector(state => state.ui.theme);
};

export const useFormState = (formName) => {
  return useAppSelector(state => state.ui.forms[formName]);
};

// Combined hooks for common use cases
export const useGameAndUI = () => {
  const game = useGameState();
  const ui = useUIState();
  return { game, ui };
};

export const useLoadingStates = () => {
  const apiLoading = useAppSelector(state => ({
    story: state.api.storySubmission.loading,
    experiences: state.api.experiences.loading,
    experienceData: state.api.experienceData.loading,
    gameBattleInit: state.api.gameBattleInit.loading,
    warResults: state.api.warResults.loading,
    gameData: state.api.gameDataFetch.loading
  }));
  
  const uiLoading = useAppSelector(state => state.ui.globalLoading);
  
  return {
    ...apiLoading,
    global: uiLoading,
    any: Object.values(apiLoading).some(Boolean) || uiLoading
  };
};

// Hook to get personas by faction
export const usePersonasByFaction = (factionName) => {
  return useAppSelector(state => 
    state.game.personas.filter(persona => persona.faction === factionName)
  );
};

// Hook to get character data with persona information
export const useEnhancedCharacters = () => {
  return useAppSelector(state => {
    const characters = state.game.characters;
    const enhancedCharacters = {};
    
    Object.keys(characters).forEach(key => {
      const character = characters[key];
      enhancedCharacters[key] = {
        ...character,
        // Include persona data if available
        displayName: character.personaData?.name || character.name,
        backstory: character.personaData?.backstory,
        motivation: character.personaData?.motivation,
        npcType: character.personaData?.npcType,
        originalTraits: character.personaData?.traits
      };
    });
    
    return enhancedCharacters;
  });
};