import { useEffect } from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { setCurrentScreen, setGameMode, resetGame } from '../store/slices/gameSlice';
import { useAppDispatch } from '../hooks/useRedux';
import SoundToggle from './SoundToggle';

const { Title, Paragraph } = Typography;

const MainScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
      card.classList.add('fade-in-up');
    });
  }, []);

  const showCreateMode = () => {
    dispatch(resetGame());
    dispatch(setGameMode('create'));
    dispatch(setCurrentScreen('story'));
  };

  return (
    <div className="screen main-screen">
      <SoundToggle />
      
      <div className="container">
        <Title level={1} className="title">⚔️ WAR COMMAND ⚔️</Title>
        <Paragraph className="subtitle">Create your epic war scenario</Paragraph>
        
        <Row gutter={[48, 24]} justify="center" style={{ marginTop: '4rem' }}>
          <Col xs={24} md={12} lg={8}>
            <Card 
              className="mode-card"
              hoverable
              onClick={showCreateMode}
              style={{
                backgroundColor: 'rgba(46, 213, 115, 0.05)',
                border: '2px solid #2ed573',
                borderRadius: '15px',
                textAlign: 'center',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ fontSize: '4rem' }}>
                  <ToolOutlined />
                </div>
                <Title level={3} style={{ color: '#ffffff', margin: 0 }}>
                  CREATE WAR SCENARIO
                </Title>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '1.1rem' }}>
                  Craft your own war scenario, build teams, and customize every detail
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MainScreen;