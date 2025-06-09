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
        width: '55px',
        height: '55px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}
      title={uiState.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
    />
  );
};

export default SoundToggle;