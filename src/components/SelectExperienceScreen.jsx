import { useState } from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Button from './Button';

const { Title, Text, Paragraph } = Typography;

const SelectExperienceScreen = ({ onShowScreen, onSelectExperience }) => {
  const [selectedExperience, setSelectedExperience] = useState(null);

  const experiences = [
    {
      id: 'corporate-war',
      title: '🏢 Corporate War 2087',
      subtitle: 'The Water Wars',
      description: 'In the year 2087, after the Great Resource Wars devastated the planet, two powerful mega-corporations emerged from the ashes to fight for control of the last remaining water reserves on Earth.',
      team1: {
        name: 'AquaTech Industries',
        size: 500,
        description: 'Elite technological warriors equipped with advanced hydro-tech weaponry and tactical superiority.'
      },
      team2: {
        name: 'Iron Fist Syndicate',
        size: 750,
        description: 'Ruthless combat specialists with overwhelming firepower and brutal efficiency.'
      },
      characters: 'Commander Sarah Chen leads AquaTech with tactical brilliance and cutting-edge technology, while General Marcus Kane commands Iron Fist with ruthless determination and superior firepower.',
      difficulty: 'Medium',
      theme: '🌊'
    },
    {
      id: 'medieval-kingdoms',
      title: '⚔️ Medieval Kingdoms',
      subtitle: 'The Crown Wars',
      description: 'Two ancient kingdoms clash for the throne of the realm. Magic and steel collide as noble houses fight for ultimate dominion over the lands.',
      team1: {
        name: 'Kingdom of Valeria',
        size: 800,
        description: 'Noble knights and skilled archers defending their ancestral lands with honor and valor.'
      },
      team2: {
        name: 'Shadow Empire',
        size: 600,
        description: 'Dark sorcerers and fierce warriors wielding forbidden magic and ancient weapons.'
      },
      characters: 'King Aldric the Just leads Valeria with wisdom and courage, while the Shadow Lord commands his empire with dark magic and cunning strategy.',
      difficulty: 'Easy',
      theme: '🏰'
    },
    {
      id: 'space-colonies',
      title: '🚀 Space Colonies 3021',
      subtitle: 'The Galactic Conflict',
      description: 'In the far reaches of space, two colonial factions battle for control of a newly discovered planet rich in rare minerals essential for interstellar travel.',
      team1: {
        name: 'Terra Federation',
        size: 400,
        description: 'Advanced space marines with cutting-edge technology and superior training protocols.'
      },
      team2: {
        name: 'Rebel Alliance',
        size: 650,
        description: 'Guerrilla fighters with improvised weapons and unmatched determination for freedom.'
      },
      characters: 'Admiral Nova leads the Federation with strategic precision, while Commander Rex rallies the rebels with inspiring leadership and tactical innovation.',
      difficulty: 'Hard',
      theme: '🌌'
    },
    {
      id: 'zombie-apocalypse',
      title: '🧟 Zombie Apocalypse',
      subtitle: 'The Last Stand',
      description: 'The world has fallen to a zombie plague. Two survivor groups must fight not only the undead hordes but each other for the last safe haven on Earth.',
      team1: {
        name: 'Military Survivors',
        size: 300,
        description: 'Disciplined soldiers with military training and access to heavy weaponry and fortifications.'
      },
      team2: {
        name: 'Civilian Resistance',
        size: 450,
        description: 'Resourceful civilians who have adapted to survive using improvised weapons and guerrilla tactics.'
      },
      characters: 'Colonel Hayes leads the military with tactical expertise, while Dr. Morgan organizes the civilians with scientific knowledge and survival instincts.',
      difficulty: 'Extreme',
      theme: '💀'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#2ed573';
      case 'Medium': return '#ffa502';
      case 'Hard': return '#ff6b35';
      case 'Extreme': return '#ff4757';
      default: return '#2ed573';
    }
  };

  const handleSelectExperience = (experience) => {
    setSelectedExperience(experience.id);
    
    // Create game data for the selected experience
    const gameData = {
      story: {
        background: experience.description,
        team1Name: experience.team1.name,
        team1Size: experience.team1.size,
        team2Name: experience.team2.name,
        team2Size: experience.team2.size,
        characters: experience.characters
      },
      characters: {
        // Pre-configured characters for experience mode
        team1_commander: { fatigue: 85, moral: 90, health: 80, terrain: 75 },
        team1_sniper: { fatigue: 70, moral: 85, health: 75, terrain: 90 },
        team1_medic: { fatigue: 60, moral: 95, health: 85, terrain: 65 },
        team1_engineer: { fatigue: 75, moral: 80, health: 70, terrain: 85 },
        team2_general: { fatigue: 90, moral: 85, health: 85, terrain: 80 },
        team2_assault: { fatigue: 95, moral: 75, health: 90, terrain: 70 },
        team2_scout: { fatigue: 80, moral: 70, health: 75, terrain: 95 },
        team2_demolition: { fatigue: 85, moral: 80, health: 80, terrain: 75 }
      },
      currentCharacter: null,
      currentTeam: null
    };

    onSelectExperience(gameData);
  };

  return (
    <div className="screen select-experience-screen">
      <Button 
        className="back-btn" 
        onClick={() => onShowScreen('main')}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">🎮 SELECT YOUR EXPERIENCE</Title>
        <Paragraph className="subtitle">Choose your battlefield and begin the legend</Paragraph>
        
        <Row gutter={[24, 24]} style={{ marginTop: '3rem' }}>
          {experiences.map((experience) => (
            <Col xs={24} lg={12} key={experience.id}>
              <Card 
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
                    <Text style={{ color: '#ff6b35', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      {experience.subtitle}
                    </Text>
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
                    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, textAlign: 'left' }}>
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
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SelectExperienceScreen;