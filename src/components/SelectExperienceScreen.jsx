import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Row, Col, Typography, Space, Spin, Alert, Empty } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentScreen, setGameMode, loadExperienceData } from '../store/slices/gameSlice';
import { fetchExperienceData, clearExperienceData } from '../store/slices/apiSlice';
import { useExperienceData, useAppDispatch } from '../hooks/useRedux';
import Button from './Button';

const { Title, Text, Paragraph } = Typography;

const SelectExperienceScreen = () => {
  const dispatch = useAppDispatch();
  const experienceData = useExperienceData();
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef();
  const lastExperienceElementRef = useRef();

  // Clear experience data when component mounts
  useEffect(() => {
    dispatch(clearExperienceData());
    // Fetch first page
    dispatch(fetchExperienceData({ page: 1, limit: 20, reset: true }));
  }, [dispatch]);

  // Infinite scroll implementation
  const lastExperienceElementRefCallback = useCallback(node => {
    if (experienceData.loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && experienceData.hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        dispatch(fetchExperienceData({ 
          page: experienceData.currentPage + 1, 
          limit: 20 
        })).finally(() => {
          setIsLoadingMore(false);
        });
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [experienceData.loading, experienceData.hasMore, experienceData.currentPage, dispatch, isLoadingMore]);

  const goBack = () => {
    dispatch(setCurrentScreen('main'));
  };

  const handleSelectExperience = (experience) => {
    setSelectedExperience(experience.id);
    
    // Create game data for the selected experience
    const gameData = {
      story: {
        background: experience.baseStory || experience.story,
        team1Name: getTeamName(experience, 0),
        team1Size: getTeamSize(experience, 0),
        team2Name: getTeamName(experience, 1),
        team2Size: getTeamSize(experience, 1),
        characters: getCharactersDescription(experience)
      },
      characters: generateCharactersFromExperience(experience),
      currentCharacter: null,
      currentTeam: null
    };

    dispatch(setGameMode('experience'));
    dispatch(loadExperienceData(gameData));
    
    // Set API game data if available
    if (experience.personas) {
      dispatch({ type: 'game/setApiGameData', payload: experience });
      dispatch({ type: 'game/convertPersonasToCharacters' });
    }
    
    // Navigate to team setup
    dispatch(setCurrentScreen('team-setup'));
  };

  const getTeamName = (experience, index) => {
    if (experience.personas && experience.personas.length > 0) {
      const factions = [...new Set(experience.personas.map(p => p.faction))];
      return factions[index] || `Team ${index + 1}`;
    }
    return `Team ${index + 1}`;
  };

  const getTeamSize = (experience, index) => {
    if (experience.personas && experience.personas.length > 0) {
      const factions = [...new Set(experience.personas.map(p => p.faction))];
      const teamPersonas = experience.personas.filter(p => p.faction === factions[index]);
      return teamPersonas.length || 4;
    }
    return 4;
  };

  const getCharactersDescription = (experience) => {
    if (experience.personas && experience.personas.length > 0) {
      const commanders = experience.personas.filter(p => p.role === 'Commander');
      if (commanders.length >= 2) {
        return `${commanders[0].name} leads ${commanders[0].faction} with ${commanders[0].npcType.toLowerCase()} expertise, while ${commanders[1].name} commands ${commanders[1].faction} with ${commanders[1].npcType.toLowerCase()} tactics.`;
      }
    }
    return 'Elite warriors from both sides step forward as champions, each bringing unique skills and unwavering determination to the battlefield.';
  };

  const generateCharactersFromExperience = (experience) => {
    const characters = {};
    
    if (experience.personas && experience.personas.length > 0) {
      const factions = [...new Set(experience.personas.map(p => p.faction))];
      
      experience.personas.forEach((persona, index) => {
        const teamNumber = factions.indexOf(persona.faction) + 1;
        const roleMap = {
          'Commander': 'commander',
          'Scout': 'scout',
          'Medic': 'medic',
          'Sabotager': 'demolition',
          'Infantry': 'assault'
        };
        
        const characterType = roleMap[persona.role] || 'assault';
        const key = `team${teamNumber}_${characterType}_${index}`;
        
        characters[key] = {
          fatigue: Math.min(100 - (persona.traits.fatigue || 20), 100),
          moral: persona.traits.morale || 50,
          health: persona.traits.health || 50,
          terrain: persona.traits.adaptability || 50,
          personaData: persona
        };
      });
    } else {
      // Generate default characters if no personas available
      const defaultCharacters = {
        team1_commander: { fatigue: 85, moral: 90, health: 80, terrain: 75 },
        team1_scout: { fatigue: 70, moral: 85, health: 75, terrain: 90 },
        team1_medic: { fatigue: 60, moral: 95, health: 85, terrain: 65 },
        team1_assault: { fatigue: 75, moral: 80, health: 70, terrain: 85 },
        team2_commander: { fatigue: 90, moral: 85, health: 85, terrain: 80 },
        team2_assault: { fatigue: 95, moral: 75, health: 90, terrain: 70 },
        team2_scout: { fatigue: 80, moral: 70, health: 75, terrain: 95 },
        team2_demolition: { fatigue: 85, moral: 80, health: 80, terrain: 75 }
      };
      Object.assign(characters, defaultCharacters);
    }
    
    return characters;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#2ed573';
      case 'medium': return '#ffa502';
      case 'hard': return '#ff6b35';
      case 'extreme': return '#ff4757';
      default: return '#2ed573';
    }
  };

  const formatExperienceData = (item) => {
    // Handle different data structures from API
    const title = item.title || item.story || 'War Experience';
    const description = item.baseStory || item.description || item.story || 'An epic battle awaits...';
    const difficulty = item.difficulty || 'Medium';
    
    // Extract team information from personas or use defaults
    let team1Info = { name: 'Team Alpha', size: 4 };
    let team2Info = { name: 'Team Beta', size: 4 };
    
    if (item.personas && item.personas.length > 0) {
      const factions = [...new Set(item.personas.map(p => p.faction))];
      if (factions.length >= 2) {
        const team1Personas = item.personas.filter(p => p.faction === factions[0]);
        const team2Personas = item.personas.filter(p => p.faction === factions[1]);
        
        team1Info = { name: factions[0], size: team1Personas.length };
        team2Info = { name: factions[1], size: team2Personas.length };
      }
    }
    
    return {
      ...item,
      title,
      description,
      difficulty,
      team1: team1Info,
      team2: team2Info,
      theme: getThemeEmoji(title)
    };
  };

  const getThemeEmoji = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('space') || titleLower.includes('galactic')) return '🌌';
    if (titleLower.includes('medieval') || titleLower.includes('kingdom')) return '🏰';
    if (titleLower.includes('zombie') || titleLower.includes('apocalypse')) return '💀';
    if (titleLower.includes('corporate') || titleLower.includes('cyber')) return '🏢';
    if (titleLower.includes('war') || titleLower.includes('battle')) return '⚔️';
    return '🎮';
  };

  const handleRetry = () => {
    dispatch(clearExperienceData());
    dispatch(fetchExperienceData({ page: 1, limit: 20, reset: true }));
  };

  // Show loading state for initial load
  if (experienceData.loading && experienceData.data.length === 0) {
    return (
      <div className="screen select-experience-screen">
        <Button 
          className="back-btn" 
          onClick={goBack}
          variant="secondary"
          icon={<ArrowLeftOutlined />}
        >
          BACK
        </Button>
        
        <div className="container">
          <Title level={1} className="title">🎮 SELECT YOUR EXPERIENCE</Title>
          <Paragraph className="subtitle">Loading epic battles...</Paragraph>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 48, color: '#2ed573' }} spin />} 
              size="large" 
            />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (experienceData.error && experienceData.data.length === 0) {
    return (
      <div className="screen select-experience-screen">
        <Button 
          className="back-btn" 
          onClick={goBack}
          variant="secondary"
          icon={<ArrowLeftOutlined />}
        >
          BACK
        </Button>
        
        <div className="container">
          <Title level={1} className="title">🎮 SELECT YOUR EXPERIENCE</Title>
          <Paragraph className="subtitle">Choose your battlefield and begin the legend</Paragraph>
          
          <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <Alert
              message="Failed to Load Experiences"
              description={experienceData.error.message || 'Unable to fetch experience data from the server.'}
              type="error"
              showIcon
              action={
                <Button
                  onClick={handleRetry}
                  variant="primary"
                  icon={<ReloadOutlined />}
                  size="small"
                >
                  Retry
                </Button>
              }
              style={{
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderColor: '#ff6b35'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!experienceData.loading && experienceData.data.length === 0) {
    return (
      <div className="screen select-experience-screen">
        <Button 
          className="back-btn" 
          onClick={goBack}
          variant="secondary"
          icon={<ArrowLeftOutlined />}
        >
          BACK
        </Button>
        
        <div className="container">
          <Title level={1} className="title">🎮 SELECT YOUR EXPERIENCE</Title>
          <Paragraph className="subtitle">Choose your battlefield and begin the legend</Paragraph>
          
          <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  No experiences available at the moment
                </span>
              }
            >
              <Button onClick={handleRetry} variant="primary">
                Refresh
              </Button>
            </Empty>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen select-experience-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">🎮 SELECT YOUR EXPERIENCE</Title>
        <Paragraph className="subtitle">Choose your battlefield and begin the legend</Paragraph>
        
        {/* Stats */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
            📊 Loaded {experienceData.totalLoaded} experiences
            {experienceData.hasMore && ' • Scroll for more'}
          </Text>
        </div>
        
        <Row gutter={[24, 24]} style={{ marginTop: '3rem' }}>
          {experienceData.data.map((item, index) => {
            const experience = formatExperienceData(item);
            const isLast = index === experienceData.data.length - 1;
            
            return (
              <Col xs={24} lg={12} key={experience.id || index}>
                <Card 
                  ref={isLast ? lastExperienceElementRefCallback : null}
                  className={`experience-card ${selectedExperience === experience.id ? 'selected' : ''}`}
                  hoverable
                  onClick={() => handleSelectExperience(experience)}
                  style={{
                    backgroundColor: selectedExperience === experience.id 
                      ? 'rgba(255, 107, 53, 0.1)' 
                      : 'rgba(46, 213, 115, 0.05)',
                    border: selectedExperience === experience.id 
                      ? '3px solid #ff6b35' 
                      : '2px solid #2ed573',
                    borderRadius: '15px',
                    height: '100%',
                    minHeight: '400px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  bordered={false}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%', height: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {experience.theme}
                      </div>
                      <Title level={3} style={{ margin: 0, color: '#2ed573' }}>
                        {experience.title}
                      </Title>
                      <div style={{ marginTop: '0.5rem' }}>
                        <Text 
                          style={{ 
                            color: getDifficultyColor(experience.difficulty),
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >
                          {experience.difficulty} DIFFICULTY
                        </Text>
                      </div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <Paragraph style={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        lineHeight: 1.6, 
                        textAlign: 'left',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {experience.description}
                      </Paragraph>
                      
                      <div style={{ marginTop: '1.5rem' }}>
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <div style={{ 
                              background: 'rgba(46, 213, 115, 0.1)', 
                              border: '1px solid rgba(46, 213, 115, 0.3)',
                              borderRadius: '8px',
                              padding: '1rem'
                            }}>
                              <Text strong style={{ color: '#2ed573', display: 'block', marginBottom: '0.5rem' }}>
                                ⚔️ {experience.team1.name}
                              </Text>
                              <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                {experience.team1.size} Warriors
                              </Text>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ 
                              background: 'rgba(255, 107, 53, 0.1)', 
                              border: '1px solid rgba(255, 107, 53, 0.3)',
                              borderRadius: '8px',
                              padding: '1rem'
                            }}>
                              <Text strong style={{ color: '#ff6b35', display: 'block', marginBottom: '0.5rem' }}>
                                🛡️ {experience.team2.name}
                              </Text>
                              <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                {experience.team2.size} Warriors
                              </Text>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    
                    {selectedExperience === experience.id && (
                      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                        <Button 
                          variant="launch"
                          icon={<PlayCircleOutlined />}
                          size="large"
                          style={{ 
                            background: 'linear-gradient(45deg, #ff6b35, #ff4757)',
                            borderColor: '#ff6b35',
                            animation: 'pulse 2s infinite'
                          }}
                        >
                          START THIS EXPERIENCE
                        </Button>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
        
        {/* Loading more indicator */}
        {(isLoadingMore || experienceData.loading) && experienceData.data.length > 0 && (
          <div style={{ textAlign: 'center', margin: '3rem 0' }}>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 24, color: '#2ed573' }} spin />} 
              size="large" 
            />
            <div style={{ marginTop: '1rem' }}>
              <Text style={{ color: '#2ed573' }}>Loading more experiences...</Text>
            </div>
          </div>
        )}
        
        {/* End of data indicator */}
        {!experienceData.hasMore && experienceData.data.length > 0 && (
          <div style={{ textAlign: 'center', margin: '3rem 0' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              🏁 You've reached the end of available experiences
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectExperienceScreen;