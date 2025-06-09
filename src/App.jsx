import { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setScreenSize } from './store/slices/uiSlice';
import { useGameState, useUIState } from './hooks/useRedux';
import MainScreen from './components/MainScreen';
import SelectExperienceScreen from './components/SelectExperienceScreen';
import StoryScreen from './components/StoryScreen';
import TeamSetupScreen from './components/TeamSetupScreen';
import BuildTeamsScreen from './components/BuildTeamsScreen';
import CharacterDetails from './components/CharacterDetails';
import MapEditorScreen from './components/MapEditorScreen';
import StartGameScreen from './components/StartGameScreen';
import WarSummaryScreen from './components/WarSummaryScreen';
import ViewCharactersScreen from './components/ViewCharactersScreen';
import ParticleBackground from './components/ParticleBackground';
import NotificationContainer from './components/NotificationContainer';
import AudioManager from './components/AudioManager';
import './styles/App.scss';

function App() {
  const dispatch = useDispatch();
  const gameState = useGameState();
  const uiState = useUIState();
  const gameData = useSelector(state => state.game?.apiGameData);

  console.log(gameData)

  

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let screenSize = 'desktop';
      
      if (width < 768) {
        screenSize = 'mobile';
      } else if (width < 1024) {
        screenSize = 'tablet';
      }
      
      dispatch(setScreenSize(screenSize));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'api/setOnlineStatus', payload: true });
    const handleOffline = () => dispatch({ type: 'api/setOnlineStatus', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  // Play screen transition sound
  useEffect(() => {
    if (window.playWarSound) {
      window.playWarSound('screenTransition');
    }
  }, [gameState.currentScreen]);

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'main':
        return <MainScreen />;
      case 'select-experience':
        return <SelectExperienceScreen />;
      case 'story':
        return <StoryScreen />;
      case 'team-setup':
        return <TeamSetupScreen />;
      case 'build-teams':
        return <BuildTeamsScreen />;
      case 'character-details':
        return <CharacterDetails />;
      case 'map-editor':
        return <MapEditorScreen />;
      case 'start-game':
        return <StartGameScreen />;
      case 'war-summary':
        return <WarSummaryScreen />;
      case 'view-characters':
        return <ViewCharactersScreen />;
      default:
        return <MainScreen />;
    }
  };

  // Ant Design dark theme configuration
  const antdTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#2ed573',
      colorBgBase: '#0a0a0a',
      colorBgContainer: 'rgba(46, 213, 115, 0.05)',
      colorBorder: '#2ed573',
      colorText: '#ffffff',
      colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 12,
      fontFamily: "'Courier New', monospace",
    },
    components: {
      Button: {
        colorPrimary: '#2ed573',
        colorPrimaryHover: '#ff6b35',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      },
      Input: {
        colorBgContainer: 'rgba(0, 0, 0, 0.7)',
        colorBorder: '#2ed573',
        colorText: '#2ed573',
      },
      Slider: {
        colorPrimary: '#2ed573',
        colorPrimaryBorder: '#2ed573',
        colorPrimaryBorderHover: '#ff6b35',
      },
      Card: {
        colorBgContainer: 'rgba(46, 213, 115, 0.05)',
        colorBorderSecondary: '#2ed573',
      },
      Typography: {
        colorText: '#ffffff',
        colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
      }
    }
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div className={`app ${uiState.theme} ${uiState.animations ? 'animations-enabled' : 'animations-disabled'}`}>
        <AudioManager />
        <ParticleBackground />
        <div className={`screen-container ${uiState.isTransitioning ? 'transitioning' : ''}`}>
          {renderCurrentScreen()}
        </div>
        <NotificationContainer />
      </div>
    </ConfigProvider>
  );
}

export default App;