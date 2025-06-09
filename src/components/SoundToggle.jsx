import { Button } from 'antd';
import { SoundOutlined, SoundFilled } from '@ant-design/icons';
import { useUIState, useAppDispatch } from '../hooks/useRedux';
import { toggleSound } from '../store/slices/uiSlice';

const SoundToggle = ({ className = '' }) => {
  const uiState = useUIState();
  const dispatch = useAppDispatch();

  const handleToggleSound = () => {
    dispatch(toggleSound());
    
    // Play a test sound when enabling
    if (!uiState.soundEnabled && window.playWarSound) {
      setTimeout(() => {
        window.playWarSound('buttonClick');
      }, 100);
    }
  };

  return (
    <Button
      type="text"
      icon={uiState.soundEnabled ? <SoundFilled /> : <SoundOutlined />}
      onClick={handleToggleSound}
      className={`sound-toggle ${className}`}
      style={{
        position: 'fixed',
        top: '30px',
        right: '30px',
        zIndex: 1000,
        background: 'rgba(10, 10, 10, 0.9)',
        border: `2px solid ${uiState.soundEnabled ? '#2ed573' : '#ff6b35'}`,
        color: uiState.soundEnabled ? '#2ed573' : '#ff6b35',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        boxShadow: `0 8px 25px ${uiState.soundEnabled ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 107, 53, 0.2)'}`,
        transition: 'all 0.3s ease',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title={uiState.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
    />
  );
};

export default SoundToggle;