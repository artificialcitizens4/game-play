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
        style={{
          marginBottom: '0.5rem'
        }}
        trackStyle={{
          backgroundColor: colorData,
          height: '6px'
        }}
        handleStyle={{
          display: 'none', // Hide the handle completely
          opacity: 0,
          width: 0,
          height: 0,
          border: 'none',
          boxShadow: 'none'
        }}
        railStyle={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          height: '6px'
        }}
        tooltip={{
          open: false
        }}
      />
    </div>
  );
};

export default StatSlider;