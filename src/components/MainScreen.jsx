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
      card.style.animationDelay = `${index * 0.3}s`;
      card.classList.add('gentle-fade-in');
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
        <Title level={1} className="title">🌸 War Command 🌸</Title>
        <Paragraph className="subtitle">Create your magical war adventure</Paragraph>
        
        <Row gutter={[48, 24]} justify="center" style={{ marginTop: '4rem' }}>
          <Col xs={24} md={12} lg={8}>
            <Card 
              className="mode-card"
              hoverable
              onClick={showCreateMode}
              style={{
                textAlign: 'center',
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ 
                  fontSize: '4rem',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
                }}>
                  🎨
                </div>
                <Title level={3} style={{ 
                  color: '#5D4E37', 
                  margin: 0,
                  fontFamily: "'Comic Sans MS', cursive, sans-serif"
                }}>
                  Create War Story
                </Title>
                <Paragraph style={{ 
                  color: '#8B7355', 
                  margin: 0, 
                  fontSize: '1.1rem',
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                  lineHeight: 1.6
                }}>
                  Craft your own magical war tale with custom characters and enchanted battlefields
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          fontSize: '2rem',
          opacity: 0.3,
          animation: 'gentleFloat 8s ease-in-out infinite',
          zIndex: -1
        }}>
          🦋
        </div>
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          fontSize: '1.5rem',
          opacity: 0.3,
          animation: 'gentleFloat 10s ease-in-out infinite reverse',
          zIndex: -1
        }}>
          🌿
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          fontSize: '1.8rem',
          opacity: 0.3,
          animation: 'gentleFloat 12s ease-in-out infinite',
          zIndex: -1
        }}>
          ✨
        </div>
      </div>
    </div>
  );
};

export default MainScreen;