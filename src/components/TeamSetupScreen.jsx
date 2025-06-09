import { Typography, Card, Row, Col, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { setCurrentScreen, updateStory } from '../store/slices/gameSlice';
import { useGameState, useAppDispatch } from '../hooks/useRedux';
import Button from './Button';

const { Title, Paragraph, Text } = Typography;

const TeamSetupScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();


  const updateTeamData = (field, value) => {
    dispatch(updateStory({ [field]: value }));
  };

  const updateTeamSize = (team, change) => {
    const field = team === 1 ? 'team1Size' : 'team2Size';
    const currentSize = gameState.story[field] || 4;
    const newSize = Math.max(1, Math.min(8, currentSize + change));
    updateTeamData(field, newSize);
  };

  const proceedToBuildTeams = () => {
    dispatch(setCurrentScreen('build-teams'));
  };

  const goBack = () => {
    dispatch(setCurrentScreen('story'));
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
        <Paragraph className="subtitle">Configure your opposing forces</Paragraph>
        
        <Row gutter={[32, 32]} style={{ marginTop: '2rem' }}>
          <Col xs={24} lg={8}>
            <Card 
              className="story-summary" 
              title={<Text strong style={{ color: '#ff6b35', fontSize: '1.5rem' }}>📜 War Background</Text>}
              bordered={false}
              style={{ height: '100%' }}
            >
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                {gameState.story.background || gameState.baseStory || 'No background story provided yet...'}
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
                      <Title level={4} style={{ color: '#ff6b35', textAlign: 'center', margin: '0 0 1rem 0' }}>
                        {gameState.story.team1Name || 'Team Alpha'}
                      </Title>
                      <Paragraph style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>

                      </Paragraph>
                      
                    
                    </div>
                    
                    <div>
                      <Text strong style={{ color: '#ff6b35', display: 'block', marginBottom: '1rem', textAlign: 'center' }}>
                        Army Size
                      </Text>
                      <Row gutter={16} justify="center" align="middle">
                        <Col>
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() => updateTeamSize(1, -1)}
                            disabled={gameState.story.team1Size <= 1}
                            style={{ 
                              borderColor: '#ff4757', 
                              color: '#ff4757',
                              backgroundColor: 'rgba(255, 71, 87, 0.1)',
                              width: '50px',
                              height: '50px'
                            }}
                          />
                        </Col>
                        <Col>
                          <div style={{
                            width: '80px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(46, 213, 115, 0.1)',
                            border: '2px solid #2ed573',
                            borderRadius: '8px',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#2ed573'
                          }}>
                            {gameState.story.team1Size || 4}
                          </div>
                        </Col>
                        <Col>
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() => updateTeamSize(1, 1)}
                            disabled={gameState.story.team1Size >= 8}
                            style={{ 
                              borderColor: '#2ed573', 
                              color: '#2ed573',
                              backgroundColor: 'rgba(46, 213, 115, 0.1)',
                              width: '50px',
                              height: '50px'
                            }}
                          />
                        </Col>
                      </Row>
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
                            team 2
                      </Paragraph>
                    </div>
                    
                    <div>
                      <Text strong style={{ color: '#ff6b35', display: 'block', marginBottom: '1rem', textAlign: 'center' }}>
                        Army Size
                      </Text>
                      <Row gutter={16} justify="center" align="middle">
                        <Col>
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() => updateTeamSize(2, -1)}
                            disabled={gameState.story.team2Size <= 1}
                            style={{ 
                              borderColor: '#ff4757', 
                              color: '#ff4757',
                              backgroundColor: 'rgba(255, 71, 87, 0.1)',
                              width: '50px',
                              height: '50px'
                            }}
                          />
                        </Col>
                        <Col>
                          <div style={{
                            width: '80px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 107, 53, 0.1)',
                            border: '2px solid #ff6b35',
                            borderRadius: '8px',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#ff6b35'
                          }}>
                            {gameState.story.team2Size || 4}
                          </div>
                        </Col>
                        <Col>
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() => updateTeamSize(2, 1)}
                            disabled={gameState.story.team2Size >= 8}
                            style={{ 
                              borderColor: '#2ed573', 
                              color: '#2ed573',
                              backgroundColor: 'rgba(46, 213, 115, 0.1)',
                              width: '50px',
                              height: '50px'
                            }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Button 
            onClick={proceedToBuildTeams}
            icon={<ArrowRightOutlined />}
            size="large"
          >
            CONFIRM TEAMS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetupScreen;