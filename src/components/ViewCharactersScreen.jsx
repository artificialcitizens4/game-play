import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Avatar, Progress } from 'antd';
import { ArrowLeftOutlined, RocketOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../store/slices/gameSlice';
import { useGameState, usePersonas, usePersonasByFaction, useAppDispatch } from '../hooks/useRedux';
import Button from './Button';

const { Title, Text } = Typography;

const ViewCharactersScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();
  const personas = usePersonas();
  const team1Personas = usePersonasByFaction(gameState.story.team1Name);
  const team2Personas = usePersonasByFaction(gameState.story.team2Name);
  
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [animationPhase, setAnimationPhase] = useState('entering');

  const getStatColor = (value) => {
    if (value <= 33) return '#ff4757';
    if (value <= 66) return '#ffa502';
    return '#2ed573';
  };

  const getStatLabel = (value) => {
    if (value <= 33) return 'LOW';
    if (value <= 66) return 'MEDIUM';
    return 'HIGH';
  };

  const calculateTeamStrength = (teamPersonas) => {
    if (!teamPersonas.length) return 50;
    
    const totalStats = teamPersonas.reduce((sum, persona) => {
      const traits = persona.traits;
      return sum + (traits.morale || 50) + (traits.health || 50) + 
             (traits.bravery || 50) + (traits.discipline || 50);
    }, 0);
    
    return Math.round(totalStats / (teamPersonas.length * 4));
  };

  useEffect(() => {
    setAnimationPhase('entering');
    const timer = setTimeout(() => {
      setAnimationPhase('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedTeam]);

  const switchTeam = (teamNumber) => {
    if (teamNumber !== selectedTeam) {
      setAnimationPhase('exiting');
      setTimeout(() => {
        setSelectedTeam(teamNumber);
      }, 300);
    }
  };

  const handleStartWar = () => {
    const warData = {
      teams: {
        team1: {
          name: gameState.story.team1Name || 'Team Alpha',
          size: gameState.story.team1Size || 4,
          personas: team1Personas,
          strength: calculateTeamStrength(team1Personas)
        },
        team2: {
          name: gameState.story.team2Name || 'Team Beta',
          size: gameState.story.team2Size || 4,
          personas: team2Personas,
          strength: calculateTeamStrength(team2Personas)
        }
      },
      battlefield: gameState.battlefieldMap,
      story: gameState.story,
      gameId: gameState.gameId,
      apiGameData: gameState.apiGameData
    };

    // For now, go to start game screen
    dispatch(setCurrentScreen('start-game'));
  };

  const goBack = () => {
    dispatch(setCurrentScreen('war-summary'));
  };

  const currentTeamPersonas = selectedTeam === 1 ? team1Personas : team2Personas;
  const teamName = selectedTeam === 1 
    ? (gameState.story.team1Name || 'Team Alpha')
    : (gameState.story.team2Name || 'Team Beta');
  
  const team1Strength = calculateTeamStrength(team1Personas);
  const team2Strength = calculateTeamStrength(team2Personas);

  return (
    <div className="screen view-characters-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">👥 WARRIORS ASSEMBLY</Title>
        <Text className="subtitle">Meet your champions and prepare for battle</Text>
        
        {/* Team Selection and Strength Overview */}
        <Card 
          style={{ 
            backgroundColor: 'rgba(46, 213, 115, 0.05)',
            border: '2px solid #2ed573',
            borderRadius: '15px',
            marginBottom: '2rem'
          }}
          bordered={false}
        >
          <Row gutter={[32, 16]} align="middle">
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Space size="large">
                  <Button 
                    onClick={() => switchTeam(1)}
                    variant={selectedTeam === 1 ? 'primary' : 'secondary'}
                    size="large"
                  >
                    ⚔️ {gameState.story.team1Name || 'TEAM ALPHA'}
                  </Button>
                  <Button 
                    onClick={() => switchTeam(2)}
                    variant={selectedTeam === 2 ? 'primary' : 'secondary'}
                    size="large"
                  >
                    🛡️ {gameState.story.team2Name || 'TEAM BETA'}
                  </Button>
                </Space>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ margin: 0, color: '#ff6b35' }}>
                  ⚖️ BATTLE READINESS
                </Title>
                <Row gutter={16} style={{ marginTop: '1rem' }}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <Text style={{ color: '#2ed573', fontSize: '2rem', fontWeight: 'bold' }}>
                        {team1Strength}%
                      </Text>
                      <br />
                      <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                        {gameState.story.team1Name || 'Team Alpha'}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <Text style={{ color: '#ff6b35', fontSize: '2rem', fontWeight: 'bold' }}>
                        {team2Strength}%
                      </Text>
                      <br />
                      <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                        {gameState.story.team2Name || 'Team Beta'}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                {gameState.battlefieldMap && (
                  <div style={{ 
                    background: 'rgba(46, 213, 115, 0.1)',
                    border: '1px solid #2ed573',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <Text style={{ color: '#2ed573', fontSize: '0.9rem' }}>
                      🗺️ Custom Battlefield Ready
                    </Text>
                    <br />
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
                      {gameState.battlefieldMap.battlefield_type} ({gameState.battlefieldMap.map_dimensions?.width}x{gameState.battlefieldMap.map_dimensions?.height})
                    </Text>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Current Team Display */}
        <div style={{ 
          transition: 'all 0.3s ease',
          opacity: animationPhase === 'visible' ? 1 : 0,
          transform: animationPhase === 'entering' ? 'translateX(-30px)' : 
                   animationPhase === 'exiting' ? 'translateX(30px)' : 'translateX(0)'
        }}>
          <Card 
            style={{ 
              backgroundColor: 'rgba(46, 213, 115, 0.05)',
              border: '2px solid #2ed573',
              borderRadius: '15px',
              marginBottom: '2rem'
            }}
            bordered={false}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0, background: 'linear-gradient(45deg, #2ed573, #ff6b35)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {teamName}
                </Title>
              </Col>
              <Col>
                <Space>
                  <Text style={{ color: '#ff6b35', fontSize: '1.2rem' }}>
                    👥 {currentTeamPersonas.length} Warriors
                  </Text>
                  <Text style={{ color: '#2ed573', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    💪 {selectedTeam === 1 ? team1Strength : team2Strength}% Ready
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>

          <Row gutter={[24, 24]}>
            {currentTeamPersonas.map((persona, index) => (
              <Col xs={24} md={12} lg={12} xl={6} key={persona.name}>
                <Card 
                  className="character-profile"
                  style={{
                    background: 'linear-gradient(135deg, rgba(46, 213, 115, 0.1) 0%, rgba(22, 33, 62, 0.8) 100%)',
                    border: '2px solid #2ed573',
                    borderRadius: '15px',
                    height: '100%'
                  }}
                  bordered={false}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row align="middle" gutter={[12, 0]}>
                      <Col>
                        <Avatar size={60} style={{ backgroundColor: selectedTeam === 1 ? '#2ed573' : '#ff6b35', color: selectedTeam === 1 ? '#000' : '#fff', fontSize: '1.5rem' }}>
                          {persona.name.charAt(0)}
                        </Avatar>
                      </Col>
                      <Col flex={1}>
                        <Title level={4} style={{ margin: 0, color: '#2ed573' }}>
                          {persona.name}
                        </Title>
                        <Text style={{ color: '#ff6b35', fontSize: '1rem' }}>
                          {persona.role}
                        </Text>
                        <br />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                          {persona.npcType}
                        </Text>
                      </Col>
                    </Row>
                    
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Row justify="space-between" align="middle">
                        <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>🧠 Morale</Text></Col>
                        <Col>
                          <Text style={{ color: getStatColor(persona.traits.morale), fontWeight: 'bold' }}>
                            {persona.traits.morale} ({getStatLabel(persona.traits.morale)})
                          </Text>
                        </Col>
                      </Row>
                      <Progress 
                        percent={persona.traits.morale} 
                        strokeColor={getStatColor(persona.traits.morale)}
                        trailColor="rgba(255,255,255,0.1)"
                        showInfo={false}
                        size="small"
                      />
                      
                      <Row justify="space-between" align="middle">
                        <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>❤️ Health</Text></Col>
                        <Col>
                          <Text style={{ color: getStatColor(persona.traits.health), fontWeight: 'bold' }}>
                            {persona.traits.health} ({getStatLabel(persona.traits.health)})
                          </Text>
                        </Col>
                      </Row>
                      <Progress 
                        percent={persona.traits.health} 
                        strokeColor={getStatColor(persona.traits.health)}
                        trailColor="rgba(255,255,255,0.1)"
                        showInfo={false}
                        size="small"
                      />
                      
                      <Row justify="space-between" align="middle">
                        <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>⚔️ Bravery</Text></Col>
                        <Col>
                          <Text style={{ color: getStatColor(persona.traits.bravery), fontWeight: 'bold' }}>
                            {persona.traits.bravery} ({getStatLabel(persona.traits.bravery)})
                          </Text>
                        </Col>
                      </Row>
                      <Progress 
                        percent={persona.traits.bravery} 
                        strokeColor={getStatColor(persona.traits.bravery)}
                        trailColor="rgba(255,255,255,0.1)"
                        showInfo={false}
                        size="small"
                      />
                      
                      <Row justify="space-between" align="middle">
                        <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>🎯 Discipline</Text></Col>
                        <Col>
                          <Text style={{ color: getStatColor(persona.traits.discipline), fontWeight: 'bold' }}>
                            {persona.traits.discipline} ({getStatLabel(persona.traits.discipline)})
                          </Text>
                        </Col>
                      </Row>
                      <Progress 
                        percent={persona.traits.discipline} 
                        strokeColor={getStatColor(persona.traits.discipline)}
                        trailColor="rgba(255,255,255,0.1)"
                        showInfo={false}
                        size="small"
                      />
                    </Space>

                    {/* Character backstory */}
                    {persona.backstory && (
                      <div style={{ 
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.8rem',
                        marginTop: '1rem'
                      }}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                          "{persona.backstory}"
                        </Text>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Start War Button */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Space direction="vertical" size="large">
            <Button 
              onClick={handleStartWar}
              variant="launch"
              icon={<RocketOutlined />}
              size="large"
              style={{
                fontSize: '1.5rem',
                padding: '20px 40px',
                height: 'auto'
              }}
            >
              🔥 START THE WAR! 🔥
            </Button>
            
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              All warriors are assembled and ready for battle
            </Text>
            
            {gameState.gameId && (
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                Game ID: {gameState.gameId}
              </Text>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ViewCharactersScreen;