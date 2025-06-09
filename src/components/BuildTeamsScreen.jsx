import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Avatar, Descriptions } from 'antd';
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
      setCurrentTraits({
        morale: firstPersona.morale || 50,
        strength: firstPersona.strength || 50,
        fatigue: firstPersona.fatigue || 20,
        health: firstPersona.health || 50
      });
    }
  }, [team1Personas, selectedPersona]);

  useEffect(() => {
    if (selectedPersona) {
      setCurrentTraits({
        morale: selectedPersona.morale || 50,
        strength: selectedPersona.strength || 50,
        fatigue: selectedPersona.fatigue || 20,
        health: selectedPersona.health || 50
      });
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
        <Title level={1} className="title">
          {gameState.gameMode === 'experience' ? '🎮 CUSTOMIZE WARRIORS' : '🏗️ BUILD YOUR CHAMPIONS'}
        </Title>
        <Text className="subtitle">
          {gameState.gameMode === 'experience' 
            ? 'Fine-tune your pre-loaded warriors for battle'
            : 'Customize your warriors for battle'
          }
        </Text>
        
        {/* Game Mode Indicator */}
        <div className="mode-indicator">
          <div className={`mode-indicator-badge mode-indicator-badge--${gameState.gameMode}`}>
            <Text className="mode-indicator-text">
              {gameState.gameMode === 'experience' ? '🎮 Experience Mode: Pre-loaded warriors with unique backstories' : '🛠️ Create Mode: Build your custom army'}
            </Text>
          </div>
        </div>
        
        <div className="build-teams-layout">
          {/* Roster Panel (Left Column) */}
          <div className="roster-panel">
            <Card className="roster-card" bordered={false}>
              <div className="roster-content">
                {/* Team Selection */}
                <div className="team-selection">
                  <Text className="team-selection-title">Select Team</Text>
                  <div className="team-selection-buttons">
                    <Button 
                      onClick={() => switchTeam(1)}
                      variant={selectedTeam === 1 ? 'primary' : 'secondary'}
                      size="large"
                      className="team-selection-button"
                    >
                      ⚔️ {gameState.story.team1Name || 'TEAM ONE'} ({team1Personas.length})
                    </Button>
                    <Button 
                      onClick={() => switchTeam(2)}
                      variant={selectedTeam === 2 ? 'primary' : 'secondary'}
                      size="large"
                      className="team-selection-button"
                    >
                      🛡️ {gameState.story.team2Name || 'TEAM TWO'} ({team2Personas.length})
                    </Button>
                  </div>
                </div>

                {/* Character Roster */}
                <div className="character-roster">
                  <Text className="roster-title">
                    {selectedTeam === 1 ? '⚔️ Team One' : '🛡️ Team Two'} Warriors
                  </Text>
                  <div className="character-list">
                    {getCurrentTeamPersonas().map((persona) => (
                      <div
                        key={persona.name}
                        className={`character-roster-item ${selectedPersona?.name === persona.name ? 'character-roster-item--active' : ''}`}
                        onClick={() => selectPersona(persona)}
                      >
                        <div className="character-roster-avatar">
                          <Avatar size="large" className="character-avatar">
                            {getPersonaAvatar(persona)}
                          </Avatar>
                        </div>
                        <div className="character-roster-info">
                          <Text strong className="character-roster-name">
                            {persona.name}
                          </Text>
                          <Text className="character-roster-type">
                            {persona.type} - {persona.npcType}
                          </Text>
                          <div className="character-roster-stats">
                            <Text className="character-roster-stat">
                              Morale: {persona.morale} | Health: {persona.health}
                            </Text>
                          </div>
                        </div>
                        {selectedPersona?.name === persona.name && hasUnsavedChanges && (
                          <div className="character-roster-indicator">
                            <div className="unsaved-indicator" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Character Sheet (Right Column) */}
          <div className="character-sheet">
            <Card className="character-sheet-card" bordered={false}>
              {selectedPersona && (
                <div className="character-sheet-content">
                  {/* Character Header */}
                  <div className="character-header">
                    <div className="character-header-avatar">
                      <Avatar size={80} className="character-header-avatar-img">
                        {getPersonaAvatar(selectedPersona)}
                      </Avatar>
                    </div>
                    <div className="character-header-info">
                      <Title level={2} className="character-header-name">
                        {selectedPersona.name}
                      </Title>
                      <Text className="character-header-type">
                        {selectedPersona.type} - {selectedPersona.npcType}
                      </Text>
                      <div className="character-header-meta">
                        <Text className="character-header-faction">
                          {selectedPersona.faction} • Age: {selectedPersona.age}
                        </Text>
                        {selectedPersona.agentId && (
                          <Text className="character-header-id">
                            ID: {selectedPersona.agentId}
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Character Background */}
                  {(selectedPersona.background || selectedPersona.motivation) && (
                    <div className="character-section">
                      <div className="section-divider" />
                      {selectedPersona.background && (
                        <div className="character-background">
                          <h4 className="section-heading">Background</h4>
                          <Text className="section-text">
                            "{selectedPersona.background}"
                          </Text>
                        </div>
                      )}
                      {selectedPersona.motivation && (
                        <div className="character-motivation">
                          <h4 className="section-heading">Motivation</h4>
                          <Text className="section-text">
                            "{selectedPersona.motivation}"
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Editable Combat Stats */}
                  <div className="character-section character-stats-section">
                    <div className="section-divider" />
                    <h4 className="section-heading">⚙️ Editable Combat Stats</h4>
                    
                    <div className="stats-container">
                      <StatSlider
                        label="🧠 Morale"
                        value={currentTraits.morale || 50}
                        onChange={(value) => updateTrait('morale', value)}
                      />
                      
                      <StatSlider
                        label="💪 Strength"
                        value={currentTraits.strength || 50}
                        onChange={(value) => updateTrait('strength', value)}
                      />
                      
                      <StatSlider
                        label="😴 Fatigue"
                        value={currentTraits.fatigue || 20}
                        onChange={(value) => updateTrait('fatigue', value)}
                      />
                      
                      <StatSlider
                        label="❤️ Health"
                        value={currentTraits.health || 50}
                        onChange={(value) => updateTrait('health', value)}
                      />
                    </div>
                  </div>

                  {/* Personality Traits */}
                  {selectedPersona.personality && (
                    <div className="character-section">
                      <div className="section-divider" />
                      <h4 className="section-heading">🧠 Personality Traits (Read-Only)</h4>
                      <div className="personality-grid">
                        <div className="personality-item">
                          <Text className="personality-label">⚔️ Bravery:</Text>
                          <Text className="personality-value">
                            {selectedPersona.personality.bravery}
                          </Text>
                        </div>
                        <div className="personality-item">
                          <Text className="personality-label">🤝 Loyalty:</Text>
                          <Text className="personality-value">
                            {selectedPersona.personality.loyalty}
                          </Text>
                        </div>
                        <div className="personality-item">
                          <Text className="personality-label">🔄 Adaptability:</Text>
                          <Text className="personality-value">
                            {selectedPersona.personality.adaptability}
                          </Text>
                        </div>
                        <div className="personality-item">
                          <Text className="personality-label">⚡ Impulsiveness:</Text>
                          <Text className="personality-value">
                            {selectedPersona.personality.impulsiveness}
                          </Text>
                        </div>
                        <div className="personality-item">
                          <Text className="personality-label">🎯 Discipline:</Text>
                          <Text className="personality-value">
                            {selectedPersona.personality.discipline}
                          </Text>
                        </div>
                        <div className="personality-item">
                          <Text className="personality-label">🧠 Tactical:</Text>
                          <Text className="personality-value">
                            {selectedPersona.personality.tactical_thinking}
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedPersona.skills && (
                    <div className="character-section">
                      <div className="section-divider" />
                      <h4 className="section-heading">🎯 Skills (Read-Only)</h4>
                      <div className="skills-grid">
                        {Object.entries(selectedPersona.skills).map(([skillKey, skillValue], index) => (
                          <div key={skillKey} className="skill-item">
                            <Text className="skill-label">🔸 Skill {index + 1}:</Text>
                            <Text className="skill-value">
                              {skillValue}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {(selectedPersona.terrainStronghold || selectedPersona.affiliation) && (
                    <div className="character-section">
                      <div className="section-divider" />
                      <h4 className="section-heading">📍 Additional Info</h4>
                      <div className="additional-info">
                        {selectedPersona.terrainStronghold && (
                          <div className="info-item">
                            <Text className="info-label">🏔️ Terrain Stronghold:</Text>
                            <Text className="info-value">
                              {selectedPersona.terrainStronghold}
                            </Text>
                          </div>
                        )}
                        {selectedPersona.affiliation && (
                          <div className="info-item">
                            <Text className="info-label">🏛️ Affiliation:</Text>
                            <Text className="info-value">
                              {selectedPersona.affiliation}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Save Button */}
                  <div className="character-sheet-actions">
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
          </div>
        </div>
        
        <div className="proceed-section">
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
  // Remove old props as we're now using Redux hooks
};

export default BuildTeamsScreen;