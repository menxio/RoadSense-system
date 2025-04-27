
const RaspiCamViewer = () => {
  return (
  	<div>
      <iframe
        src="http://172.20.10.3:8889/cam" 
        style={{ width: "100%", height: "100vh", border: "none", borderRadius: "8px" }}
        allow="camera; microphone; fullscreen"
        title="Raspberry Pi Live Stream"
      />
    </div>
  );
};

export default RaspiCamViewer;
