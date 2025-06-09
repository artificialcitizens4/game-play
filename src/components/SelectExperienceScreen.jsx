import { useState, useEffect } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);

  // Clear experience data and fetch all data when component mounts
  useEffect(() => {
    dispatch(clearExperienceData());
    dispatch(fetchExperienceData());
  }, [dispatch]);

  const goBack = () => {
    dispatch(setCurrentScreen('main'));
  };

  const handleSelectExperience = async (experience) => {
    console.log('Selected experience:', experience);
    setSelectedExperience(experience.id);
    setIsProcessing(true);
    
    try {
      // Set the game mode first
      dispatch(setGameMode('experience'));
      
      // Store the API game data directly in Redux
      dispatch({ type: 'game/setApiGameData', payload: experience });
      
      // Convert personas to characters format
      dispatch({ type: 'game/convertPersonasToCharacters' });
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        // Navigate directly to map editor screen (skipping team setup and customization)
        dispatch(setCurrentScreen('map-editor'));
        setIsProcessing(false);
      }, 500);
      
    } catch (error) {
      console.error('Error processing experience selection:', error);
      setIsProcessing(false);
    }
  };

  const formatExperienceData = (item) => {
    console.log('Formatting experience item:', item);
    
    // Handle different data structures from API
    const title = item.title || item.story || `War Experience ${item.id || 'Unknown'}`;
    const description = item.baseStory || item.description || item.story || 'An epic battle awaits...';
    const difficulty = item.difficulty || 'Medium';
    
    // Extract team information from personas or use defaults
    let team1Info = { name: 'Team Alpha', size: 4 };
    let team2Info = { name: 'Team Beta', size: 4 };
    
    if (item.personas && Array.isArray(item.personas) && item.personas.length > 0) {
      const factions = [...new Set(item.personas.map(p => p.faction))];
      console.log('Found factions:', factions);
      
      if (factions.length >= 2) {
        const team1Personas = item.personas.filter(p => p.faction === factions[0]);
        const team2Personas = item.personas.filter(p => p.faction === factions[1]);
        
        team1Info = { name: factions[0], size: team1Personas.length };
        team2Info = { name: factions[1], size: team2Personas.length };
      } else if (factions.length === 1) {
        // If only one faction, split personas into two teams
        const allPersonas = item.personas;
        const midPoint = Math.ceil(allPersonas.length / 2);
        
        team1Info = { name: factions[0] + ' Alpha', size: midPoint };
        team2Info = { name: factions[0] + ' Beta', size: allPersonas.length - midPoint };
      }
    }
    
    return {
      ...item,
      title,
      description,
      difficulty,
      team1: team1Info,
      team2: team2Info,
      theme: getThemeEmoji(title),
      personaCount: item.personas ? item.personas.length : 0
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#2ed573';
      case 'medium': return '#ffa502';
      case 'hard': return '#ff6b35';
      case 'extreme': return '#ff4757';
      default: return '#2ed573';
    }
  };

  const handleRetry = () => {
    dispatch(clearExperienceData());
    dispatch(fetchExperienceData());
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

  console.log('Experience data to render:', experienceData.data);

  return (
    <div className="screen select-experience-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
        disabled={isProcessing}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">🎮 SELECT YOUR EXPERIENCE</Title>
        <Paragraph className="subtitle">Choose your battlefield and begin the legend</Paragraph>
        
        {/* Experience Mode Flow Info */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          background: 'rgba(255, 107, 53, 0.1)',
          border: '1px solid #ff6b35',
          borderRadius: '8px',
          padding: '1rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <Text style={{ color: '#ff6b35', fontSize: '1rem', fontWeight: 'bold' }}>
            🎮 EXPERIENCE MODE
          </Text>
          <br />
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
            Pre-loaded warriors with unique backstories • Skip directly to battlefield design
          </Text>
        </div>
        
        {/* Stats */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
            📊 {experienceData.totalLoaded} experiences available
          </Text>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            background: 'rgba(46, 213, 115, 0.1)',
            border: '1px solid #2ed573',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 24, color: '#2ed573' }} spin />} 
            />
            <Text style={{ color: '#2ed573', marginLeft: '1rem' }}>
              Loading experience and proceeding to battlefield design...
            </Text>
          </div>
        )}
        
        <Row gutter={[24, 24]} style={{ marginTop: '3rem' }}>
          {experienceData.data.map((item, index) => {
            const experience = formatExperienceData(item);
            const isSelected = selectedExperience === (experience.id || index);
            
            return (
              <Col xs={24} lg={12} key={experience.id || index}>
                <Card 
                  className={`experience-card ${isSelected ? 'selected' : ''}`}
                  hoverable={!isProcessing}
                  onClick={() => !isProcessing && handleSelectExperience(experience)}
                  style={{
                    backgroundColor: isSelected
                      ? 'rgba(255, 107, 53, 0.1)' 
                      : 'rgba(46, 213, 115, 0.05)',
                    border: isSelected
                      ? '3px solid #ff6b35' 
                      : '2px solid #2ed573',
                    borderRadius: '15px',
                    height: '100%',
                    minHeight: '400px',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    opacity: isProcessing && !isSelected ? 0.6 : 1,
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

                      {/* Show personas count if available */}
                      {experience.personaCount > 0 && (
                        <div style={{ 
                          marginTop: '1rem',
                          textAlign: 'center',
                          background: 'rgba(46, 213, 115, 0.05)',
                          border: '1px solid rgba(46, 213, 115, 0.2)',
                          borderRadius: '6px',
                          padding: '0.5rem'
                        }}>
                          <Text style={{ color: '#2ed573', fontSize: '0.8rem' }}>
                            👥 {experience.personaCount} unique warriors ready for battle
                          </Text>
                        </div>
                      )}

                      {/* Experience Mode Flow Indicator */}
                      <div style={{ 
                        marginTop: '1rem',
                        textAlign: 'center',
                        background: 'rgba(255, 107, 53, 0.05)',
                        border: '1px solid rgba(255, 107, 53, 0.2)',
                        borderRadius: '6px',
                        padding: '0.5rem'
                      }}>
                        <Text style={{ color: '#ff6b35', fontSize: '0.8rem' }}>
                          🚀 Direct to Battlefield Design
                        </Text>
                      </div>

                      {/* Debug info for development */}
                      {process.env.NODE_ENV === 'development' && (
                        <div style={{ 
                          marginTop: '1rem',
                          textAlign: 'center',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          padding: '0.5rem'
                        }}>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
                            Debug: ID={experience.id}, Personas={experience.personas?.length || 0}
                          </Text>
                        </div>
                      )}
                    </div>
                    
                    {isSelected && !isProcessing && (
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
                          START EXPERIENCE
                        </Button>
                      </div>
                    )}

                    {isSelected && isProcessing && (
                      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                        <Button 
                          variant="primary"
                          icon={<LoadingOutlined spin />}
                          size="large"
                          disabled
                        >
                          LOADING...
                        </Button>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default SelectExperienceScreen;