import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Avatar } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import Button from './Button';
import StatSlider from './StatSlider';
import { setCurrentScreen, updatePersonaTraits, savePersonaChanges } from '../store/slices/gameSlice';
import PropTypes from 'prop-types';
import { useAppDispatch, usePersonas, usePersonasByFaction, useGameState } from '../hooks/useRedux';

const { Title, Text } = Typography;

const BuildTeamsScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useGameState();
  const allPersonas = usePersonas();
  const team1Personas = usePersonasByFaction(gameState.story.team1Name);
  const team2Personas = usePersonasByFaction(gameState.story.team2Name);
  
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [currentTraits, setCurrentTraits] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Auto-select first character of team 1 on load
    if (!selectedPersona && team1Personas.length > 0) {
      const firstPersona = team1Personas[0];
      setSelectedPersona(firstPersona);
      setCurrentTraits(firstPersona.traits);
    }
  }, [team1Personas, selectedPersona]);

  useEffect(() => {
    if (selectedPersona) {
      setCurrentTraits(selectedPersona.traits);
      setHasUnsavedChanges(false);
    }
  }, [selectedPersona]);

  const selectPersona = (persona) => {
    if (hasUnsavedChanges) {
      // Auto-save current changes before switching
      saveCurrentPersona();
    }
    setSelectedPersona(persona);
  };

  const switchTeam = (teamNumber) => {
    if (hasUnsavedChanges) {
      // Auto-save current changes before switching teams
      saveCurrentPersona();
    }
    
    setSelectedTeam(teamNumber);
    const teamPersonas = teamNumber === 1 ? team1Personas : team2Personas;
    if (teamPersonas.length > 0) {
      setSelectedPersona(teamPersonas[0]);
    }
  };

  const updateTrait = (traitName, value) => {
    setCurrentTraits(prev => ({
      ...prev,
      [traitName]: parseInt(value)
    }));
    setHasUnsavedChanges(true);
  };

  const saveCurrentPersona = () => {
    if (selectedPersona && hasUnsavedChanges) {
      dispatch(updatePersonaTraits({
        personaName: selectedPersona.name,
        traits: currentTraits
      }));
      setHasUnsavedChanges(false);
    }
  };

  const proceedToMapEditor = () => {
    if (hasUnsavedChanges) {
      saveCurrentPersona();
    }
    dispatch(setCurrentScreen('map-editor'));
  };

  const getCurrentTeamPersonas = () => {
    return selectedTeam === 1 ? team1Personas : team2Personas;
  };

  const getPersonaAvatar = (persona) => {
    const roleEmojis = {
      'Commander': '👨‍✈️',
      'Scout': '🏃‍♂️',
      'Medic': '⚕️',
      'Sabotager': '💣',
      'Infantry': '💥'
    };
    return roleEmojis[persona.role] || '👤';
  };

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

  if (!allPersonas.length) {
    return (
      <div className="screen build-teams-screen">
        <Button 
          className="back-btn" 
          onClick={() => dispatch(setCurrentScreen('team-setup'))}
          variant="secondary"
          icon={<ArrowLeftOutlined />}
        >
          BACK
        </Button>
        
        <div className="container">
          <Title level={1} className="title">🏗️ BUILD YOUR CHAMPIONS</Title>
          <Text className="subtitle">Loading persona data...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="screen build-teams-screen">
      <Button 
        className="back-btn" 
        onClick={() => dispatch(setCurrentScreen('team-setup'))}
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
              ⚔️ {gameState.story.team1Name || 'TEAM ONE'} ({team1Personas.length})
            </Button>
            <Button 
              onClick={() => switchTeam(2)}
              variant={selectedTeam === 2 ? 'primary' : 'secondary'}
              size="large"
            >
              🛡️ {gameState.story.team2Name || 'TEAM TWO'} ({team2Personas.length})
            </Button>
          </Space>
        </div>
        
        <Row gutter={[32, 32]} style={{ marginTop: '2rem' }}>
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Text strong style={{ color: '#ff6b35' }}>
                  {selectedTeam === 1 ? '⚔️ Team One' : '🛡️ Team Two'} Warriors
                </Text>
              }
              className="characters-sidebar"
              bordered={false}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {getCurrentTeamPersonas().map((persona) => (
                  <Card
                    key={persona.name}
                    size="small"
                    hoverable
                    className={`character-item ${selectedPersona?.name === persona.name ? 'active' : ''}`}
                    onClick={() => selectPersona(persona)}
                    style={{
                      backgroundColor: selectedPersona?.name === persona.name 
                        ? 'rgba(255, 107, 53, 0.1)' 
                        : 'transparent',
                      borderColor: selectedPersona?.name === persona.name 
                        ? '#ff6b35' 
                        : 'rgba(46, 213, 115, 0.3)'
                    }}
                  >
                    <Row align="middle" gutter={[12, 0]}>
                      <Col>
                        <Avatar size="large" style={{ backgroundColor: 'transparent', fontSize: '2rem' }}>
                          {getPersonaAvatar(persona)}
                        </Avatar>
                      </Col>
                      <Col flex={1}>
                        <div>
                          <Text strong style={{ color: '#ffffff', display: 'block' }}>
                            {persona.name}
                          </Text>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
                            {persona.role} - {persona.npcType}
                          </Text>
                          <div style={{ marginTop: '0.5rem' }}>
                            <Text style={{ color: getStatColor(persona.traits.morale), fontSize: '0.7rem' }}>
                              Morale: {persona.traits.morale} | Health: {persona.traits.health}
                            </Text>
                          </div>
                        </div>
                      </Col>
                      {selectedPersona?.name === persona.name && hasUnsavedChanges && (
                        <Col>
                          <div style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: '#ffa502',
                            animation: 'pulse 2s infinite'
                          }} />
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
              {selectedPersona && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <Row align="middle" gutter={[24, 0]} justify="center">
                      <Col>
                        <Avatar size={80} style={{ backgroundColor: 'transparent', fontSize: '4rem' }}>
                          {getPersonaAvatar(selectedPersona)}
                        </Avatar>
                      </Col>
                      <Col>
                        <div style={{ textAlign: 'left' }}>
                          <Title level={2} style={{ margin: 0, background: 'linear-gradient(45deg, #2ed573, #ff6b35)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {selectedPersona.name}
                          </Title>
                          <Text style={{ color: '#ff6b35', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {selectedPersona.role} - {selectedPersona.npcType}
                          </Text>
                          <div style={{ marginTop: '0.5rem' }}>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                              {selectedPersona.faction}
                            </Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Backstory */}
                  {selectedPersona.backstory && (
                    <Card 
                      size="small"
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '2rem'
                      }}
                    >
                      <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        "{selectedPersona.backstory}"
                      </Text>
                      {selectedPersona.motivation && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <Text strong style={{ color: '#2ed573', fontSize: '0.8rem' }}>
                            Motivation: 
                          </Text>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                            {selectedPersona.motivation}
                          </Text>
                        </div>
                      )}
                    </Card>
                  )}
                  
                  <div style={{ flex: 1, marginBottom: '2rem' }}>
                    <div className="stats-container">
                      <StatSlider
                        label="🧠 Morale"
                        value={currentTraits.morale || 50}
                        onChange={(value) => updateTrait('morale', value)}
                      />
                      
                      <StatSlider
                        label="❤️ Health"
                        value={currentTraits.health || 50}
                        onChange={(value) => updateTrait('health', value)}
                      />
                      
                      <StatSlider
                        label="⚔️ Bravery"
                        value={currentTraits.bravery || 50}
                        onChange={(value) => updateTrait('bravery', value)}
                      />
                      
                      <StatSlider
                        label="🎯 Discipline"
                        value={currentTraits.discipline || 50}
                        onChange={(value) => updateTrait('discipline', value)}
                      />

                      <StatSlider
                        label="🔄 Adaptability"
                        value={currentTraits.adaptability || 50}
                        onChange={(value) => updateTrait('adaptability', value)}
                      />

                      <StatSlider
                        label="💪 Strength"
                        value={currentTraits.strength || 50}
                        onChange={(value) => updateTrait('strength', value)}
                      />
                    </div>

                    {/* Additional traits display (read-only) */}
                    <Card 
                      size="small"
                      title={<Text style={{ color: '#2ed573', fontSize: '1rem' }}>📊 Additional Traits</Text>}
                      style={{ 
                        backgroundColor: 'rgba(46, 213, 115, 0.05)',
                        border: '1px solid rgba(46, 213, 115, 0.3)',
                        marginTop: '1rem'
                      }}
                    >
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            🤝 Loyalty: <span style={{ color: getStatColor(selectedPersona.traits.loyalty), fontWeight: 'bold' }}>
                              {selectedPersona.traits.loyalty}
                            </span>
                          </Text>
                        </Col>
                        <Col span={12}>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            🧠 Tactical: <span style={{ color: getStatColor(selectedPersona.traits.tacticalThinking), fontWeight: 'bold' }}>
                              {selectedPersona.traits.tacticalThinking}
                            </span>
                          </Text>
                        </Col>
                        <Col span={12}>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            ⚡ Impulsive: <span style={{ color: getStatColor(100 - selectedPersona.traits.impulsiveness), fontWeight: 'bold' }}>
                              {selectedPersona.traits.impulsiveness}
                            </span>
                          </Text>
                        </Col>
                        <Col span={12}>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            😴 Fatigue: <span style={{ color: getStatColor(100 - selectedPersona.traits.fatigue), fontWeight: 'bold' }}>
                              {selectedPersona.traits.fatigue}
                            </span>
                          </Text>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                    <Button 
                      onClick={saveCurrentPersona}
                      variant="save"
                      icon={hasUnsavedChanges ? <SaveOutlined /> : <CheckOutlined />}
                      size="large"
                      disabled={!hasUnsavedChanges}
                    >
                      {hasUnsavedChanges ? 'SAVE CHANGES' : 'SAVED'}
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
          
          {hasUnsavedChanges && (
            <div style={{ marginTop: '1rem' }}>
              <Text style={{ color: '#ffa502', fontSize: '0.9rem' }}>
                💡 You have unsaved changes. They will be auto-saved when you proceed.
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BuildTeamsScreen.propTypes = {
  // Remove old props as we're now using Redux hooks
};

export default BuildTeamsScreen;