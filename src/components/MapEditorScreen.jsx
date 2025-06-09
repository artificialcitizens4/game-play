import { useState, useEffect } from "react";
import { Typography, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Button from "./Button";
import BattlefieldMapEditor from "./BattlefieldMapEditor";
import { setCurrentScreen } from "../store/slices/gameSlice";
import { useAppDispatch } from "../hooks/useRedux";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const MapEditorScreen = ({ gameData, onSaveBattlefieldMap = () => {} }) => {
  const [mapData, setMapData] = useState(null);
  const [isMapComplete, setIsMapComplete] = useState(false);
  const dispatch = useAppDispatch();

  const handleMapExport = (exportedMapData) => {
    setMapData(exportedMapData);
    setIsMapComplete(true);
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
    // Create a default map data if skipping
    const defaultMapData = {
      battlefield_type: "plains",
      map_dimensions: {
        width: 12,
        height: 10,
      },
      hex_data: generateDefaultHexData(),
      strategic_zones: generateDefaultZones(),
      objects: generateDefaultObjects(),
    };

    onSaveBattlefieldMap(defaultMapData);
    message.info("Using default battlefield map");
    dispatch(setCurrentScreen("war-summary"));
  };

  const generateDefaultHexData = () => {
    const hexData = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 12; col++) {
        const terrain =
          Math.random() > 0.7
            ? "Forest (Light)"
            : Math.random() > 0.8
            ? "Hill (Steep/Ridge)"
            : "Clear";
        hexData.push({
          coord: `${col},${row}`,
          terrain: terrain,
          elevation: Math.floor(Math.random() * 3) + 1,
        });
      }
    }
    return hexData;
  };

  const generateDefaultZones = () => {
    return [
      {
        id: "zone_1",
        name: "Alpha Point",
        strategic_value: 5,
        hexes: [
          { col: 3, row: 3 },
          { col: 4, row: 3 },
          { col: 3, row: 4 },
        ],
        color: "#ff6b35",
      },
      {
        id: "zone_2",
        name: "Bravo Ridge",
        strategic_value: 7,
        hexes: [
          { col: 8, row: 6 },
          { col: 9, row: 6 },
          { col: 8, row: 7 },
        ],
        color: "#2ed573",
      },
      {
        id: "zone_3",
        name: "Charlie Hill",
        strategic_value: 6,
        hexes: [
          { col: 5, row: 2 },
          { col: 6, row: 2 },
          { col: 5, row: 3 },
        ],
        color: "#ffa502",
      },
    ];
  };

  const generateDefaultObjects = () => {
    return [
      {
        id: "obj_1",
        name: "Command Post",
        type: "military",
        emoji: "⚔️",
        coordinates: { hex: { col: 6, row: 5 } },
      },
      {
        id: "obj_2",
        name: "Supply Depot",
        type: "building",
        emoji: "🏠",
        coordinates: { hex: { col: 2, row: 7 } },
      },
      {
        id: "obj_3",
        name: "Ancient Monument",
        type: "landmark",
        emoji: "🏛️",
        coordinates: { hex: { col: 9, row: 3 } },
      },
    ];
  };

  // Listen for completion events from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://imaginative-figolla-9cbf50.netlify.app") {
        return;
      }

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
        onClick={() => dispatch(setCurrentScreen("build-teams"))}
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