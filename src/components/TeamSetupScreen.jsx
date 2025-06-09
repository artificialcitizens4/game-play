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
        
        {/* Show game mode indicator */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-block',
            background: gameState.gameMode === 'experience' 
              ? 'rgba(255, 107, 53, 0.1)' 
              : 'rgba(46, 213, 115, 0.1)',
            border: `1px solid ${gameState.gameMode === 'experience' ? '#ff6b35' : '#2ed573'}`,
            borderRadius: '8px',
            padding: '0.5rem 1rem'
          }}>
            <Text style={{ 
              color: gameState.gameMode === 'experience' ? '#ff6b35' : '#2ed573',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {gameState.gameMode === 'experience' ? '🎮 EXPERIENCE MODE' : '🛠️ CREATE MODE'}
            </Text>
          </div>
        </div>
        
        <Row gutter={[32, 32]} style={{ marginTop: '2rem' }}>
          <Col xs={24} lg={8}>
            <Card 
              className="story-summary" 
              title={<Text strong style={{ color: '#ff6b35', fontSize: '1.5rem' }}>📜 War Background</Text>}
              bordered={false}
              style={{ height: '100%' }}
            >
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                {getStoryToDisplay()}
              </Paragraph>
              
              {/* Show game ID if available */}
              {gameState.gameId && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem',
                  background: 'rgba(46, 213, 115, 0.1)',
                  border: '1px solid #2ed573',
                  borderRadius: '4px'
                }}>
                  <Text style={{ color: '#2ed573', fontSize: '0.8rem' }}>
                    Game ID: {gameState.gameId}
                  </Text>
                </div>
              )}

              {/* Show experience mode info */}
              {gameState.gameMode === 'experience' && gameState.selectedExperience && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem',
                  background: 'rgba(255, 107, 53, 0.1)',
                  border: '1px solid #ff6b35',
                  borderRadius: '4px'
                }}>
                  <Text style={{ color: '#ff6b35', fontSize: '0.8rem' }}>
                    Experience: {gameState.selectedExperience}
                  </Text>
                </div>
              )}

              {/* Show persona count if available */}
              {gameState.personas && gameState.personas.length > 0 && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem',
                  background: 'rgba(46, 213, 115, 0.1)',
                  border: '1px solid #2ed573',
                  borderRadius: '4px'
                }}>
                  <Text style={{ color: '#2ed573', fontSize: '0.8rem' }}>
                    👥 {gameState.personas.length} warriors loaded from API
                  </Text>
                </div>
              )}

              {/* Show story source indicator */}
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem' }}>
                  {gameState.story.background && gameState.story.background.trim() 
                    ? '📝 User Story' 
                    : gameState.baseStory && gameState.baseStory.trim()
                    ? '🤖 Generated Story'
                    : '⚠️ No Story'
                  }
                </Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={16}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={11}>
                <Card className="team-config-box" bordered={false}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3} style={{ color: '#2ed573', textAlign: 'center', margin: 0 }}>
                      ⚔️ TEAM ONE
                    </Title>
                    
                    <div className="team-info">
                      <Title level={4} style={{ color: '#2ed573', textAlign: 'center', margin: '0 0 1rem 0' }}>
                        {gameState.story.team1Name || 'Team Alpha'}
                      </Title>
                      <Paragraph style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                        Elite warriors ready for battle
                      </Paragraph>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{ color: '#ff6b35', display: 'block', marginBottom: '1rem' }}>
                        Army Size
                      </Text>
                      <div style={{
                        width: '120px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(46, 213, 115, 0.1)',
                        border: '2px solid #2ed573',
                        borderRadius: '12px',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#2ed573',
                        margin: '0 auto',
                        boxShadow: '0 0 20px rgba(46, 213, 115, 0.3)'
                      }}>
                        {gameState.story.teamSizeA || gameState.story.team1Size || 4}
                      </div>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                        Warriors
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col xs={24} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={2} style={{ color: '#ff4757', margin: 0, textAlign: 'center' }}>
                  VS
                </Title>
              </Col>
              
              <Col xs={24} md={11}>
                <Card className="team-config-box" bordered={false} style={{ borderColor: '#ff6b35', backgroundColor: 'rgba(255, 107, 53, 0.05)' }}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3} style={{ color: '#ff6b35', textAlign: 'center', margin: 0 }}>
                      🛡️ TEAM TWO
                    </Title>
                    
                    <div className="team-info">
                      <Title level={4} style={{ color: '#ff6b35', textAlign: 'center', margin: '0 0 1rem 0' }}>
                        {gameState.story.team2Name || 'Team Beta'}
                      </Title>
                      <Paragraph style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                        Fierce fighters prepared for war
                      </Paragraph>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{ color: '#ff6b35', display: 'block', marginBottom: '1rem' }}>
                        Army Size
                      </Text>
                      <div style={{
                        width: '120px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        border: '2px solid #ff6b35',
                        borderRadius: '12px',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#ff6b35',
                        margin: '0 auto',
                        boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
                      }}>
                        {gameState.story.teamSizeB || gameState.story.team2Size || 4}
                      </div>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                        Warriors
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Battle Preview Summary */}
            <Card 
              style={{ 
                marginTop: '2rem',
                backgroundColor: 'rgba(46, 213, 115, 0.05)',
                border: '2px solid #2ed573',
                borderRadius: '15px'
              }}
              bordered={false}
            >
              <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
                <Title level={4} style={{ color: '#2ed573', margin: 0 }}>
                  ⚔️ BATTLE PREVIEW
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
                  {gameState.story.team1Name || 'Team Alpha'} ({gameState.story.teamSizeA || gameState.story.team1Size || 4} warriors) 
                  <span style={{ color: '#ff4757', fontWeight: 'bold', margin: '0 1rem' }}>VS</span>
                  {gameState.story.team2Name || 'Team Beta'} ({gameState.story.teamSizeB || gameState.story.team2Size || 4} warriors)
                </Text>
                
                {/* Show army size difference if any */}
                {(gameState.story.teamSizeA || gameState.story.team1Size || 4) !== (gameState.story.teamSizeB || gameState.story.team2Size || 4) && (
                  <Text style={{ color: '#ffa502', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    ⚖️ Uneven forces detected - strategic advantage to larger army
                  </Text>
                )}
                
                {(gameState.story.teamSizeA || gameState.story.team1Size || 4) === (gameState.story.teamSizeB || gameState.story.team2Size || 4) && (
                  <Text style={{ color: '#2ed573', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    ⚖️ Balanced forces - victory depends on strategy and skill
                  </Text>
                )}

                {/* Show mode-specific info */}
                {gameState.gameMode === 'experience' && (
                  <Text style={{ color: '#ff6b35', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    🎮 Pre-configured experience with unique warriors and backstories
                  </Text>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
        
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Button 
            onClick={proceedToBuildTeams}
            icon={<ArrowRightOutlined />}
            size="large"
          >
            {gameState.gameMode === 'experience' ? 'CUSTOMIZE WARRIORS' : 'BUILD YOUR CHAMPIONS'}
          </Button>
          
          <div style={{ marginTop: '1rem' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
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