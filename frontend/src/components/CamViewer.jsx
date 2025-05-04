import { useEffect, useState } from "react";
import Header from "./organisms/Header";
import Sidebar from "./organisms/Sidebar";

const RaspiCamViewer = () => {
  const [collapsed, setCollapsed] = useState(false);
  const drawerWidth = collapsed ? 70 : 240;

  useEffect(()=>{
    console.log(collapsed)
  }, [collapsed])
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            width: `${drawerWidth}px`,
            transition: "width 0.3s ease",
            height: "100%",
          }}
        >
          <Sidebar collapsedProp={collapsed} setCollapsedProp={setCollapsed} />
        </div>
        <iframe
          src={`${import.meta.env.VITE_RTSP_STREAM_ADDRESS}/cam`}
          style={{
            flex: 1,
            height: "100%",
            border: "none",
            borderRadius: "8px",
          }}
          allow="microphone; fullscreen"
          title="Raspberry Pi Live Stream"
          seamless
        />
      </div>
    </div>
  );
};

export default RaspiCamViewer;
