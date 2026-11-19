import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  PhoneOff,
  Activity,
  Heart,
  MessageSquare,
  FileSignature,
  Edit3,
  User,
  ShieldCheck,
  Send
} from 'lucide-react';

export const TelemedicineSuite: React.FC = () => {
  const { telemedicineSessions, patients, doctors, setActiveTab, addNotification } = useHospital();
  const session = telemedicineSessions[0];

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Dr. Aisha Patel: 'Hello Samuel! Reviewing your post-dialysis cross-match results now.'",
    "Samuel Osei: 'Thank you doctor, fluid retention has been minimal this week.'",
  ]);
  const [chatInput, setChatInput] = useState('');
  const [whiteboardText, setWhiteboardText] = useState('Fluid Restriction: 1.2 L / day | Dry Weight Target: 74.0 kg');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, `You: ${chatInput}`]);
    setChatInput('');
  };

  const handleEndCall = () => {
    addNotification('info', 'Virtual Consultation Ended', 'Call terminated. Clinical summary and billing invoice generated.');
    setActiveTab('core-prescription');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-purple-100 p-2 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Telemedicine Virtual Consultation Suite</h1>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                Advanced Feature #10
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              WebRTC encrypted peer-to-peer virtual exam room with integrated real-time EHR telemetry, interactive whiteboard, and instant E-Rx dispatch.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Virtual Exam Video Viewport & Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-950 shadow-2xl flex flex-col justify-between p-5 border border-slate-800">
            {/* Top Overlay: Session Meta & Encryption */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 rounded-xl bg-black/50 px-3 py-1.5 backdrop-blur-md text-white text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold">{session.patientName}</span>
                <span className="opacity-60">• Room: {session.roomId}</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl bg-black/50 px-3 py-1.5 backdrop-blur-md text-teal-400 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>256-Bit E2E Encrypted</span>
              </div>
            </div>

            {/* Video Canvas (Simulated high-definition feeds) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOn ? (
                <div className="relative h-full w-full">
                  {/* Remote Patient Video Feed */}
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200"
                    alt="Patient Video"
                    className="h-full w-full object-cover opacity-85"
                  />

                  {/* Picture-in-Picture Doctor Self-View */}
                  <div className="absolute bottom-20 right-6 h-32 w-44 rounded-2xl border-2 border-white/20 bg-slate-900 shadow-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=350"
                      alt="Doctor View"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-1 left-2 text-[10px] text-white font-bold bg-black/60 px-1.5 rounded">
                      Dr. Aisha Patel (You)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <VideoOff className="h-12 w-12" />
                  <span className="mt-2 text-xs font-semibold">Camera is muted</span>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`rounded-2xl p-3 shadow-lg transition-all ${
                  isMicOn ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md' : 'bg-red-600 text-white'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`rounded-2xl p-3 shadow-lg transition-all ${
                  isVideoOn ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md' : 'bg-red-600 text-white'
                }`}
                title={isVideoOn ? 'Stop Video' : 'Start Video'}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsSharingScreen(!isSharingScreen)}
                className={`rounded-2xl p-3 shadow-lg transition-all ${
                  isSharingScreen ? 'bg-teal-600 text-white' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                }`}
                title="Screen Share Diagnostic Scans"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                onClick={handleEndCall}
                className="rounded-2xl bg-red-600 px-5 py-3 text-white shadow-lg shadow-red-600/40 hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold"
              >
                <PhoneOff className="h-5 w-5" />
                <span>End Call & Sign Notes</span>
              </button>
            </div>
          </div>

          {/* Interactive Educational Clinical Whiteboard */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-purple-600" />
                Shared Clinical Exam Whiteboard (Visible to Patient)
              </span>
              <span className="text-[10px] text-slate-400">Real-time sync</span>
            </div>

            <textarea
              rows={2}
              value={whiteboardText}
              onChange={(e) => setWhiteboardText(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Right Column: Live Vitals Telemetry Sidebar & Consultation Chat */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Biometric Telemetry */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-rose-600 animate-pulse" />
              Live Patient Telemetry Tele-Stream
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Heart Rate</span>
                <div className="text-lg font-black text-rose-600">{session.liveVitalsTelemetry.heartRate} bpm</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Oxygen (SpO2)</span>
                <div className="text-lg font-black text-emerald-600">{session.liveVitalsTelemetry.spO2}%</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Blood Pressure</span>
                <div className="text-lg font-black text-slate-900 dark:text-white">{session.liveVitalsTelemetry.bloodPressure}</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Respiratory Rate</span>
                <div className="text-lg font-black text-slate-900 dark:text-white">{session.liveVitalsTelemetry.respiratoryRate}/min</div>
              </div>
            </div>
          </div>

          {/* Secure In-Call Chat */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-[340px]">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                HIPAA-Compliant Consultation Chat
              </span>

              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto text-xs pr-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="rounded-xl bg-slate-50 p-2 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                    {msg}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to patient..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                type="submit"
                className="rounded-xl bg-teal-600 px-3 py-1.5 text-white hover:bg-teal-700"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
