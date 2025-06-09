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
    
    // Updated action to update persona traits (only editable ones)
    updatePersonaTraits: (state, action) => {
      const { personaName, traits } = action.payload;
      
      // Find and update the persona in the personas array
      const personaIndex = state.personas.findIndex(p => p.name === personaName);
      if (personaIndex !== -1) {
        // Update the persona directly with the new trait values
        Object.keys(traits).forEach(traitKey => {
          if (traits[traitKey] !== undefined) {
            state.personas[personaIndex][traitKey] = traits[traitKey];
          }
        });
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
    
    // Updated action to store new API response data structure
    setApiGameData: (state, action) => {
      const apiData = action.payload;
      console.log('Setting API game data:', apiData);
      
      state.apiGameData = apiData;
      state.gameId = apiData.id;
      state.baseStory = apiData.baseStory || apiData.story || '';
      state.createdAt = apiData.createdAt;
      
      // Handle personas array - ensure we have the correct structure
      if (apiData.personas && Array.isArray(apiData.personas)) {
        console.log('Processing personas from API:', apiData.personas);
        
        // Map personas to ensure consistent structure
        state.personas = apiData.personas.map(persona => ({
          agentId: persona.agentId,
          name: persona.name,
          faction: persona.faction,
          type: persona.type,
          npcType: persona.npcType,
          age: persona.age,
          background: persona.background,
          motivation: persona.motivation,
          personality: persona.personality || {},
          skills: persona.skills || {},
          // Editable combat stats
          morale: persona.morale || 50,
          strength: persona.strength || 50,
          fatigue: persona.fatigue || 20,
          health: persona.health || 50,
          // Additional fields
          affiliation: persona.affiliation,
          terrainStronghold: persona.terrainStronghold
        }));
        
        console.log('Processed personas:', state.personas);
      } else {
        console.warn('No personas found in API data or invalid format');
        state.personas = [];
      }
      
      // Reset persona modifications when new data is loaded
      state.personaModifications = {};
      
      // Update story with API data
      if (apiData.baseStory) {
        state.story.background = apiData.baseStory;
      } else if (apiData.story) {
        state.story.background = apiData.story;
      }
      
      // Extract faction names for teams from personas
      if (state.personas.length > 0) {
        const uniqueFactions = [...new Set(state.personas.map(p => p.faction))];
        console.log('Unique factions found:', uniqueFactions);
        
        if (uniqueFactions.length >= 2) {
          state.story.team1Name = uniqueFactions[0];
          state.story.team2Name = uniqueFactions[1];
          
          // Set team sizes based on personas count
          const team1Personas = state.personas.filter(p => p.faction === uniqueFactions[0]);
          const team2Personas = state.personas.filter(p => p.faction === uniqueFactions[1]);
          
          state.story.team1Size = team1Personas.length;
          state.story.team2Size = team2Personas.length;
          
          console.log(`Team 1 (${uniqueFactions[0]}): ${team1Personas.length} personas`);
          console.log(`Team 2 (${uniqueFactions[1]}): ${team2Personas.length} personas`);
        } else if (uniqueFactions.length === 1) {
          // If only one faction, split into two teams
          const allPersonas = state.personas;
          const midPoint = Math.ceil(allPersonas.length / 2);
          
          state.story.team1Name = uniqueFactions[0] + ' Alpha';
          state.story.team2Name = uniqueFactions[0] + ' Beta';
          state.story.team1Size = midPoint;
          state.story.team2Size = allPersonas.length - midPoint;
          
          // Update personas to have the new faction names
          state.personas = state.personas.map((persona, index) => ({
            ...persona,
            faction: index < midPoint ? state.story.team1Name : state.story.team2Name
          }));
          
          console.log(`Split single faction into two teams: ${state.story.team1Name} (${midPoint}) vs ${state.story.team2Name} (${allPersonas.length - midPoint})`);
        } else {
          // Fallback to default team names
          state.story.team1Name = 'Team Alpha';
          state.story.team2Name = 'Team Beta';
          state.story.team1Size = Math.ceil(state.personas.length / 2);
          state.story.team2Size = Math.floor(state.personas.length / 2);
        }
      } else {
        // No personas, use default values
        state.story.team1Name = 'Team Alpha';
        state.story.team2Name = 'Team Beta';
        state.story.team1Size = 4;
        state.story.team2Size = 4;
      }
    },
    
    // Updated action to convert personas to characters with new structure
    convertPersonasToCharacters: (state) => {
      if (!state.personas.length) {
        console.log('No personas to convert to characters');
        return;
      }
      
      console.log('Converting personas to characters:', state.personas);
      
      const newCharacters = {};
      const team1Name = state.story.team1Name;
      const team2Name = state.story.team2Name;
      
      // Character type mapping based on type field
      const typeToCharacterType = {
        'Commander': 'commander',
        'Scout': 'scout',
        'Medic': 'medic',
        'Infantry': 'assault',
        'Sabotager': 'demolition',
        'Sniper': 'sniper',
        'Engineer': 'engineer'
      };
      
      state.personas.forEach((persona, index) => {
        const team = persona.faction === team1Name ? 1 : 2;
        const characterType = typeToCharacterType[persona.type] || 'assault';
        const key = `team${team}_${characterType}_${index}`;
        
        console.log(`Converting persona ${persona.name} to character ${key}`);
        
        // Convert persona data to our character stats format
        newCharacters[key] = {
          // Map the four editable traits directly
          fatigue: persona.fatigue || 20,
          moral: persona.morale || 50,
          health: persona.health || 50,
          terrain: persona.terrainStronghold ? 75 : 50, // Use terrain stronghold as terrain advantage
          
          // Store complete persona data for reference
          personaData: {
            agentId: persona.agentId,
            name: persona.name,
            faction: persona.faction,
            type: persona.type,
            npcType: persona.npcType,
            age: persona.age,
            background: persona.background,
            motivation: persona.motivation,
            personality: persona.personality,
            skills: persona.skills,
            affiliation: persona.affiliation,
            terrainStronghold: persona.terrainStronghold,
            // Store original values for reference
            originalMorale: persona.morale,
            originalStrength: persona.strength,
            originalFatigue: persona.fatigue,
            originalHealth: persona.health
          }
        };
      });
      
      console.log('Generated characters:', newCharacters);
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
      console.log('Loading experience data:', experienceData);
      
      // Don't override the story if we already have API data
      if (!state.apiGameData) {
        state.story = experienceData.story;
        state.characters = experienceData.characters;
      }
      
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