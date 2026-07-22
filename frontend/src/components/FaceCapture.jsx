import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

const FaceCapture = ({ onCapture, requiredShots = 5 }) => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState("Loading face detection models…");
  const [captured, setCaptured] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setStatus("Models loaded. Starting camera…");
      } catch (err) {
        setError("Failed to load face detection models.");
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus("Position your face inside the frame.");
        }
      } catch (err) {
        setError("Could not access the camera. Please allow camera permission.");
      }
    };
    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [modelsLoaded]);

  const handleCaptureShot = async () => {
    if (!videoRef.current) return;
    setStatus("Detecting face…");

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus("No face detected. Try again with better lighting.");
      return;
    }

    const descriptor = Array.from(detection.descriptor);
    const updated = [...captured, descriptor];
    setCaptured(updated);

    if (updated.length >= requiredShots) {
      const avgDescriptor = descriptor.map(
        (_, i) => updated.reduce((sum, d) => sum + d[i], 0) / updated.length
      );
      setStatus("Capture complete!");
      onCapture(avgDescriptor);
    } else {
      setStatus(`Captured ${updated.length} of ${requiredShots}. Move slightly and capture again.`);
    }
  };

  return (
    <div>
      <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-3">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover -scale-x-100"
        />
      </div>

      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: requiredShots }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${
              i < captured.length ? "bg-green-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-3">{error || status}</p>

      <button
        type="button"
        onClick={handleCaptureShot}
        disabled={!modelsLoaded || captured.length >= requiredShots}
        className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors disabled:opacity-60"
      >
        {captured.length >= requiredShots
          ? "Done"
          : `Capture Shot ${captured.length + 1} of ${requiredShots}`}
      </button>
    </div>
  );
};

export default FaceCapture;