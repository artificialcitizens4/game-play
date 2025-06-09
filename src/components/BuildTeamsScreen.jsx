import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Avatar } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import Button from './Button';
import StatSlider from './StatSlider';
import { setCurrentScreen } from '../store/slices/gameSlice';
import PropTypes from 'prop-types';
import { useAppDispatch } from '../hooks/useRedux';

const { Title, Text } = Typography;

const BuildTeamsScreen = ({   savedCharacters, gameData, onSaveCharacter = () => {} }) => {
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [stats, setStats] = useState({
    fatigue: 50,
    moral: 50,
    health: 50,
    terrain: 50
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Auto-select first character of team 1 on load
    if (!selectedCharacter && gameData?.team_one?.persona?.length > 0) {
      setSelectedCharacter(gameData.team_one.persona[0]);
      loadCharacterStats(gameData.team_one.persona[0], 1);
    }
  }, [gameData]);

  useEffect(() => {
    if (selectedCharacter) {
      loadCharacterStats(selectedCharacter, selectedTeam);
    }
  }, [selectedCharacter, selectedTeam]);

  const loadCharacterStats = (character, team) => {
    const key = `team${team}_${character.name}`;
    console.log(character, key, savedCharacters)
    if (savedCharacters?.[key]) {
      setStats(savedCharacters[key]);
    } else {
      setStats({
        fatigue: character.traits.fatigue,
        moral: character.traits.morale,
        health: character.traits.health,
        terrain: 50 // Default value as it's not in the traits
      });
    }
  };

  const selectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  const switchTeam = (teamNumber) => {
    setSelectedTeam(teamNumber);
    const teamData = teamNumber === 1 ? gameData.team_one : gameData.team_two;
    if (teamData?.persona?.length > 0) {
      setSelectedCharacter(teamData.persona[0]);
    }
  };

  const updateStat = (statName, value) => {
    setStats(prev => ({
      ...prev,
      [statName]: parseInt(value)
    }));
  };

  const saveCurrentCharacter = () => {
    if (selectedCharacter) {
      onSaveCharacter(stats);
    }
  };

  const isCharacterSaved = (character, team) => {
    console.log(character, team)
    return false
    // const key = `team${team}_${character.name}`;
    // return savedCharacters[key] !== undefined;
  };

  const proceedToMapEditor = () => {
    saveCurrentCharacter();
    dispatch(setCurrentScreen('map-editor'));
  };

  const getCurrentTeamData = () => {
    return selectedTeam === 1 ? gameData.team_one : gameData.team_two;
  };

  return (
    <div className="screen build-teams-screen">
      <Button 
        className="back-btn" 
        onClick={() =>     dispatch(setCurrentScreen('team-setup'))}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">🏗️ BUILD YOUR CHAMPIONS</Title>
        <Text className="subtitle">Customize your warriors for battle</Text>
        
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <Space size="large">
            <Button 
              onClick={() => switchTeam(1)}
              variant={selectedTeam === 1 ? 'primary' : 'secondary'}
              size="large"
            >
              ⚔️ {gameData?.team_one?.name || 'TEAM ONE'}
            </Button>
            <Button 
              onClick={() => switchTeam(2)}
              variant={selectedTeam === 2 ? 'primary' : 'secondary'}
              size="large"
            >
              🛡️ {gameData?.team_two?.name || 'TEAM TWO'}
            </Button>
          </Space>
        </div>
        
        <Row gutter={[32, 32]} style={{ marginTop: '2rem' }}>
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Text strong style={{ color: '#ff6b35' }}>
                  {selectedTeam === 1 ? '⚔️ Team One' : '🛡️ Team Two'} Characters
                </Text>
              }
              className="characters-sidebar"
              bordered={false}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {getCurrentTeamData()?.persona?.map((character) => (
                  <Card
                    key={character.name}
                    size="small"
                    hoverable
                    className={`character-item ${selectedCharacter?.name === character.name ? 'active' : ''}`}
                    onClick={() => selectCharacter(character)}
                    style={{
                      backgroundColor: selectedCharacter?.name === character.name 
                        ? 'rgba(255, 107, 53, 0.1)' 
                        : isCharacterSaved(character, selectedTeam)
                        ? 'rgba(46, 213, 115, 0.1)'
                        : 'transparent',
                      borderColor: selectedCharacter?.name === character.name 
                        ? '#ff6b35' 
                        : isCharacterSaved(character, selectedTeam)
                        ? '#2ed573'
                        : 'rgba(46, 213, 115, 0.3)'
                    }}
                  >
                    <Row align="middle" gutter={[12, 0]}>
                      <Col>
                        <Avatar size="large" style={{ backgroundColor: 'transparent', fontSize: '2rem' }}>
                          {character.role === 'Commander' ? '👨‍✈️' : 
                           character.role === 'Scout' ? '🏃‍♂️' :
                           character.role === 'Medic' ? '⚕️' :
                           character.role === 'Sabotager' ? '💣' :
                           character.role === 'Infantry' ? '💥' : '👤'}
                        </Avatar>
                      </Col>
                      <Col flex={1}>
                        <div>
                          <Text strong style={{ color: '#ffffff', display: 'block' }}>
                            {character.name}
                          </Text>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
                            {character.role} - {character.npcType}
                          </Text>
                        </div>
                      </Col>
                      {isCharacterSaved(character, selectedTeam) && (
                        <Col>
                          <CheckOutlined style={{ color: '#2ed573', fontSize: '1.2rem' }} />
                        </Col>
                      )}
                    </Row>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} lg={16}>
            <Card className="character-customization" bordered={false}>
              {selectedCharacter && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <Row align="middle" gutter={[24, 0]} justify="center">
                      <Col>
                        <Avatar size={80} style={{ backgroundColor: 'transparent', fontSize: '4rem' }}>
                          {selectedCharacter.role === 'Commander' ? '👨‍✈️' : 
                           selectedCharacter.role === 'Scout' ? '🏃‍♂️' :
                           selectedCharacter.role === 'Medic' ? '⚕️' :
                           selectedCharacter.role === 'Sabotager' ? '💣' :
                           selectedCharacter.role === 'Infantry' ? '💥' : '👤'}
                        </Avatar>
                      </Col>
                      <Col>
                        <div style={{ textAlign: 'left' }}>
                          <Title level={2} style={{ margin: 0, background: 'linear-gradient(45deg, #2ed573, #ff6b35)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {selectedCharacter.name}
                          </Title>
                          <Text style={{ color: '#ff6b35', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {selectedCharacter.role} - {selectedCharacter.npcType}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <div style={{ flex: 1, marginBottom: '2rem' }}>
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
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                    <Button 
                      onClick={saveCurrentCharacter}
                      variant="save"
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      SAVE CHARACTER
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Button 
            onClick={proceedToMapEditor} 
            variant="launch"
            icon={<ArrowRightOutlined />}
            size="large"
          >
            DESIGN BATTLEFIELD
          </Button>
        </div>
      </div>
    </div>
  );
};

BuildTeamsScreen.propTypes = {
  onShowScreen: PropTypes.func.isRequired,
  onSelectCharacter: PropTypes.func,
  savedCharacters: PropTypes.object.isRequired,
  gameData: PropTypes.shape({
    team_one: PropTypes.shape({
      name: PropTypes.string,
      persona: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        role: PropTypes.string,
        npcType: PropTypes.string,
        traits: PropTypes.object
      }))
    }),
    team_two: PropTypes.shape({
      name: PropTypes.string,
      persona: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        role: PropTypes.string,
        npcType: PropTypes.string,
        traits: PropTypes.object
      }))
    })
  }),
  onSaveCharacter: PropTypes.func.isRequired
};

export default BuildTeamsScreen;