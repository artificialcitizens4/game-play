import { useState, useEffect } from 'react';
import { Input, Typography, Card, Space, message, Spin, InputNumber, Row, Col } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, BulbOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentScreen, updateStory } from '../store/slices/gameSlice';
import { submitStoryToAPI } from '../store/slices/apiSlice';
import { addNotification, updateFormState } from '../store/slices/uiSlice';
import { useStoryData, useStorySubmission, useAppDispatch } from '../hooks/useRedux';
import Button from './Button';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const StoryScreen = () => {
  const dispatch = useAppDispatch();
  const storyData = useStoryData();
  const storySubmission = useStorySubmission();

  const handleInputChange = (field, value) => {
    dispatch(updateStory({ [field]: value }));
    
    // Update form state
    dispatch(updateFormState({
      formName: 'story',
      updates: {
        isDirty: true,
        isValid: value && (typeof value === 'string' ? value.trim().length > 0 : value > 0)
      }
    }));
  };

  const handleTeamSizeChange = (field, value) => {
    // Ensure value is within bounds
    const clampedValue = Math.max(0, Math.min(12, value || 0));
    dispatch(updateStory({ [field]: clampedValue }));
    
    // Update form state
    dispatch(updateFormState({
      formName: 'story',
      updates: {
        isDirty: true,
        isValid: storyData.background?.trim().length > 0
      }
    }));
  };

  const proceedToTeamSetup = async () => {
    const storyText = storyData.background?.trim();
    
    if (!storyText) {
      dispatch(addNotification({
        type: 'warning',
        title: 'Story Required',
        message: 'Please enter a background story before proceeding.'
      }));
      return;
    }

    try {
      // Submit story to API with team sizes
      const storyPayload = {
        story: storyText,
        teamSizeA: storyData.teamSizeA || 4,
        teamSizeB: storyData.teamSizeB || 4
      };
      
      const result = await dispatch(submitStoryToAPI(storyPayload));
      
      if (submitStoryToAPI.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          title: 'Story Submitted',
          message: 'Your story has been successfully submitted to the game engine!'
        }));
      }
    } catch (error) {
      // Error is handled by the async thunk
      console.error('Story submission error:', error);
    }
    
    // Proceed to next screen regardless of API success/failure
    dispatch(setCurrentScreen('team-setup'));
  };

  const goBack = () => {
    dispatch(setCurrentScreen('main'));
  };

  const isFormValid = () => {
    return storyData.background?.trim().length > 0;
  };

  return (
    <div className="screen story-screen">
      <Button 
        className="back-btn" 
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
        disabled={storySubmission.loading}
      >
        BACK
      </Button>
      
      <div className="container">
        <Title level={1} className="title">📜 CREATE THE BACKSTORY</Title>
        <Paragraph className="subtitle">Forge the legend of your epic war</Paragraph>
        
        <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Card className="story-form" bordered={false}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: '1.2rem', color: '#ff6b35', display: 'block', marginBottom: '0.5rem' }}>
                  War Background Story
                </Text>
                <TextArea 
                  rows={6}
                  value={storyData.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  placeholder="Describe the setting and reason for this conflict..."
                  disabled={storySubmission.loading}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    border: '2px solid #2ed573',
                    borderRadius: '8px',
                    color: '#2ed573',
                    fontSize: '1rem'
                  }}
                />
                
                {/* Character count indicator */}
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <Text style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.8rem' 
                  }}>
                    {storyData.background?.length || 0} characters
                  </Text>
                </div>
              </div>

              {/* Team Size Configuration */}
              <div>
                <Text strong style={{ fontSize: '1.2rem', color: '#ff6b35', display: 'block', marginBottom: '1rem' }}>
                  Army Configuration
                </Text>
                
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Card 
                      size="small"
                      style={{ 
                        backgroundColor: 'rgba(46, 213, 115, 0.1)',
                        border: '1px solid #2ed573',
                        borderRadius: '8px'
                      }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text strong style={{ color: '#2ed573', fontSize: '1rem' }}>
                          ⚔️ Team 1 Size
                        </Text>
                        <InputNumber
                          min={0}
                          max={12}
                          value={storyData.teamSizeA || 4}
                          onChange={(value) => handleTeamSizeChange('teamSizeA', value)}
                          disabled={storySubmission.loading}
                          style={{ width: '100%' }}
                          placeholder="Enter team 1 size"
                        />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                          Number of warriors in the first army (0-12)
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Card 
                      size="small"
                      style={{ 
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        border: '1px solid #ff6b35',
                        borderRadius: '8px'
                      }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text strong style={{ color: '#ff6b35', fontSize: '1rem' }}>
                          🛡️ Team 2 Size
                        </Text>
                        <InputNumber
                          min={0}
                          max={12}
                          value={storyData.teamSizeB || 4}
                          onChange={(value) => handleTeamSizeChange('teamSizeB', value)}
                          disabled={storySubmission.loading}
                          style={{ width: '100%' }}
                          placeholder="Enter team 2 size"
                        />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                          Number of warriors in the second army (0-12)
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
          
          <Card className="example-box" bordered={false} style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', border: '2px solid #ff6b35' }}>
            <Space direction="vertical" size="small">
              <Text strong style={{ color: '#ff6b35', fontSize: '1.1rem' }}>
                <BulbOutlined /> Example Reference:
              </Text>
              <Paragraph style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                <Text strong>Background:</Text> The year is 2087. After the Great Resource Wars, two mega-corporations fight for control of the last water reserves on Earth.
              </Paragraph>
              <Paragraph style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                <Text strong>Setting:</Text> A post-apocalyptic world where technology and survival instincts clash in the ultimate battle for humanity's future.
              </Paragraph>
              <Paragraph style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                <Text strong>Army Sizes:</Text> Team 1 with 6 elite warriors vs Team 2 with 8 fierce fighters creates an interesting strategic imbalance.
              </Paragraph>
            </Space>
          </Card>

          {/* API Status Indicator */}
          {storySubmission.loading && (
            <Card 
              size="small" 
              style={{ 
                backgroundColor: 'rgba(46, 213, 115, 0.1)', 
                border: '1px solid #2ed573',
                textAlign: 'center'
              }}
            >
              <Space>
                <Spin 
                  indicator={<LoadingOutlined style={{ fontSize: 16, color: '#2ed573' }} spin />} 
                />
                <Text style={{ color: '#2ed573' }}>
                  Submitting your story to the game engine...
                </Text>
              </Space>
            </Card>
          )}

          {/* API Success/Error Messages */}
          {storySubmission.success && (
            <Card 
              size="small" 
              style={{ 
                backgroundColor: 'rgba(46, 213, 115, 0.1)', 
                border: '1px solid #2ed573',
                textAlign: 'center'
              }}
            >
              <Text style={{ color: '#2ed573' }}>
                ✅ Story successfully submitted to game engine!
              </Text>
            </Card>
          )}

          {storySubmission.error && (
            <Card 
              size="small" 
              style={{ 
                backgroundColor: 'rgba(255, 107, 53, 0.1)', 
                border: '1px solid #ff6b35',
                textAlign: 'center'
              }}
            >
              <Text style={{ color: '#ff6b35' }}>
                ⚠️ {storySubmission.error.message}
              </Text>
            </Card>
          )}
        </Space>
        
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Button 
            onClick={proceedToTeamSetup}
            icon={<ArrowRightOutlined />}
            size="large"
            disabled={storySubmission.loading || !isFormValid()}
            loading={storySubmission.loading}
          >
            {storySubmission.loading ? 'SUBMITTING STORY...' : 'NEXT: SETUP TEAMS'}
          </Button>
          
          {!isFormValid() && (
            <div style={{ marginTop: '1rem' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                💡 Please enter a background story to continue
              </Text>
            </div>
          )}
          
          {/* Team size summary */}
          {(storyData.teamSizeA || storyData.teamSizeB) && (
            <div style={{ marginTop: '1rem' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                ⚔️ Team 1: {storyData.teamSizeA || 4} warriors | 🛡️ Team 2: {storyData.teamSizeB || 4} warriors
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryScreen;