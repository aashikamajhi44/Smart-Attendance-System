import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import faceService from "../../services/faceService";
import attendanceService from "../../services/attendanceService";

const MODEL_URL = "/models";
const MATCH_THRESHOLD = 0.45;
const SCAN_INTERVAL_MS = 2000;

const LiveRecognition = () => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState("Loading face detection models…");
  const [sessionOn, setSessionOn] = useState(false);
  const [markedLog, setMarkedLog] = useState([]);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);
  const markedTodayRef = useRef(new Set());

  // Load models + known face profiles once
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        const data = await faceService.getAllFaceProfiles();
        setProfiles(data);
        setModelsLoaded(true);
        setStatus(
          data.length === 0
            ? "No enrolled face profiles found. Add students with face capture first."
            : `Ready. ${data.length} student(s) enrolled.`
        );
      } catch (err) {
        setError("Failed to load models or face profiles.");
      }
    };
    init();
  }, []);

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setSessionOn(true);
      setStatus("Scanning for faces…");

      intervalRef.current = setInterval(scanFrame, SCAN_INTERVAL_MS);
    } catch (err) {
      setError("Could not access the camera.");
    }
  };

  const stopSession = () => {
    clearInterval(intervalRef.current);
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setSessionOn(false);
    setStatus("Session stopped.");
  };

  const scanFrame = async () => {
    if (!videoRef.current || profiles.length === 0) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return;

    // Find closest match among enrolled profiles
    let best = null;
    let bestDistance = Infinity;

    profiles.forEach((p) => {
      const distance = faceapi.euclideanDistance(detection.descriptor, p.descriptor);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = p;
      }
    });

    if (!best || bestDistance > MATCH_THRESHOLD) {
      setStatus(`Unknown face (distance ${bestDistance.toFixed(2)}) — no match.`);
      return;
    }

    const confidence = (1 - bestDistance) * 100;

    // Avoid spamming the same student repeatedly within this session
    if (markedTodayRef.current.has(best.studentId)) {
      setStatus(`${best.name} already marked this session.`);
      return;
    }

    try {
      const result = await attendanceService.markAttendance({
        studentId: best.studentId,
        confidenceScore: 1 - bestDistance,
      });
      markedTodayRef.current.add(best.studentId);
      setMarkedLog((prev) => [
        {
          name: best.name,
          studentCode: best.studentCode,
          confidence: confidence.toFixed(1),
          time: new Date().toLocaleTimeString(),
          alreadyMarked: result.message?.includes("already"),
        },
        ...prev,
      ]);
      setStatus(`Matched: ${best.name} (${confidence.toFixed(1)}%)`);
    } catch (err) {
      setStatus("Failed to record attendance.");
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold text-gray-900 mb-1">Live Recognition</h1>
      <p className="text-sm text-gray-500 mb-5">
        Start a session to detect and mark attendance from the camera.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
          <div className="flex items-center gap-3">
            {!sessionOn ? (
              <button
                onClick={startSession}
                disabled={!modelsLoaded}
                className="bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
              >
                ▶ Start Session
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                ■ Stop Session
              </button>
            )}
            <span className="text-sm text-gray-500">{error || status}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Marked This Session</h3>
            <span className="text-[11px] font-mono text-gray-400">threshold ≤ {MATCH_THRESHOLD}</span>
          </div>
          <div className="p-3 max-h-96 overflow-y-auto">
            {markedLog.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                No one marked yet.
              </p>
            ) : (
              markedLog.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-lg mb-2"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                    {m.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{m.name}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      {m.studentCode} · {m.time} {m.alreadyMarked ? "(already marked today)" : ""}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-green-700">
                    {m.confidence}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRecognition;