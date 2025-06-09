import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Updated base URL with war_backend endpoint
const API_BASE_URL = 'https://13.204.53.42.sslip.io/cms_backend';

function createTeams(characters) {
  const teamStructure = {
    team_one: {
      name: "",
      persona: []
    },
    team_two: {
      name: "",
      persona: []
    }
  };

  const factions = {};

  // Group characters by faction
  characters.forEach(char => {
    const faction = char.faction;
    if (!factions[faction]) {
      factions[faction] = [];
    }
    factions[faction].push(char);
  });

  // Extract faction names
  const factionNames = Object.keys(factions);

  // Assign teams
  if (factionNames.length >= 2) {
    teamStructure.team_one.name = factionNames[0];
    teamStructure.team_one.persona = factions[factionNames[0]];

    teamStructure.team_two.name = factionNames[1];
    teamStructure.team_two.persona = factions[factionNames[1]];
  } else {
    console.warn("Not enough factions to form two teams.");
  }

  return teamStructure;
}

// Async thunk for submitting story to API
export const submitStoryToAPI = createAsyncThunk(
  'api/submitStory',
  async (storyData, { rejectWithValue, dispatch }) => {
    try {
      // Handle both string and object payload formats
      let payload;
      if (typeof storyData === 'string') {
        // Legacy format - just the story text
        payload = {
          story: storyData
        };
      } else {
        // New format - object with story and team sizes
        payload = {
          story: storyData.story,
          teamSizeA: storyData.teamSizeA || 4,
          teamSizeB: storyData.teamSizeB || 4
        };
      }

      const response = await axios.post(`${API_BASE_URL}/gamestory`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 100000
      });

      let formattedResponse = {};

      if(response?.data?.data){
        formattedResponse = {
          ...response.data.data,
          ...createTeams(response.data.data?.personas)
        };
      }

      console.log('API Response:', response.data);
      
      // Dispatch action to store the API response in game state
      dispatch({ type: 'game/setApiGameData', payload: formattedResponse });
      dispatch({ type: 'game/convertPersonasToCharacters' });
      
      return response.data;
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      }
      
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

// New async thunk for initializing the game battle
export const initializeGameBattle = createAsyncThunk(
  'api/initializeGameBattle',
  async (gameData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://13.204.53.42.sslip.io/war_backend/api/game/initialize', gameData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 100000
      });
      
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to initialize game battle';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'Unable to connect to the game server. Please check your connection.';
      }
      
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

// New async thunk for fetching experience mode data (simplified without pagination)
export const fetchExperienceData = createAsyncThunk(
  'api/fetchExperienceData',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamestory`, {
        timeout: 100000
      });
      
      console.log('Experience data API response:', response.data);
      
      // Handle different response structures
      let experienceData = [];
      
      if (response.data) {
        if (response.data.data?.stories && Array.isArray(response.data.data?.stories)) {
          experienceData = response.data.data?.stories;
        } else if (response.data.personas) {
          // Single experience object
          experienceData = [response.data];
        } else {
          console.warn('Unexpected API response structure:', response.data);
          // Try to use the response as a single experience
          experienceData = [response.data];
        }
      }
      
      // Ensure each experience has the required structure
      experienceData = experienceData.map((item, index) => {
        // Ensure personas is an array
        if (!Array.isArray(item.personas)) {
          console.warn(`Experience ${index} has invalid personas:`, item.personas);
          item.personas = [];
        }
        
        // Ensure each persona has required fields
        if (item.personas) {
          item.personas = item.personas.map(persona => ({
            agentId: persona.agentId || `agent_${Math.random().toString(36).substr(2, 9)}`,
            name: persona.name || 'Unknown Warrior',
            faction: persona.faction || 'Unknown Faction',
            type: persona.type || 'Infantry',
            npcType: persona.npcType || 'Warrior',
            age: persona.age || 25,
            background: persona.background || 'A skilled warrior ready for battle.',
            motivation: persona.motivation || 'To fight for their cause.',
            personality: persona.personality || {},
            skills: persona.skills || {},
            morale: persona.morale || 50,
            strength: persona.strength || 50,
            fatigue: persona.fatigue || 20,
            health: persona.health || 50,
            affiliation: persona.affiliation || '',
            terrainStronghold: persona.terrainStronghold || ''
          }));
        }
        
        return {
          id: item.id || `exp_${index}`,
          title: item.title || item.story || `Experience ${index + 1}`,
          baseStory: item.baseStory || item.story || 'An epic battle awaits...',
          story: item.story || item.baseStory || 'An epic battle awaits...',
          personas: item.personas,
          difficulty: item.difficulty || 'Medium',
          createdAt: item.createdAt || new Date().toISOString()
        };
      });
      
      console.log('Processed experience data:', experienceData);
      
      return {
        data: experienceData,
        hasMore: false // No pagination, so no more data to load
      };
    } catch (error) {
      let errorMessage = 'Failed to fetch experience data';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      }
      
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

// Async thunk for fetching game experiences (legacy - keeping for backward compatibility)
export const fetchGameExperiences = createAsyncThunk(
  'api/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamestory`, {
        timeout: 100000
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch game experiences',
        status: error.response?.status
      });
    }
  }
);

// Async thunk for submitting war results
export const submitWarResults = createAsyncThunk(
  'api/submitWarResults',
  async (warData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/gamestory`, warData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 100000
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to submit war results',
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

// Async thunk for fetching existing game data by ID
export const fetchGameDataById = createAsyncThunk(
  'api/fetchGameData',
  async (gameId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamestory`, {
        timeout: 100000
      });
      
      // Dispatch action to store the API response in game state
      dispatch({ type: 'game/setApiGameData', payload: response.data });
      dispatch({ type: 'game/convertPersonasToCharacters' });
      
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch game data',
        status: error.response?.status
      });
    }
  }
);

const initialState = {
  // Story API state
  storySubmission: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  
  // Game battle initialization state
  gameBattleInit: {
    loading: false,
    success: false,
    error: null,
    data: null,
    sessionId: null,
    mapId: null
  },
  
  // Experience data state (simplified without pagination)
  experienceData: {
    loading: false,
    data: [],
    error: null,
    hasMore: false,
    totalLoaded: 0,
    lastFetched: null
  },
  
  // Experiences API state (legacy)
  experiences: {
    loading: false,
    data: [],
    error: null,
    lastFetched: null
  },
  
  // War results API state
  warResults: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  
  // Game data fetch state
  gameDataFetch: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  
  // General API state
  isOnline: true,
  lastApiCall: null,
  apiErrors: [],
  retryCount: 0
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    clearStorySubmission: (state) => {
      state.storySubmission = {
        loading: false,
        success: false,
        error: null,
        data: null
      };
    },
    
    clearGameBattleInit: (state) => {
      state.gameBattleInit = {
        loading: false,
        success: false,
        error: null,
        data: null,
        sessionId: null,
        mapId: null
      };
    },
    
    clearExperienceData: (state) => {
      state.experienceData = {
        loading: false,
        data: [],
        error: null,
        hasMore: false,
        totalLoaded: 0,
        lastFetched: null
      };
    },
    
    clearWarResults: (state) => {
      state.warResults = {
        loading: false,
        success: false,
        error: null,
        data: null
      };
    },
    
    clearGameDataFetch: (state) => {
      state.gameDataFetch = {
        loading: false,
        success: false,
        error: null,
        data: null
      };
    },
    
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    addApiError: (state, action) => {
      state.apiErrors.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      });
      
      // Keep only last 10 errors
      if (state.apiErrors.length > 10) {
        state.apiErrors = state.apiErrors.slice(-10);
      }
    },
    
    clearApiErrors: (state) => {
      state.apiErrors = [];
    },
    
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    
    resetRetryCount: (state) => {
      state.retryCount = 0;
    }
  },
  
  extraReducers: (builder) => {
    // Story submission
    builder
      .addCase(submitStoryToAPI.pending, (state) => {
        state.storySubmission.loading = true;
        state.storySubmission.error = null;
        state.lastApiCall = new Date().toISOString();
      })
      .addCase(submitStoryToAPI.fulfilled, (state, action) => {
        state.storySubmission.loading = false;
        state.storySubmission.success = true;
        state.storySubmission.data = action.payload;
        state.retryCount = 0;
      })
      .addCase(submitStoryToAPI.rejected, (state, action) => {
        state.storySubmission.loading = false;
        state.storySubmission.error = action.payload;
        state.apiErrors.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: 'story_submission',
          error: action.payload
        });
      });
    
    // Game battle initialization
    builder
      .addCase(initializeGameBattle.pending, (state) => {
        state.gameBattleInit.loading = true;
        state.gameBattleInit.error = null;
        state.lastApiCall = new Date().toISOString();
      })
      .addCase(initializeGameBattle.fulfilled, (state, action) => {
        state.gameBattleInit.loading = false;
        state.gameBattleInit.success = true;
        state.gameBattleInit.data = action.payload;
        state.gameBattleInit.sessionId = action.payload.sessionId;
        state.gameBattleInit.mapId = action.payload.battlemap?.mapId;
        state.retryCount = 0;
      })
      .addCase(initializeGameBattle.rejected, (state, action) => {
        state.gameBattleInit.loading = false;
        state.gameBattleInit.error = action.payload;
        state.apiErrors.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: 'game_battle_init',
          error: action.payload
        });
      });
    
    // Experience data fetching (simplified)
    builder
      .addCase(fetchExperienceData.pending, (state) => {
        state.experienceData.loading = true;
        state.experienceData.error = null;
        state.lastApiCall = new Date().toISOString();
      })
      .addCase(fetchExperienceData.fulfilled, (state, action) => {
        const { data, hasMore } = action.payload;
        
        state.experienceData.loading = false;
        state.experienceData.error = null;
        state.experienceData.hasMore = hasMore;
        state.experienceData.lastFetched = new Date().toISOString();
        state.retryCount = 0;
        
        // Set all data at once (no pagination)
        state.experienceData.data = Array.isArray(data) ? data : [data];
        state.experienceData.totalLoaded = Array.isArray(data) ? data.length : 1;
      })
      .addCase(fetchExperienceData.rejected, (state, action) => {
        state.experienceData.loading = false;
        state.experienceData.error = action.payload;
        state.apiErrors.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: 'experience_data_fetch',
          error: action.payload
        });
      });
    
    // Experiences fetching (legacy)
    builder
      .addCase(fetchGameExperiences.pending, (state) => {
        state.experiences.loading = true;
        state.experiences.error = null;
        state.lastApiCall = new Date().toISOString();
      })
      .addCase(fetchGameExperiences.fulfilled, (state, action) => {
        state.experiences.loading = false;
        state.experiences.data = action.payload;
        state.experiences.lastFetched = new Date().toISOString();
        state.retryCount = 0;
      })
      .addCase(fetchGameExperiences.rejected, (state, action) => {
        state.experiences.loading = false;
        state.experiences.error = action.payload;
        state.apiErrors.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: 'experiences_fetch',
          error: action.payload
        });
      });
    
    // War results submission
    builder
      .addCase(submitWarResults.pending, (state) => {
        state.warResults.loading = true;
        state.warResults.error = null;
        state.lastApiCall = new Date().toISOString();
      })
      .addCase(submitWarResults.fulfilled, (state, action) => {
        state.warResults.loading = false;
        state.warResults.success = true;
        state.warResults.data = action.payload;
        state.retryCount = 0;
      })
      .addCase(submitWarResults.rejected, (state, action) => {
        state.warResults.loading = false;
        state.warResults.error = action.payload;
        state.apiErrors.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: 'war_results',
          error: action.payload
        });
      });
    
    // Game data fetching
    builder
      .addCase(fetchGameDataById.pending, (state) => {
        state.gameDataFetch.loading = true;
        state.gameDataFetch.error = null;
        state.lastApiCall = new Date().toISOString();
      })
      .addCase(fetchGameDataById.fulfilled, (state, action) => {
        state.gameDataFetch.loading = false;
        state.gameDataFetch.success = true;
        state.gameDataFetch.data = action.payload;
        state.retryCount = 0;
      })
      .addCase(fetchGameDataById.rejected, (state, action) => {
        state.gameDataFetch.loading = false;
        state.gameDataFetch.error = action.payload;
        state.apiErrors.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: 'game_data_fetch',
          error: action.payload
        });
      });
  }
});

export const {
  clearStorySubmission,
  clearGameBattleInit,
  clearExperienceData,
  clearWarResults,
  clearGameDataFetch,
  setOnlineStatus,
  addApiError,
  clearApiErrors,
  incrementRetryCount,
  resetRetryCount
} = apiSlice.actions;

export default apiSlice.reducer;