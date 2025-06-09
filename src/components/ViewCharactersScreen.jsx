import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Avatar, Progress, Descriptions, message } from 'antd';
import { ArrowLeftOutlined, RocketOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../store/slices/gameSlice';
import { initializeGameBattle } from '../store/slices/apiSlice';
import { useGameState, usePersonas, useBaseStory, usePersonasByFaction, useAppDispatch, useGameBattleInit } from '../hooks/useRedux';
import Button from './Button';

const { Title, Text } = Typography;

const ViewCharactersScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();
  const personas = usePersonas();
  const baseStory = useBaseStory();
  const team1Personas = usePersonasByFaction(gameState.story.team1Name);
  const team2Personas = usePersonasByFaction(gameState.story.team2Name);
  const gameBattleInit = useGameBattleInit();
  
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
      return sum + (persona.morale || 50) + (persona.health || 50) + 
             (persona.strength || 50) + (100 - (persona.fatigue || 20));
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

  const formatPersonasForAPI = (personas) => {
    const formattedPersonas = {};
    
    personas.forEach((persona, index) => {
      // Create a unique key for each persona
      const key = `${persona.faction.toLowerCase().replace(/\s+/g, '_')}_${persona.type.toLowerCase()}_${index + 1}`;
      
      formattedPersonas[key] = {
        agentId: persona.agentId,
        name: persona.name,
        faction: persona.faction,
        type: persona.type,
        age: persona.age,
        background: persona.background,
        motivation: persona.motivation,
        personality: persona.personality,
        skills: persona.skills,
        morale: persona.morale,
        strength: persona.strength,
        fatigue: persona.fatigue,
        health: persona.health,
        affiliation: persona.affiliation,
        terrainStronghold: persona.terrainStronghold
      };
    });
    
    return formattedPersonas;
  };

  const createMinimalBattlemap = (battlefieldMap) => {
    // If no battlefield map is available, create a minimal default
    if (!battlefieldMap) {
      return {
        map_dimensions: {
          width: 10,
          height: 10
        },
        hex_data: [
          {
            coord: "0,0",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "1,0",
            terrain: "Room",
            elevation: 2
          },
          {
            coord: "2,0",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "3,0",
            terrain: "Clear",
            elevation: 2
          },
          {
            coord: "4,0",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "5,0",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "6,0",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "7,0",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "8,0",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "9,0",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "0,1",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "1,1",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "2,1",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "3,1",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "4,1",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "5,1",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "6,1",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "7,1",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "8,1",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "9,1",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "0,2",
            terrain: "Room",
            elevation: 1
          },
          {
            coord: "1,2",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "2,2",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "3,2",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "4,2",
            terrain: "Clear",
            elevation: 2
          },
          {
            coord: "5,2",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "6,2",
            terrain: "Room",
            elevation: 2
          },
          {
            coord: "7,2",
            terrain: "Room",
            elevation: 2
          },
          {
            coord: "8,2",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "9,2",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "0,3",
            terrain: "Clear",
            elevation: 2
          },
          {
            coord: "1,3",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "2,3",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "3,3",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "4,3",
            terrain: "Room",
            elevation: 1
          },
          {
            coord: "5,3",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "6,3",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "7,3",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "8,3",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "9,3",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "0,4",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "1,4",
            terrain: "Clear",
            elevation: 2
          },
          {
            coord: "2,4",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "3,4",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "4,4",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "5,4",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "6,4",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "7,4",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "8,4",
            terrain: "Room",
            elevation: 1
          },
          {
            coord: "9,4",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "0,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "1,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "2,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "3,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "4,5",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "5,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "6,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "7,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "8,5",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "9,5",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "0,6",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "1,6",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "2,6",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "3,6",
            terrain: "Room",
            elevation: 2
          },
          {
            coord: "4,6",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "5,6",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "6,6",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "7,6",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "8,6",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "9,6",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "0,7",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "1,7",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "2,7",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "3,7",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "4,7",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "5,7",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "6,7",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "7,7",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "8,7",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "9,7",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "0,8",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "1,8",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "2,8",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "3,8",
            terrain: "Hill (Steep/Ridge)",
            elevation: 1
          },
          {
            coord: "4,8",
            terrain: "Road",
            elevation: 2
          },
          {
            coord: "5,8",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "6,8",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "7,8",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "8,8",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "9,8",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "0,9",
            terrain: "Forest (Light)",
            elevation: 2
          },
          {
            coord: "1,9",
            terrain: "Street",
            elevation: 1
          },
          {
            coord: "2,9",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "3,9",
            terrain: "Room",
            elevation: 1
          },
          {
            coord: "4,9",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "5,9",
            terrain: "Street",
            elevation: 2
          },
          {
            coord: "6,9",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "7,9",
            terrain: "Clear",
            elevation: 1
          },
          {
            coord: "8,9",
            terrain: "Road",
            elevation: 1
          },
          {
            coord: "9,9",
            terrain: "Street",
            elevation: 1
          }
        ]
      };
    }

    // Extract only hex_data and map_dimensions from the existing battlefield map
    return {
      map_dimensions: battlefieldMap.map_dimensions || {
        width: 10,
        height: 10
      },
      hex_data: battlefieldMap.hex_data || []
    };
  };

  const handleStartWar = async () => {
    try {
      // Get the actual battlefield map from Redux state
      const battlefieldMap = gameState.battlefieldMap;
      
      console.log('Current battlefield map from Redux:', battlefieldMap);
      
      // Create minimal battlemap with only hex_data and map_dimensions
      const minimalBattlemap = createMinimalBattlemap(battlefieldMap);

      console.log('Minimal battlemap being sent to API:', minimalBattlemap);

      // Prepare the game initialization payload
      const gameInitPayload = {
        baseStory: baseStory || gameState.story.background || 'An epic battle between two mighty factions.',
        personas: formatPersonasForAPI(personas),
        battlemap: minimalBattlemap
      };

      console.log('Initializing game with payload:', gameInitPayload);

      // Call the game initialization API
      const result = await dispatch(initializeGameBattle(gameInitPayload));
      
      if (initializeGameBattle.fulfilled.match(result)) {
        const { sessionId, battlemap } = result.payload;
        const mapId = battlemap?.mapId;
        
        if (mapId) {
          // Success! Redirect to the battle viewer with the new Vercel URL
          const battleViewerUrl = `https://grappus-internal-hackathon-2025-art-orcin.vercel.app/?mapId=${mapId}`;
          
          message.success('Battle initialized successfully! Redirecting to battlefield...');
          
          // Small delay to show the success message
          setTimeout(() => {
            window.open(battleViewerUrl, '_blank', 'noopener,noreferrer');
          }, 1500);
        } else {
          message.error('Battle initialized but no map ID received');
        }
      } else {
        // Handle API error
        const errorMessage = result.payload?.message || 'Failed to initialize battle';
        message.error(errorMessage);
      }
    } catch (error) {
      console.error('Error starting war:', error);
      message.error('An unexpected error occurred while starting the battle');
    }
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

  const getPersonaAvatar = (persona) => {
    const typeEmojis = {
      'Commander': '👨‍✈️',
      'Scout': '🏃‍♂️',
      'Medic': '⚕️',
      'Sabotager': '💣',
      'Infantry': '💥',
      'Sniper': '🎯',
      'Engineer': '🔧'
    };
    return typeEmojis[persona.type] || '👤';
  };

  return (
    <div className="screen view-characters-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
        disabled={gameBattleInit.loading}
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
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} md={12}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ margin: '0 0 1rem 0', color: '#ff6b35' }}>
                  🎯 SELECT TEAM
                </Title>
                <Space size="large" wrap>
                  <Button 
                    onClick={() => switchTeam(1)}
                    variant={selectedTeam === 1 ? 'primary' : 'secondary'}
                    size="large"
                    style={{ minWidth: '200px' }}
                    disabled={gameBattleInit.loading}
                  >
                    ⚔️ {gameState.story.team1Name || 'TEAM ALPHA'}
                  </Button>
                  <Button 
                    onClick={() => switchTeam(2)}
                    variant={selectedTeam === 2 ? 'primary' : 'secondary'}
                    size="large"
                    style={{ minWidth: '200px' }}
                    disabled={gameBattleInit.loading}
                  >
                    🛡️ {gameState.story.team2Name || 'TEAM BETA'}
                  </Button>
                </Space>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ margin: '0 0 1rem 0', color: '#ff6b35' }}>
                  ⚖️ BATTLE READINESS
                </Title>
                <Row gutter={16}>
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
          </Row>

          {/* Battlefield Info */}
          {gameState.battlefieldMap && (
            <div style={{ 
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ 
                background: 'rgba(46, 213, 115, 0.1)',
                border: '1px solid #2ed573',
                borderRadius: '8px',
                padding: '1rem',
                display: 'inline-block'
              }}>
                <Text style={{ color: '#2ed573', fontSize: '0.9rem' }}>
                  🗺️ Custom Battlefield Ready
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
                  {gameState.battlefieldMap.battlefield_type} ({gameState.battlefieldMap.map_dimensions?.width}x{gameState.battlefieldMap.map_dimensions?.height})
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem' }}>
                  {gameState.battlefieldMap.hex_data?.length || 0} terrain hexes configured
                </Text>
              </div>
            </div>
          )}
        </Card>

        {/* Current Team Display */}
        <div style={{ 
          transition: 'all 0.3s ease',
          opacity: animationPhase === 'visible' ? 1 : 0,
          transform: animationPhase === 'entering' ? 'translateX(-30px)' : 
                   animationPhase === 'exiting' ? 'translateX(30px)' : 'translateX(0)',
          marginBottom: '3rem'
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
                        <Avatar size={60} style={{ backgroundColor: 'transparent', fontSize: '2rem' }}>
                          {getPersonaAvatar(persona)}
                        </Avatar>
                      </Col>
                      <Col flex={1}>
                        <Title level={4} style={{ margin: 0, color: '#2ed573' }}>
                          {persona.name}
                        </Title>
                        <Text style={{ color: '#ff6b35', fontSize: '1rem' }}>
                          {persona.type}
                        </Text>
                        <br />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                          {persona.npcType} • Age: {persona.age}
                        </Text>
                        {persona.agentId && (
                          <>
                            <br />
                            <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                              ID: {persona.agentId}
                            </Text>
                          </>
                        )}
                      </Col>
                    </Row>
                    
                    {/* Editable Combat Stats */}
                    <div>
                      <Title level={5} style={{ color: '#ff6b35', margin: '0 0 1rem 0', textAlign: 'center' }}>
                        ⚔️ Combat Stats
                      </Title>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Row justify="space-between" align="middle">
                          <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>🧠 Morale</Text></Col>
                          <Col>
                            <Text style={{ color: getStatColor(persona.morale), fontWeight: 'bold' }}>
                              {persona.morale} ({getStatLabel(persona.morale)})
                            </Text>
                          </Col>
                        </Row>
                        <Progress 
                          percent={persona.morale} 
                          strokeColor={getStatColor(persona.morale)}
                          trailColor="rgba(255,255,255,0.1)"
                          showInfo={false}
                          size="small"
                        />
                        
                        <Row justify="space-between" align="middle">
                          <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>💪 Strength</Text></Col>
                          <Col>
                            <Text style={{ color: getStatColor(persona.strength), fontWeight: 'bold' }}>
                              {persona.strength} ({getStatLabel(persona.strength)})
                            </Text>
                          </Col>
                        </Row>
                        <Progress 
                          percent={persona.strength} 
                          strokeColor={getStatColor(persona.strength)}
                          trailColor="rgba(255,255,255,0.1)"
                          showInfo={false}
                          size="small"
                        />
                        
                        <Row justify="space-between" align="middle">
                          <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>😴 Fatigue</Text></Col>
                          <Col>
                            <Text style={{ color: getStatColor(100 - persona.fatigue), fontWeight: 'bold' }}>
                              {persona.fatigue} ({getStatLabel(100 - persona.fatigue)})
                            </Text>
                          </Col>
                        </Row>
                        <Progress 
                          percent={100 - persona.fatigue} 
                          strokeColor={getStatColor(100 - persona.fatigue)}
                          trailColor="rgba(255,255,255,0.1)"
                          showInfo={false}
                          size="small"
                        />
                        
                        <Row justify="space-between" align="middle">
                          <Col><Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>❤️ Health</Text></Col>
                          <Col>
                            <Text style={{ color: getStatColor(persona.health), fontWeight: 'bold' }}>
                              {persona.health} ({getStatLabel(persona.health)})
                            </Text>
                          </Col>
                        </Row>
                        <Progress 
                          percent={persona.health} 
                          strokeColor={getStatColor(persona.health)}
                          trailColor="rgba(255,255,255,0.1)"
                          showInfo={false}
                          size="small"
                        />
                      </Space>
                    </div>

                    {/* Personality Traits (Read-only) */}
                    {persona.personality && (
                      <div style={{ 
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.8rem'
                      }}>
                        <Title level={5} style={{ color: '#2ed573', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                          🧠 Personality
                        </Title>
                        <Row gutter={[8, 4]}>
                          <Col span={12}>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                              Bravery: {persona.personality.bravery}
                            </Text>
                          </Col>
                          <Col span={12}>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                              Loyalty: {persona.personality.loyalty}
                            </Text>
                          </Col>
                          <Col span={12}>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                              Discipline: {persona.personality.discipline}
                            </Text>
                          </Col>
                          <Col span={12}>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                              Tactical: {persona.personality.tactical_thinking}
                            </Text>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Character background */}
                    {persona.background && (
                      <div style={{ 
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.8rem',
                        marginTop: '1rem'
                      }}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                          "{persona.background}"
                        </Text>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Start War Button - Fixed positioning */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '4rem',
          marginBottom: '2rem',
          paddingTop: '2rem',
          borderTop: '2px solid rgba(46, 213, 115, 0.3)'
        }}>
          <Space direction="vertical" size="large">
            <Button 
              onClick={handleStartWar}
              variant="launch"
              icon={gameBattleInit.loading ? <LoadingOutlined spin /> : <RocketOutlined />}
              size="large"
              disabled={gameBattleInit.loading}
              loading={gameBattleInit.loading}
              style={{
                fontSize: '1.5rem',
                padding: '20px 40px',
                height: 'auto',
                minWidth: '300px'
              }}
            >
              {gameBattleInit.loading ? '🔥 INITIALIZING BATTLE... 🔥' : '🔥 START THE WAR! 🔥'}
            </Button>
            
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              {gameBattleInit.loading 
                ? 'Setting up the battlefield and deploying forces...'
                : 'All warriors are assembled and ready for battle'
              }
            </Text>
            
            {gameState.gameId && (
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                Game ID: {gameState.gameId}
              </Text>
            )}

            {/* Show API status */}
            {gameBattleInit.error && (
              <div style={{ 
                background: 'rgba(255, 107, 53, 0.1)',
                border: '1px solid #ff6b35',
                borderRadius: '8px',
                padding: '1rem',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <Text style={{ color: '#ff6b35', fontSize: '0.9rem' }}>
                  ⚠️ {gameBattleInit.error.message}
                </Text>
              </div>
            )}

            {/* Debug info for map data */}
            {gameState.battlefieldMap && (
              <div style={{ 
                background: 'rgba(46, 213, 115, 0.05)',
                border: '1px solid rgba(46, 213, 115, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                maxWidth: '600px',
                margin: '0 auto',
                fontSize: '0.8rem'
              }}>
                <Text style={{ color: '#2ed573', fontWeight: 'bold' }}>
                  🗺️ Map Data Ready:
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Type: {gameState.battlefieldMap.battlefield_type} | 
                  Size: {gameState.battlefieldMap.map_dimensions?.width}x{gameState.battlefieldMap.map_dimensions?.height} | 
                  Hexes: {gameState.battlefieldMap.hex_data?.length || 0}
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Sending only hex_data and map_dimensions to API
                </Text>
              </div>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ViewCharactersScreen;