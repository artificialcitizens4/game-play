import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Avatar } from 'antd';
import { ArrowLeftOutlined, RocketOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../store/slices/gameSlice';
import { initializeGameBattle } from '../store/slices/apiSlice';
import { useGameState, usePersonas, useStorySummary, usePersonasByFaction, useAppDispatch, useGameBattleInit } from '../hooks/useRedux';
import Button from './Button';

const { Title, Text } = Typography;

const ViewCharactersScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();
  const personas = usePersonas();
  const storySummary = useStorySummary();
  const team1Personas = usePersonasByFaction(gameState.story.team1Name);
  const team2Personas = usePersonasByFaction(gameState.story.team2Name);
  const gameBattleInit = useGameBattleInit();
  
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [animationPhase, setAnimationPhase] = useState('entering');

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
        baseStory: storySummary || gameState.story.background || 'An epic battle between two mighty factions.',
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
          
          // Small delay to show the success message
          setTimeout(() => {
            window.open(battleViewerUrl, '_blank', 'noopener,noreferrer');
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error starting war:', error);
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
        
        {/* Command Dashboard */}
        <div className="command-dashboard">
          <div className="command-dashboard-content">
            {/* Team Selection and Battle Readiness */}
            <div className="dashboard-controls">
              <div className="team-selection-section">
                <Text className="dashboard-section-title">🎯 Select Team</Text>
                <div className="team-selection-buttons">
                  <Button 
                    onClick={() => switchTeam(1)}
                    variant={selectedTeam === 1 ? 'primary' : 'secondary'}
                    size="large"
                    disabled={gameBattleInit.loading}
                    className="team-selection-button"
                  >
                    ⚔️ {gameState.story.team1Name || 'TEAM ALPHA'}
                  </Button>
                  <Button 
                    onClick={() => switchTeam(2)}
                    variant={selectedTeam === 2 ? 'primary' : 'secondary'}
                    size="large"
                    disabled={gameBattleInit.loading}
                    className="team-selection-button"
                  >
                    🛡️ {gameState.story.team2Name || 'TEAM BETA'}
                  </Button>
                </div>
              </div>
              
              <div className="battle-readiness-section">
                <Text className="dashboard-section-title">⚖️ Battle Readiness</Text>
                <div className="readiness-stats">
                  <div className="readiness-stat">
                    <Text className="readiness-value readiness-value--team1">
                      {team1Strength}%
                    </Text>
                    <Text className="readiness-label">
                      {gameState.story.team1Name || 'Team Alpha'}
                    </Text>
                  </div>
                  <div className="readiness-stat">
                    <Text className="readiness-value readiness-value--team2">
                      {team2Strength}%
                    </Text>
                    <Text className="readiness-label">
                      {gameState.story.team2Name || 'Team Beta'}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* War Launch Section */}
            <div className="war-launch-section">
              <Button 
                onClick={handleStartWar}
                variant="launch"
                icon={gameBattleInit.loading ? <LoadingOutlined spin /> : <RocketOutlined />}
                size="large"
                disabled={gameBattleInit.loading}
                loading={gameBattleInit.loading}
                className="war-launch-button"
              >
                {gameBattleInit.loading ? '🔥 INITIALIZING BATTLE... 🔥' : '🔥 START THE WAR! 🔥'}
              </Button>
              
              <Text className="war-launch-status">
                {gameBattleInit.loading 
                  ? 'Setting up the battlefield and deploying forces...'
                  : 'All warriors are assembled and ready for battle'
                }
              </Text>

              {/* API Status Messages */}
              {gameBattleInit.error && (
                <div className="api-status-message api-status-message--error">
                  <Text className="api-status-text">
                    ⚠️ {gameBattleInit.error.message}
                  </Text>
                </div>
              )}

              {/* Battlefield Info */}
              {gameState.battlefieldMap && (
                <div className="battlefield-info">
                  <Text className="battlefield-info-text">
                    🗺️ Map Ready: {gameState.battlefieldMap.battlefield_type} ({gameState.battlefieldMap.map_dimensions?.width}x{gameState.battlefieldMap.map_dimensions?.height})
                  </Text>
                </div>
              )}

              {/* Game ID */}
              {gameState.gameId && (
                <Text className="game-id-display">
                  Game ID: {gameState.gameId}
                </Text>
              )}
            </div>
          </div>
        </div>

        {/* Roster Grid */}
        <div className="roster-grid">
          <div className="roster-grid-header">
            <Title level={2} className="roster-grid-title">
              {teamName}
            </Title>
            <div className="roster-grid-meta">
              <Text className="roster-grid-count">
                👥 {currentTeamPersonas.length} Warriors
              </Text>
              <Text className="roster-grid-strength">
                💪 {selectedTeam === 1 ? team1Strength : team2Strength}% Ready
              </Text>
            </div>
          </div>

          <div className={`roster-grid-content ${animationPhase}`}>
            <Row gutter={[24, 24]}>
              {currentTeamPersonas.map((persona, index) => (
                <Col xs={24} md={12} lg={8} xl={6} key={persona.name}>
                  <Card className="character-profile-simple" bordered={false}>
                    <div className="character-profile-content">
                      <div className="character-profile-header">
                        <Avatar size={60} className="character-profile-avatar">
                          {getPersonaAvatar(persona)}
                        </Avatar>
                        <div className="character-profile-info">
                          <Text strong className="character-profile-name">
                            {persona.name}
                          </Text>
                          <Text className="character-profile-type">
                            {persona.type}
                          </Text>
                          <Text className="character-profile-meta">
                            {persona.npcType} • Age: {persona.age}
                          </Text>
                          {persona.agentId && (
                            <Text className="character-profile-id">
                              ID: {persona.agentId}
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCharactersScreen;