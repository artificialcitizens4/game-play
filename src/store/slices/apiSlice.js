import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

      const response = await axios.post('http://13.204.53.42:4000/gamestory', payload, {
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

// Async thunk for fetching game experiences
export const fetchGameExperiences = createAsyncThunk(
  'api/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://13.204.53.42:4000/gamestory', {
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
      const response = await axios.post('http://13.204.53.42:4000/gamestory', warData, {
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
      const response = await axios.get(`http://13.204.53.42:4000/gamestory`, {
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
  
  // Experiences API state
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
    
    // Experiences fetching
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
  clearWarResults,
  clearGameDataFetch,
  setOnlineStatus,
  addApiError,
  clearApiErrors,
  incrementRetryCount,
  resetRetryCount
} = apiSlice.actions;

export default apiSlice.reducer;