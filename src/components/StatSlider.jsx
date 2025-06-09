import { useState, useEffect } from 'react';
import { Slider, Typography, Row, Col } from 'antd';

const { Text } = Typography;

const StatSlider = ({ label, value, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const getStatColor = (val) => {
    if (val <= 33) return '#ff4757';
    if (val <= 66) return '#ffa502';
    return '#2ed573';
  };

  const handleChange = (newValue) => {
    setDisplayValue(newValue);
    onChange(newValue);
  };

  const colorData = getStatColor(displayValue);

  return (
    <div className="stat-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
        <Col>
          <Text strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
            {label}
          </Text>
        </Col>
        <Col>
          <Text 
            strong 
            style={{
              fontSize: '1.3rem',
              color: colorData,
              textShadow: `0 0 10px ${colorData}50`
            }}
          >
            {displayValue}
          </Text>
        </Col>
      </Row>
      
      <Slider
        min={0}
        max={100}
        value={displayValue}
        onChange={handleChange}
        trackStyle={{ backgroundColor: colorData }}
        handleStyle={{ 
          borderColor: colorData,
          backgroundColor: '#ffffff',
          boxShadow: `0 0 15px ${colorData}80`
        }}
        railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      />
    </div>
  );
};

export default StatSlider;