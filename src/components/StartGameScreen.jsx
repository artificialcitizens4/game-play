import { Typography } from 'antd';
import { RocketOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Button from './Button';

const { Title, Paragraph } = Typography;

const StartGameScreen = ({ onShowScreen }) => {
  return (
    <div className="screen start-game-screen">
      <div className="container">
        <Title level={1} className="title">🎮 BATTLE READY!</Title>
        <Paragraph className="subtitle">Your forces are assembled. Let the war begin!</Paragraph>
        
        <Title level={2} className="status-ready">
          ⚔️ All systems ready for combat ⚔️
        </Title>
        
        <Button 
          variant="launch"
          icon={<RocketOutlined />}
          size="large"
          className="button--pulse-animation"
        >
          LAUNCH BATTLEFIELD
        </Button>
        
        {onShowScreen && (
          <Button 
            variant="secondary" 
            onClick={() => onShowScreen('main')}
            icon={<ArrowLeftOutlined />}
            className="back-to-main-button"
          >
            BACK TO MAIN MENU
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartGameScreen;