import { useState, useEffect } from 'react';
import { Card, Typography, Avatar } from 'antd';
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
        
        <div className="character-details-container">
          <Card className="character-details" bordered={false}>
            <div className="character-details__grid">
              {/* Identity Column */}
              <div className="character-details__identity">
                <div className="character-identity-content">
                  <Avatar size={100} className="character-identity-avatar">
                    {character.avatar}
                  </Avatar>
                  <Title level={2} className="character-identity-name">
                    {character.name}
                  </Title>
                  <Text className="character-identity-role">
                    {character.role}
                  </Text>
                </div>
              </div>
              
              {/* Stats and Actions Column */}
              <div className="character-details__stats-and-actions">
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
                
                <div className="character-details-actions">
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
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;