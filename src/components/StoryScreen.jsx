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
        
        <div className="story-screen__grid">
          {/* Main Content Column */}
          <div className="story-screen__main-content">
            {/* Story Input Form */}
            <Card className="story-form" bordered={false}>
              <Space direction="vertical" size="large" className="story-form__content">
                <div className="story-input-section">
                  <Text strong className="story-input-label">
                    War Background Story
                  </Text>
                  <TextArea 
                    rows={6}
                    value={storyData.background}
                    onChange={(e) => handleInputChange('background', e.target.value)}
                    placeholder="Describe the setting and reason for this conflict..."
                    disabled={storySubmission.loading}
                    className="story-textarea"
                  />
                  
                  <div className="character-count">
                    <Text className="character-count-text">
                      {storyData.background?.length || 0} characters
                    </Text>
                  </div>
                </div>

                {/* Army Configuration */}
                <div className="army-config-section">
                  <Text strong className="army-config-title">
                    Army Configuration
                  </Text>
                  
                  <div className="army-config-grid">
                    <Card size="small" className="team-size-card team-size-card--team1">
                      <div className="team-size-content">
                        <Text strong className="team-size-label">
                          ⚔️ Team 1 Size
                        </Text>
                        <InputNumber
                          min={0}
                          max={12}
                          value={storyData.teamSizeA || 4}
                          onChange={(value) => handleTeamSizeChange('teamSizeA', value)}
                          disabled={storySubmission.loading}
                          className="team-size-input"
                          placeholder="Enter team 1 size"
                        />
                        <Text className="team-size-description">
                          Number of warriors in the first army (0-12)
                        </Text>
                      </div>
                    </Card>
                    
                    <Card size="small" className="team-size-card team-size-card--team2">
                      <div className="team-size-content">
                        <Text strong className="team-size-label">
                          🛡️ Team 2 Size
                        </Text>
                        <InputNumber
                          min={0}
                          max={12}
                          value={storyData.teamSizeB || 4}
                          onChange={(value) => handleTeamSizeChange('teamSizeB', value)}
                          disabled={storySubmission.loading}
                          className="team-size-input"
                          placeholder="Enter team 2 size"
                        />
                        <Text className="team-size-description">
                          Number of warriors in the second army (0-12)
                        </Text>
                      </div>
                    </Card>
                  </div>
                </div>
              </Space>
            </Card>

            {/* Form Actions */}
            <div className="form-actions">
              <Button 
                onClick={proceedToTeamSetup}
                icon={<ArrowRightOutlined />}
                size="large"
                disabled={storySubmission.loading || !isFormValid()}
                loading={storySubmission.loading}
                className="next-button"
              >
                {storySubmission.loading ? 'SUBMITTING STORY...' : 'NEXT: SETUP TEAMS'}
              </Button>
              
              {!isFormValid() && (
                <div className="form-help-text">
                  <Text className="form-help-message">
                    💡 Please enter a background story to continue
                  </Text>
                </div>
              )}
              
              {/* Team size summary */}
              {(storyData.teamSizeA || storyData.teamSizeB) && (
                <div className="team-summary">
                  <Text className="team-summary-text">
                    ⚔️ Team 1: {storyData.teamSizeA || 4} warriors | 🛡️ Team 2: {storyData.teamSizeB || 4} warriors
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="story-screen__sidebar">
            {/* Example Reference */}
            <Card className="example-box" bordered={false}>
              <div className="example-content">
                <Text strong className="example-title">
                  <BulbOutlined /> Example Reference:
                </Text>
                <div className="example-items">
                  <Paragraph className="example-item">
                    <Text strong>Background:</Text> The year is 2087. After the Great Resource Wars, two mega-corporations fight for control of the last water reserves on Earth.
                  </Paragraph>
                  <Paragraph className="example-item">
                    <Text strong>Setting:</Text> A post-apocalyptic world where technology and survival instincts clash in the ultimate battle for humanity's future.
                  </Paragraph>
                  <Paragraph className="example-item">
                    <Text strong>Army Sizes:</Text> Team 1 with 6 elite warriors vs Team 2 with 8 fierce fighters creates an interesting strategic imbalance.
                  </Paragraph>
                </div>
              </div>
            </Card>

            {/* Status Messages */}
            <div className="status-messages">
              {/* API Loading Status */}
              {storySubmission.loading && (
                <Card size="small\" className="status-card status-card--loading">
                  <div className="status-content">
                    <Spin 
                      indicator={<LoadingOutlined className="status-spinner\" spin />} 
                    />
                    <Text className="status-text">
                      Submitting your story to the game engine...
                    </Text>
                  </div>
                </Card>
              )}

              {/* API Success Message */}
              {storySubmission.success && (
                <Card size="small" className="status-card status-card--success">
                  <Text className="status-text">
                    ✅ Story successfully submitted to game engine!
                  </Text>
                </Card>
              )}

              {/* API Error Message */}
              {storySubmission.error && (
                <Card size="small" className="status-card status-card--error">
                  <Text className="status-text">
                    ⚠️ {storySubmission.error.message}
                  </Text>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryScreen;