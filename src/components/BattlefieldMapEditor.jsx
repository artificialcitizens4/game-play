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
      if (event.origin !== 'https://map-q.vercel.app') {
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
      "battlefield_type": "plains",
      "map_dimensions": {
        "width": 10,
        "height": 10
      },
      "hex_data": [
        {
          "coord": "0,0",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "1,0",
          "terrain": "Room",
          "elevation": 2
        },
        {
          "coord": "2,0",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "3,0",
          "terrain": "Clear",
          "elevation": 2
        },
        {
          "coord": "4,0",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "5,0",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "6,0",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "7,0",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "8,0",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "9,0",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "0,1",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "1,1",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "2,1",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "3,1",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "4,1",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "5,1",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "6,1",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "7,1",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "8,1",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "9,1",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "0,2",
          "terrain": "Room",
          "elevation": 1
        },
        {
          "coord": "1,2",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "2,2",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "3,2",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "4,2",
          "terrain": "Clear",
          "elevation": 2
        },
        {
          "coord": "5,2",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "6,2",
          "terrain": "Room",
          "elevation": 2
        },
        {
          "coord": "7,2",
          "terrain": "Room",
          "elevation": 2
        },
        {
          "coord": "8,2",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "9,2",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "0,3",
          "terrain": "Clear",
          "elevation": 2
        },
        {
          "coord": "1,3",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "2,3",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "3,3",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "4,3",
          "terrain": "Room",
          "elevation": 1
        },
        {
          "coord": "5,3",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "6,3",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "7,3",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "8,3",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "9,3",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "0,4",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "1,4",
          "terrain": "Clear",
          "elevation": 2
        },
        {
          "coord": "2,4",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "3,4",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "4,4",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "5,4",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "6,4",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "7,4",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "8,4",
          "terrain": "Room",
          "elevation": 1
        },
        {
          "coord": "9,4",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "0,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "1,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "2,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "3,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "4,5",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "5,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "6,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "7,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "8,5",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "9,5",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "0,6",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "1,6",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "2,6",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "3,6",
          "terrain": "Room",
          "elevation": 2
        },
        {
          "coord": "4,6",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "5,6",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "6,6",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "7,6",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "8,6",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "9,6",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "0,7",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "1,7",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "2,7",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "3,7",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "4,7",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "5,7",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "6,7",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "7,7",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "8,7",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "9,7",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "0,8",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "1,8",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "2,8",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "3,8",
          "terrain": "Hill (Steep/Ridge)",
          "elevation": 1
        },
        {
          "coord": "4,8",
          "terrain": "Road",
          "elevation": 2
        },
        {
          "coord": "5,8",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "6,8",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "7,8",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "8,8",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "9,8",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "0,9",
          "terrain": "Forest (Light)",
          "elevation": 2
        },
        {
          "coord": "1,9",
          "terrain": "Street",
          "elevation": 1
        },
        {
          "coord": "2,9",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "3,9",
          "terrain": "Room",
          "elevation": 1
        },
        {
          "coord": "4,9",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "5,9",
          "terrain": "Street",
          "elevation": 2
        },
        {
          "coord": "6,9",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "7,9",
          "terrain": "Clear",
          "elevation": 1
        },
        {
          "coord": "8,9",
          "terrain": "Road",
          "elevation": 1
        },
        {
          "coord": "9,9",
          "terrain": "Street",
          "elevation": 1
        }
      ],
      "strategic_zones": [
        {
          "id": "zone_1",
          "name": "Alpha Point",
          "strategic_value": 5,
          "hexes": [{ "col": 3, "row": 3 }, { "col": 4, "row": 3 }, { "col": 3, "row": 4 }],
          "color": "#ff6b35"
        },
        {
          "id": "zone_2",
          "name": "Bravo Ridge",
          "strategic_value": 7,
          "hexes": [{ "col": 8, "row": 6 }, { "col": 9, "row": 6 }, { "col": 8, "row": 7 }],
          "color": "#2ed573"
        },
        {
          "id": "zone_3",
          "name": "Charlie Hill",
          "strategic_value": 6,
          "hexes": [{ "col": 5, "row": 2 }, { "col": 6, "row": 2 }, { "col": 5, "row": 3 }],
          "color": "#ffa502"
        }
      ],
      "objects": [
        {
          "id": "obj_1",
          "name": "Command Post",
          "type": "military",
          "emoji": "⚔️",
          "coordinates": { "hex": { "col": 5, "row": 5 } }
        },
        {
          "id": "obj_2",
          "name": "Supply Depot",
          "type": "building",
          "emoji": "🏠",
          "coordinates": { "hex": { "col": 2, "row": 7 } }
        },
        {
          "id": "obj_3",
          "name": "Ancient Monument",
          "type": "landmark",
          "emoji": "🏛️",
          "coordinates": { "hex": { "col": 9, "row": 3 } }
        }
      ]
    };
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
        coordinates: { hex: { col: 5, row: 5 } }
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
    window.open('https://map-q.vercel.app/', '_blank', 'noopener,noreferrer');
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
                    A pre-designed 10x10 battlefield with strategic zones and varied terrain including streets, rooms, hills, and forests
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
              src="https://map-q.vercel.app/"
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