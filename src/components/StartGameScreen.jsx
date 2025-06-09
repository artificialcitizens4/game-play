import { Card, Typography, Space } from 'antd';
import { RocketOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Button from './Button';

const { Title, Paragraph } = Typography;

const StartGameScreen = ({ onShowScreen }) => {
  return (
    <div className="screen start-game-screen">
      <div className="container">
        <Title level={1} className="title">🎮 BATTLE READY!</Title>
        <Paragraph className="subtitle">Your forces are assembled. Let the war begin!</Paragraph>
        
        <Card 
          style={{ 
            backgroundColor: 'rgba(46, 213, 115, 0.05)',
            border: '2px solid #2ed573',
            borderRadius: '15px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '3rem auto'
          }}
          bordered={false}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ fontSize: '3rem', color: '#2ed573' }}>
              ⚔️ All systems ready for combat ⚔️
            </div>
            
            <Button 
              variant="launch"
              icon={<RocketOutlined />}
              size="large"
            >
              LAUNCH BATTLEFIELD
            </Button>
            
            {onShowScreen && (
              <Button 
                variant="secondary" 
                onClick={() => onShowScreen('main')}
                icon={<ArrowLeftOutlined />}
              >
                BACK TO MAIN MENU
              </Button>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default StartGameScreen;