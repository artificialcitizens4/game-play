import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Avatar } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, CheckOutlined } from '@ant-design/icons';
import Button from './Button';
import StatSlider from './StatSlider';

const { Title, Text } = Typography;

const CharacterDetails = ({ onShowScreen, gameData, onSaveCharacter }) => {
  const [stats, setStats] = useState({
    fatigue: 50,
    moral: 50,
    health: 50,
    terrain: 50
  });

  const [isSaving, setIsSaving] = useState(false);

  const characterData = {
    'commander': { name: 'Commander', role: 'Strategic Leader', avatar: '👨‍✈️' },
    'sniper': { name: 'Sniper', role: 'Long Range Specialist', avatar: '🎯' },
    'medic': { name: 'Medic', role: 'Support & Healing', avatar: '⚕️' },
    'engineer': { name: 'Engineer', role: 'Tech & Fortification', avatar: '🔧' },
    'general': { name: 'General', role: 'Battle Commander', avatar: '👨‍💼' },
    'assault': { name: 'Assault', role: 'Heavy Infantry', avatar: '💥' },
    'scout': { name: 'Scout', role: 'Reconnaissance', avatar: '🏃‍♂️' },
    'demolition': { name: 'Demolition', role: 'Explosives Expert', avatar: '💣' }
  };

  useEffect(() => {
    // Load existing stats if available
    const key = `team${gameData.currentTeam}_${gameData.currentCharacter}`;
    if (gameData.characters[key]) {
      setStats(gameData.characters[key]);
    }
  }, [gameData]);

  const character = characterData[gameData.currentCharacter];
  const teamNumber = gameData.currentTeam;

  const updateStat = (statName, value) => {
    setStats(prev => ({
      ...prev,
      [statName]: parseInt(value)
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    onSaveCharacter(stats);
    
    setTimeout(() => {
      setIsSaving(false);
      const backScreen = teamNumber === 1 ? 'team1' : 'team2';
      onShowScreen(backScreen);
    }, 1000);
  };

  const goBack = () => {
    const backScreen = teamNumber === 1 ? 'team1' : 'team2';
    onShowScreen(backScreen);
  };

  if (!character) return null;

  return (
    <div className="screen character-details-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">
          TEAM {teamNumber} - {character.name.toUpperCase()} CUSTOMIZATION
        </Title>
        
        <Row justify="center">
          <Col xs={24} lg={16}>
            <Card className="character-details" bordered={false}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={100} style={{ backgroundColor: 'transparent', fontSize: '5rem', marginBottom: '1rem' }}>
                    {character.avatar}
                  </Avatar>
                  <Title level={2} style={{ margin: 0, background: 'linear-gradient(45deg, #2ed573, #ff6b35)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {character.name}
                  </Title>
                  <Text style={{ color: '#ff6b35', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    {character.role}
                  </Text>
                </div>
                
                <div className="stats-container">
                  <StatSlider
                    label="💪 Fatigue Resistance"
                    value={stats.fatigue}
                    onChange={(value) => updateStat('fatigue', value)}
                  />
                  
                  <StatSlider
                    label="🧠 Moral Strength"
                    value={stats.moral}
                    onChange={(value) => updateStat('moral', value)}
                  />
                  
                  <StatSlider
                    label="❤️ Health"
                    value={stats.health}
                    onChange={(value) => updateStat('health', value)}
                  />
                  
                  <StatSlider
                    label="🏔️ Terrain Advantage"
                    value={stats.terrain}
                    onChange={(value) => updateStat('terrain', value)}
                  />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <Button 
                    onClick={handleSave}
                    variant="save"
                    disabled={isSaving}
                    icon={isSaving ? <CheckOutlined /> : <SaveOutlined />}
                    size="large"
                  >
                    {isSaving ? 'SAVED!' : 'SAVE CHARACTER'}
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CharacterDetails;