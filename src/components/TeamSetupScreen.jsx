import { Typography, Card, Row, Col, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { setCurrentScreen, updateStory } from '../store/slices/gameSlice';
import { useGameState, useAppDispatch } from '../hooks/useRedux';
import Button from './Button';

const { Title, Paragraph, Text } = Typography;

const TeamSetupScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();

  const proceedToBuildTeams = () => {
    dispatch(setCurrentScreen('build-teams'));
  };

  const goBack = () => {
    // In experience mode, go back to experience selection
    // In create mode, go back to story screen
    if (gameState.gameMode === 'experience') {
      dispatch(setCurrentScreen('select-experience'));
    } else {
      dispatch(setCurrentScreen('story'));
    }
  };

  // Get the story to display - prioritize user's story over baseStory
  const getStoryToDisplay = () => {
    // If user has entered their own story, use that
    if (gameState.story.background && gameState.story.background.trim()) {
      return gameState.story.background;
    }
    
    // Otherwise, fall back to baseStory from API
    if (gameState.baseStory && gameState.baseStory.trim()) {
      return gameState.baseStory;
    }
    
    // Final fallback
    return 'No background story provided yet...';
  };

  return (
    <div className="screen team-setup-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">⚔️ SETUP YOUR ARMIES</Title>
        <Paragraph className="subtitle">Review your opposing forces</Paragraph>
        
        {/* Briefing Panel */}
        <div className="briefing-panel">
          <Card className="briefing-card" bordered={false}>
            <div className="briefing-content">
              <div className="briefing-story">
                <Text strong className="briefing-story-title">📜 War Background</Text>
                <Paragraph className="briefing-story-text">
                  {getStoryToDisplay()}
                </Paragraph>
              </div>
              
              <div className="briefing-panel__tags">
                {/* Game Mode Tag */}
                <div className={`briefing-tag briefing-tag--${gameState.gameMode === 'experience' ? 'experience' : 'create'}`}>
                  <Text className="briefing-tag-text">
                    {gameState.gameMode === 'experience' ? '🎮 Experience Mode' : '🛠️ Create Mode'}
                  </Text>
                </div>

                {/* Game ID Tag */}
                {gameState.gameId && (
                  <div className="briefing-tag briefing-tag--info">
                    <Text className="briefing-tag-text">
                      Game ID: {gameState.gameId}
                    </Text>
                  </div>
                )}

                {/* Experience Tag */}
                {gameState.gameMode === 'experience' && gameState.selectedExperience && (
                  <div className="briefing-tag briefing-tag--experience">
                    <Text className="briefing-tag-text">
                      Experience: {gameState.selectedExperience}
                    </Text>
                  </div>
                )}

                {/* Persona Count Tag */}
                {gameState.personas && gameState.personas.length > 0 && (
                  <div className="briefing-tag briefing-tag--success">
                    <Text className="briefing-tag-text">
                      👥 {gameState.personas.length} warriors loaded
                    </Text>
                  </div>
                )}

                {/* Story Source Tag */}
                <div className="briefing-tag briefing-tag--neutral">
                  <Text className="briefing-tag-text">
                    {gameState.story.background && gameState.story.background.trim() 
                      ? '📝 User Story' 
                      : gameState.baseStory && gameState.baseStory.trim()
                      ? '🤖 Generated Story'
                      : '⚠️ No Story'
                    }
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Teams Display Grid */}
        <div className="teams-display-grid">
          {/* Team One Card */}
          <Card className="team-card team-card--team1" bordered={false}>
            <div className="team-card-content">
              <div className="team-card-header">
                <Text className="team-card-icon">⚔️</Text>
                <Text className="team-card-title">TEAM ONE</Text>
              </div>
              
              <div className="team-card-body">
                <Text className="team-card-name">
                  {gameState.story.team1Name || 'Team Alpha'}
                </Text>
                <Text className="team-card-description">
                  Elite warriors ready for battle
                </Text>
              </div>
              
              <div className="team-card-stats">
                <div className="team-size-display">
                  <Text className="team-size-number">
                    {gameState.story.teamSizeA || gameState.story.team1Size || 4}
                  </Text>
                  <Text className="team-size-label">Warriors</Text>
                </div>
              </div>
            </div>
          </Card>

          {/* VS Divider */}
          <div className="teams-display__vs">
            <Text className="vs-text">VS</Text>
          </div>

          {/* Team Two Card */}
          <Card className="team-card team-card--team2" bordered={false}>
            <div className="team-card-content">
              <div className="team-card-header">
                <Text className="team-card-icon">🛡️</Text>
                <Text className="team-card-title">TEAM TWO</Text>
              </div>
              
              <div className="team-card-body">
                <Text className="team-card-name">
                  {gameState.story.team2Name || 'Team Beta'}
                </Text>
                <Text className="team-card-description">
                  Fierce fighters prepared for war
                </Text>
              </div>
              
              <div className="team-card-stats">
                <div className="team-size-display">
                  <Text className="team-size-number">
                    {gameState.story.teamSizeB || gameState.story.team2Size || 4}
                  </Text>
                  <Text className="team-size-label">Warriors</Text>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Battle Analysis */}
        <div className="battle-analysis">
          <Card className="battle-analysis-card" size="small" bordered={false}>
            <div className="battle-analysis-content">
              <Text className="battle-analysis-title">⚖️ BATTLE ANALYSIS</Text>
              
              <div className="battle-analysis-stats">
                <Text className="battle-analysis-matchup">
                  {gameState.story.team1Name || 'Team Alpha'} ({gameState.story.teamSizeA || gameState.story.team1Size || 4}) 
                  <span className="vs-small">VS</span>
                  {gameState.story.team2Name || 'Team Beta'} ({gameState.story.teamSizeB || gameState.story.team2Size || 4})
                </Text>
                
                {/* Balance Assessment */}
                {(gameState.story.teamSizeA || gameState.story.team1Size || 4) !== (gameState.story.teamSizeB || gameState.story.team2Size || 4) ? (
                  <Text className="balance-assessment balance-assessment--uneven">
                    ⚖️ Uneven forces - strategic advantage to larger army
                  </Text>
                ) : (
                  <Text className="balance-assessment balance-assessment--balanced">
                    ⚖️ Balanced forces - victory depends on strategy and skill
                  </Text>
                )}

                {/* Mode-specific info */}
                {gameState.gameMode === 'experience' && (
                  <Text className="mode-info">
                    🎮 Pre-configured experience with unique warriors and backstories
                  </Text>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Next Button Block */}
        <div className="next-button-block">
          <Button 
            onClick={proceedToBuildTeams}
            icon={<ArrowRightOutlined />}
            size="large"
            className="proceed-button"
          >
            {gameState.gameMode === 'experience' ? 'CUSTOMIZE WARRIORS' : 'BUILD YOUR CHAMPIONS'}
          </Button>
          
          <div className="next-button-help">
            <Text className="next-button-help-text">
              {gameState.gameMode === 'experience' 
                ? '💡 Experience mode: Warriors are pre-loaded, you can customize their combat stats'
                : '💡 Team sizes are locked from your story configuration'
              }
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSetupScreen;