import { useEffect } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

const TeamScreen = ({ teamNumber, onShowScreen, onSelectCharacter, savedCharacters }) => {
  const teamData = {
    1: {
      title: '⚔️ ASSEMBLE YOUR WARRIORS',
      indicator: 'TEAM ONE CHARACTERS',
      characters: [
        { type: 'commander', name: 'Commander', role: 'Strategic Leader', avatar: '👨‍✈️' },
        { type: 'sniper', name: 'Sniper', role: 'Long Range Specialist', avatar: '🎯' },
        { type: 'medic', name: 'Medic', role: 'Support & Healing', avatar: '⚕️' },
        { type: 'engineer', name: 'Engineer', role: 'Tech & Fortification', avatar: '🔧' }
      ],
      backScreen: 'story',
      nextScreen: 'team2'
    },
    2: {
      title: '🛡️ BUILD YOUR LEGION',
      indicator: 'TEAM TWO CHARACTERS',
      characters: [
        { type: 'general', name: 'General', role: 'Battle Commander', avatar: '👨‍💼' },
        { type: 'assault', name: 'Assault', role: 'Heavy Infantry', avatar: '💥' },
        { type: 'scout', name: 'Scout', role: 'Reconnaissance', avatar: '🏃‍♂️' },
        { type: 'demolition', name: 'Demolition', role: 'Explosives Expert', avatar: '💣' }
      ],
      backScreen: 'team1',
      nextAction: 'war-summary'
    }
  };

  const team = teamData[teamNumber];

  useEffect(() => {
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('slide-in');
    });
  }, []);

  const isCharacterSaved = (characterType) => {
    const key = `team${teamNumber}_${characterType}`;
    return savedCharacters[key] !== undefined;
  };

  const handleNext = () => {
    if (team.nextAction) {
      onShowScreen(team.nextAction);
    } else {
      onShowScreen(team.nextScreen);
    }
  };

  return (
    <div className="screen team-screen">
      <Button 
        className="back-btn" 
        onClick={() => onShowScreen(team.backScreen)}
        variant="secondary"
      >
        ⬅ BACK
      </Button>
      
      <div className="container">
        <div className="team-indicator">{team.indicator}</div>
        <h1 className="title">{team.title}</h1>
        <p className="subtitle">Select and customize your team&apos;s champions</p>
        
        <div className="character-grid">
          {team.characters.map((character) => (
            <div 
              key={character.type}
              className={`character-card ${isCharacterSaved(character.type) ? 'saved' : ''}`}
              onClick={() => onSelectCharacter(character.type, teamNumber)}
            >
              <div className="character-avatar">{character.avatar}</div>
              <div className="character-name">{character.name}</div>
              <div className="character-role">{character.role}</div>
            </div>
          ))}
        </div>
        
        <Button onClick={handleNext}>
          {teamNumber === 2 ? '📜 VIEW WAR SUMMARY' : 'CONTINUE TO TEAM TWO ➡️'}
        </Button>
      </div>
    </div>
  );
};

TeamScreen.propTypes = {
  teamNumber: PropTypes.number.isRequired,
  onShowScreen: PropTypes.func.isRequired,
  onSelectCharacter: PropTypes.func.isRequired,
  savedCharacters: PropTypes.object.isRequired
};

export default TeamScreen;