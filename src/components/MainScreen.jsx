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
      card.classList.add('observer-fade-in');
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
        <h1 className="game-title">War Command</h1>
        <Paragraph className="subtitle">
          Observe autonomous agents in strategic warfare scenarios. Create contexts, generate stories, and watch events unfold in real-time.
        </Paragraph>
        
        <Row gutter={[48, 32]} justify="center" style={{ marginTop: '4rem' }}>
          <Col xs={24} md={12} lg={8}>
            <Card 
              className="mode-card"
              hoverable
              onClick={showCreateMode}
              style={{
                textAlign: 'center',
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ 
                  fontSize: '3rem',
                  color: '#45B1E3',
                  filter: 'drop-shadow(0 0 10px rgba(69, 177, 227, 0.3))'
                }}>
                  <ToolOutlined />
                </div>
                <Title level={3} style={{ 
                  color: '#F4F4F4', 
                  margin: 0,
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  Create Scenario
                </Title>
                <Paragraph style={{ 
                  color: '#555A62', 
                  margin: 0, 
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  maxWidth: '240px',
                  margin: '0 auto'
                }}>
                  Design war contexts and observe autonomous agent behavior in strategic simulations
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Observer status indicators */}
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 100
        }}>
          <div className="simulation-status">
            <div className="war-indicator"></div>
            System Ready
          </div>
        </div>

        {/* Abstract geometric elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '2px',
          height: '60px',
          background: 'linear-gradient(180deg, #3B8C91, transparent)',
          opacity: 0.4,
          zIndex: -1
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '12%',
          width: '40px',
          height: '2px',
          background: 'linear-gradient(90deg, #45B1E3, transparent)',
          opacity: 0.4,
          zIndex: -1
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '8px',
          height: '8px',
          border: '1px solid #3B8C91',
          opacity: 0.3,
          zIndex: -1
        }}></div>
      </div>
    </div>
  );
};

export default MainScreen;