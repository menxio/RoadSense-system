
const RaspiCamViewer = () => {
  return (
  	<div>
      <iframe
        src="http://192.168.1.27:8889/cam" 
        style={{ width: "100%", height: "100vh", border: "none", borderRadius: "8px" }}
        allow="camera; microphone; fullscreen"
        title="Raspberry Pi Live Stream"
      />
    </div>
  );
};

export default RaspiCamViewer;
