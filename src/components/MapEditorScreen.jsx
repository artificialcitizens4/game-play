import { useState, useEffect } from "react";
import { Typography, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Button from "./Button";
import BattlefieldMapEditor from "./BattlefieldMapEditor";
import { setCurrentScreen, setBattlefieldMap } from "../store/slices/gameSlice";
import { useAppDispatch, useGameState } from "../hooks/useRedux";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const MapEditorScreen = ({ gameData, onSaveBattlefieldMap = () => {} }) => {
  const [mapData, setMapData] = useState(null);
  const [isMapComplete, setIsMapComplete] = useState(false);
  const dispatch = useAppDispatch();
  const gameState = useGameState();

  const handleMapExport = (exportedMapData) => {
    console.log('Received map data from iframe:', exportedMapData);
    
    // Validate the map data structure
    if (!exportedMapData || !exportedMapData.map_dimensions) {
      console.warn('Invalid map data received, using default structure');
      exportedMapData = createDefaultMapData();
    }
    
    setMapData(exportedMapData);
    setIsMapComplete(true);
    
    // Store the map data in Redux state
    dispatch(setBattlefieldMap(exportedMapData));
    onSaveBattlefieldMap(exportedMapData);
    
    message.success("Battlefield map saved successfully!");

    // Auto-proceed to next screen after a short delay
    setTimeout(() => {
      proceedToWarSummary();
    }, 2000);
  };

  const proceedToWarSummary = () => {
    dispatch(setCurrentScreen("war-summary"));
  };

  const skipMapEditor = () => {
    // Use the provided default map data
    const defaultMapData = createDefaultMapData();
    
    console.log('Using default map data:', defaultMapData);
    
    // Store the default map data in Redux state
    dispatch(setBattlefieldMap(defaultMapData));
    onSaveBattlefieldMap(defaultMapData);
    
    message.info("Using default battlefield map");
    dispatch(setCurrentScreen("war-summary"));
  };

  const goBack = () => {
    // In experience mode, go back to experience selection
    // In create mode, go back to build teams screen
    if (gameState.gameMode === 'experience') {
      dispatch(setCurrentScreen('select-experience'));
    } else {
      dispatch(setCurrentScreen('build-teams'));
    }
  };

  const createDefaultMapData = () => {
    return {
      "battlefield_type": "urban",
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

  // Listen for completion events from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://map-q.vercel.app") {
        return;
      }

      console.log('Received message from iframe:', event.data);

      if (event.data && event.data.type === "MAP_GENERATION_COMPLETE") {
        handleMapExport(event.data.mapData);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="screen map-editor-screen">
      <Button
        className="back-btn"
        onClick={goBack}
        variant="secondary"
        icon={<ArrowLeftOutlined />}
      >
        BACK
      </Button>

      <div className="container">
        <Title level={1} className="title">
          🗺️ BATTLEFIELD DESIGNER
        </Title>
        <Text className="subtitle">
          Design your battlefield and customize the terrain for epic warfare
        </Text>

        {/* Show mode indicator */}
        {gameState.gameMode === 'experience' && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid #ff6b35',
            borderRadius: '8px',
            padding: '1rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            <Text style={{ color: '#ff6b35', fontSize: '1rem', fontWeight: 'bold' }}>
              🎮 EXPERIENCE MODE
            </Text>
            <br />
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Warriors are pre-loaded with unique backstories • Design your battlefield for the ultimate showdown
            </Text>
          </div>
        )}

        <div style={{ margin: "2rem 0" }}>
          <BattlefieldMapEditor
            onExportMap={handleMapExport}
            gameData={gameData}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          {/* Show completion status */}
          {isMapComplete && (
            <div
              style={{
                background: "rgba(46, 213, 115, 0.1)",
                border: "1px solid #2ed573",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "2rem",
                maxWidth: "400px",
                margin: "0 auto 2rem auto",
              }}
            >
              <Text style={{ color: "#2ed573", fontSize: "1rem" }}>
                ✅ Battlefield Ready: {mapData?.battlefield_type || "Custom"} (
                {mapData?.map_dimensions?.width || 10}x
                {mapData?.map_dimensions?.height || 10})
              </Text>
              <br />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.9rem",
                }}
              >
                Proceeding to war summary...
              </Text>
            </div>
          )}

          {/* Action buttons */}
          {!isMapComplete && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={proceedToWarSummary}
                variant="primary"
                icon={<ArrowRightOutlined />}
                size="large"
                disabled={!mapData}
              >
                CONTINUE WITH MAP
              </Button>

              <Button onClick={skipMapEditor} variant="secondary" size="large">
                USE DEFAULT MAP
              </Button>
            </div>
          )}

          {!isMapComplete && (
            <div style={{ marginTop: "1rem" }}>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.9rem",
                }}
              >
                💡 Create a custom battlefield or use a default map to continue
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MapEditorScreen.propTypes = {
  gameData: PropTypes.object,
  onSaveBattlefieldMap: PropTypes.func,
};

export default MapEditorScreen;