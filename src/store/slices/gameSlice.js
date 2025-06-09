import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentScreen: 'main',
  story: {
    background: '',
    team1Name: '',
    team1Size: 4,
    team2Name: '',
    team2Size: 4,
    characters: '',
    // New fields for team sizes
    teamSizeA: 4,
    teamSizeB: 4
  },
  characters: {},
  currentCharacter: null,
  currentTeam: null,
  battlefieldMap: null,
  selectedExperience: null,
  gameMode: 'create', // 'create' or 'experience'
  warData: null,
  gameSettings: {
    difficulty: 'medium',
    autoSave: true,
    soundEnabled: true
  },
  // New fields for API response data
  apiGameData: null,
  personas: [],
  factions: {},
  baseStory: '',
  gameId: null,
  createdAt: null,
  // Track persona modifications
  personaModifications: {}
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    
    updateStory: (state, action) => {
      state.story = { ...state.story, ...action.payload };
    },
    
    updateCharacters: (state, action) => {
      state.characters = { ...state.characters, ...action.payload };
    },
    
    saveCharacter: (state, action) => {
      const { characterKey, stats } = action.payload;
      state.characters[characterKey] = stats;
    },
    
    setCurrentCharacter: (state, action) => {
      state.currentCharacter = action.payload;
    },
    
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
    
    setBattlefieldMap: (state, action) => {
      state.battlefieldMap = action.payload;
    },
    
    setSelectedExperience: (state, action) => {
      state.selectedExperience = action.payload;
    },
    
    setGameMode: (state, action) => {
      state.gameMode = action.payload;
    },
    
    setWarData: (state, action) => {
      state.warData = action.payload;
    },
    
    updateGameSettings: (state, action) => {
      state.gameSettings = { ...state.gameSettings, ...action.payload };
    },
    
    // New action to update persona traits
    updatePersonaTraits: (state, action) => {
      const { personaName, traits } = action.payload;
      
      // Find and update the persona in the personas array
      const personaIndex = state.personas.findIndex(p => p.name === personaName);
      if (personaIndex !== -1) {
        state.personas[personaIndex].traits = { 
          ...state.personas[personaIndex].traits, 
          ...traits 
        };
      }
      
      // Track modifications for potential API sync later
      state.personaModifications[personaName] = {
        ...state.personaModifications[personaName],
        traits: { 
          ...(state.personaModifications[personaName]?.traits || {}), 
          ...traits 
        },
        lastModified: new Date().toISOString()
      };
    },
    
    // Action to save persona changes (for UI feedback)
    savePersonaChanges: (state, action) => {
      const { personaName } = action.payload;
      if (state.personaModifications[personaName]) {
        state.personaModifications[personaName].saved = true;
      }
    },
    
    // Action to reset persona modifications
    resetPersonaModifications: (state) => {
      state.personaModifications = {};
    },
    
    // New action to store API response data
    setApiGameData: (state, action) => {
      const apiData = action.payload;
      state.apiGameData = apiData;
      state.gameId = apiData.id;
      state.personas = apiData.personas || [];
      state.factions = apiData.factions || {};
      state.baseStory = apiData.baseStory || '';
      state.createdAt = apiData.createdAt;
      
      // Reset persona modifications when new data is loaded
      state.personaModifications = {};
      
      // Update story with API data
      if (apiData.story) {
        state.story.background = apiData.story;
      }
      if (apiData.baseStory) {
        state.story.background = apiData.baseStory;
      }
      
      // Extract faction names for teams
      const factionNames = Object.keys(apiData.factions || {});
      if (factionNames.length >= 2) {
        state.story.team1Name = factionNames[0];
        state.story.team2Name = factionNames[1];
      } else {
        // Use personas' factions
        const uniqueFactions = [...new Set(apiData.personas?.map(p => p.faction) || [])];
        if (uniqueFactions.length >= 2) {
          state.story.team1Name = uniqueFactions[0];
          state.story.team2Name = uniqueFactions[1];
        }
      }
      
      // Set team sizes based on personas count or use the submitted team sizes
      const team1Personas = apiData.personas?.filter(p => p.faction === state.story.team1Name) || [];
      const team2Personas = apiData.personas?.filter(p => p.faction === state.story.team2Name) || [];
      
      // Use the team sizes from the story submission if available, otherwise use persona count
      state.story.team1Size = state.story.teamSizeA || Math.max(team1Personas.length, 4);
      state.story.team2Size = state.story.teamSizeB || Math.max(team2Personas.length, 4);
    },
    
    // Action to convert personas to characters
    convertPersonasToCharacters: (state) => {
      if (!state.personas.length) return;
      
      const newCharacters = {};
      const team1Name = state.story.team1Name;
      const team2Name = state.story.team2Name;
      
      // Character type mapping based on role
      const roleToType = {
        'Commander': 'commander',
        'Scout': 'scout',
        'Medic': 'medic',
        'Infantry': 'assault',
        'Sabotager': 'demolition'
      };
      
      state.personas.forEach((persona, index) => {
        const team = persona.faction === team1Name ? 1 : 2;
        const characterType = roleToType[persona.role] || 'assault';
        const key = `team${team}_${characterType}_${index}`;
        
        // Convert persona traits to our character stats
        newCharacters[key] = {
          fatigue: Math.min(100 - (persona.traits.fatigue || 20), 100),
          moral: persona.traits.morale || persona.traits.moral || 50,
          health: persona.traits.health || 50,
          terrain: persona.traits.adaptability || 50,
          // Store additional persona data
          personaData: {
            name: persona.name,
            role: persona.role,
            npcType: persona.npcType,
            backstory: persona.backstory,
            motivation: persona.motivation,
            traits: persona.traits
          }
        };
      });
      
      state.characters = { ...state.characters, ...newCharacters };
    },
    
    resetGame: (state) => {
      return {
        ...initialState,
        gameSettings: state.gameSettings // Preserve settings
      };
    },
    
    loadExperienceData: (state, action) => {
      const experienceData = action.payload;
      state.story = experienceData.story;
      state.characters = experienceData.characters;
      state.gameMode = 'experience';
      state.selectedExperience = experienceData.id;
    }
  }
});

export const {
  setCurrentScreen,
  updateStory,
  updateCharacters,
  saveCharacter,
  setCurrentCharacter,
  setCurrentTeam,
  setBattlefieldMap,
  setSelectedExperience,
  setGameMode,
  setWarData,
  updateGameSettings,
  updatePersonaTraits,
  savePersonaChanges,
  resetPersonaModifications,
  setApiGameData,
  convertPersonasToCharacters,
  resetGame,
  loadExperienceData
} = gameSlice.actions;

export default gameSlice.reducer;