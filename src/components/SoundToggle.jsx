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
        top: '32px',
        right: '32px',
        zIndex: 1000,
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem'
      }}
      title={uiState.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
    />
  );
};

export default SoundToggle;