import { useEffect, useRef, useState } from 'react';
import { Card, Typography, Space, Spin, Alert } from 'antd';
import { CheckOutlined, LoadingOutlined, ExclamationCircleOutlined, LinkOutlined } from '@ant-design/icons';
import Button from './Button';
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

const BattlefieldMapEditor = ({onExportMap}) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Set a timeout to detect if iframe fails to load
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
        setErrorMessage('The external map generator cannot be embedded. This is due to security restrictions.');
      }
    }, 10000); // 10 second timeout

    // Listen for messages from the iframe
    const handleMessage = (event) => {
      // Verify the origin for security
      if (event.origin !== 'https://map-generator-1.vercel.app') {
        return;
      }

      clearTimeout(loadTimeout);

      console.log(event)
      // Check if the message indicates completion
      if (event.data && event.data.type === 'MAP_GENERATION_COMPLETE') {
        setIsComplete(true);
        setIsLoading(false);
        
        // Extract map data from the message

        console.log(event.data.mapData)
        const mapData = event.data.mapData || createDefaultMapData();

        // Call the export callback with the map data
        if (onExportMap) {
          onExportMap(mapData);
        }
      }

      // Handle iframe load completion
      if (event.data && event.data.type === 'IFRAME_LOADED') {
        setIsLoading(false);
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Handle iframe load event
    const handleIframeLoad = () => {
      clearTimeout(loadTimeout);
      setIsLoading(false);
      setHasError(false);
    };

    // Handle iframe error
    const handleIframeError = () => {
      clearTimeout(loadTimeout);
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('Failed to load the external map generator.');
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      iframe.addEventListener('error', handleIframeError);
    }

    // Cleanup
    return () => {
      clearTimeout(loadTimeout);
      window.removeEventListener('message', handleMessage);
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
        iframe.removeEventListener('error', handleIframeError);
      }
    };
  }, [onExportMap]);

  const createDefaultMapData = () => {
    return {
      battlefield_type: 'plains',
      map_dimensions: {
        width: 12,
        height: 10
      },
      hex_data: generateDefaultHexData(),
      strategic_zones: generateDefaultZones(),
      objects: generateDefaultObjects()
    };
  };

  const generateDefaultHexData = () => {
    const hexData = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 12; col++) {
        const terrain = Math.random() > 0.7 ? 'Forest (Light)' : 
                       Math.random() > 0.8 ? 'Hill (Steep/Ridge)' : 'Clear';
        hexData.push({
          coord: `${col},${row}`,
          terrain: terrain,
          elevation: Math.floor(Math.random() * 3) + 1
        });
      }
    }
    return hexData;
  };

  const generateDefaultZones = () => {
    return [
      {
        id: 'zone_1',
        name: 'Alpha Point',
        strategic_value: 5,
        hexes: [{ col: 3, row: 3 }, { col: 4, row: 3 }, { col: 3, row: 4 }],
        color: '#ff6b35'
      },
      {
        id: 'zone_2',
        name: 'Bravo Ridge',
        strategic_value: 7,
        hexes: [{ col: 8, row: 6 }, { col: 9, row: 6 }, { col: 8, row: 7 }],
        color: '#2ed573'
      }
    ];
  };

  const generateDefaultObjects = () => {
    return [
      {
        id: 'obj_1',
        name: 'Command Post',
        type: 'military',
        emoji: '⚔️',
        coordinates: { hex: { col: 6, row: 5 } }
      }
    ];
  };

  const handleUseDefaultMap = () => {
    const defaultMap = createDefaultMapData();
    setIsComplete(true);
    if (onExportMap) {
      onExportMap(defaultMap);
    }
  };

  const openExternalGenerator = () => {
    window.open('https://map-generator-1.vercel.app', '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      style={{
        backgroundColor: 'rgba(46, 213, 115, 0.05)',
        border: '2px solid #2ed573',
        borderRadius: '15px',
        marginBottom: '2rem'
      }}
      bordered={false}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#2ed573' }}>
            🗺️ BATTLEFIELD DESIGNER
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Design your battlefield and customize the terrain for epic warfare
          </Text>
        </div>

        {/* Loading indicator */}
        {isLoading && !hasError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 24, color: '#2ed573' }} spin />} 
              size="large" 
            />
            <div style={{ marginTop: '1rem' }}>
              <Text style={{ color: '#2ed573' }}>Loading Battlefield Designer...</Text>
            </div>
          </div>
        )}

        {/* Error state with fallback options */}
        {hasError && !isComplete && (
          <div style={{ textAlign: 'center' }}>
            <Alert
              message="External Map Generator Unavailable"
              description={errorMessage}
              type="warning"
              icon={<ExclamationCircleOutlined />}
              style={{ 
                marginBottom: '2rem',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderColor: '#ff6b35'
              }}
            />
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{
                background: 'rgba(46, 213, 115, 0.1)',
                border: '1px solid #2ed573',
                borderRadius: '8px',
                padding: '2rem'
              }}>
                <Title level={4} style={{ color: '#2ed573', margin: '0 0 1rem 0' }}>
                  🎯 Choose Your Option
                </Title>
                
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button
                    onClick={handleUseDefaultMap}
                    variant="primary"
                    size="large"
                    style={{ width: '100%' }}
                  >
                    🗺️ USE DEFAULT BATTLEFIELD
                  </Button>
                  
                  <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                    A pre-designed battlefield with strategic zones and varied terrain
                  </Text>
                  
                  <div style={{ margin: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
                    <Button
                      onClick={openExternalGenerator}
                      variant="secondary"
                      size="large"
                      icon={<LinkOutlined />}
                      style={{ width: '100%' }}
                    >
                      OPEN MAP GENERATOR IN NEW TAB
                    </Button>
                    
                    <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', display: 'block', marginTop: '0.5rem' }}>
                      Create your map externally, then return here to continue
                    </Text>
                  </div>
                </Space>
              </div>
            </Space>
          </div>
        )}

        {/* Completion indicator */}
        {isComplete && (
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem',
            background: 'rgba(46, 213, 115, 0.1)',
            border: '1px solid #2ed573',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <CheckOutlined style={{ color: '#2ed573', fontSize: '1.5rem', marginRight: '0.5rem' }} />
            <Text style={{ color: '#2ed573', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Battlefield Design Complete!
            </Text>
          </div>
        )}

        {/* Iframe container - only show if no error */}
        {!hasError && (
          <div 
            style={{
              border: '2px solid #2ed573',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              height: '600px',
              position: 'relative',
              display: isLoading ? 'none' : 'block'
            }}
          >
            <iframe
              ref={iframeRef}
              src="https://map-generator-1.vercel.app"
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="Battlefield Map Generator"
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}

        {!hasError && !isComplete && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              💡 Use the map generator above to design your battlefield. The map will be automatically saved when complete.
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

BattlefieldMapEditor.propTypes = {
  onExportMap: PropTypes.func
};

export default BattlefieldMapEditor;