import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Camera, Upload, Building2, ArrowRight, Sparkles, AlertCircle, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ScannerLandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [processing, setProcessing] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const qrRegionId = 'html5qr-code-full-region';

  // Helper to extract Org ID from decoded QR string
  const processDecodedResult = (decodedText: string) => {
    try {
      setProcessing(true);
      let targetOrgId = '';

      // Pattern 1: Full URL e.g. http://localhost:5174/visitor/form/1 or http://.../org/1
      const urlMatches = decodedText.match(/(?:form|org|visitor\/form)\/([a-zA-Z0-9_-]+)/i);
      if (urlMatches && urlMatches[1]) {
        targetOrgId = urlMatches[1];
      } else if (decodedText.trim().startsWith('{')) {
        // Pattern 2: JSON payload { "orgId": 1 }
        const parsed = JSON.parse(decodedText);
        targetOrgId = parsed.orgId || parsed.id || parsed.code || '';
      } else {
        // Pattern 3: Direct Org ID or Code
        targetOrgId = decodedText.trim();
      }

      if (!targetOrgId) {
        setScanError('Could not recognize Organisation QR Code. Please try scanning again.');
        setProcessing(false);
        return;
      }

      // Stop camera if active
      stopCamera();

      // Navigate to Visitor Form
      navigate(`/visitor/form/${targetOrgId}`);
    } catch (err) {
      console.error('QR parsing error:', err);
      setScanError('Invalid QR Code format. Please scan a valid DigiGate QR code.');
      setProcessing(false);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setScanError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          processDecodedResult(decodedText);
        },
        () => {
          // Ignore transient scan failures
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setScanError(err?.message || 'Unable to access camera. Please allow camera permissions or upload a QR image.');
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        // Ignore stop error
      }
      setCameraActive(false);
    }
  };

  // Handle Tab Switch
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // Handle File Upload Decode
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);
    setProcessing(true);

    try {
      const html5QrCode = new Html5Qrcode('file-qr-temp-region');
      const decodedText = await html5QrCode.scanFile(file, true);
      processDecodedResult(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      setScanError('Could not find or read QR code in this image. Please upload a clear QR code image.');
      setProcessing(false);
    }
  };

  // Handle Manual Code Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processDecodedResult(manualCode.trim());
  };

  return (
    <div className="min-h-screen py-6 px-4 bg-[#F4F7F6] flex flex-col justify-between items-center selection:bg-[#035352] selection:text-white">
      <div className="w-full max-w-md mx-auto space-y-5">
        {/* Branding Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#035352] text-[#F3E8BC] flex items-center justify-center mx-auto shadow-xl shadow-[#035352]/20 border border-[#035352] animate-in zoom-in duration-300">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#172525] tracking-tight">
              DIGI-GATE
            </h1>
            <p className="text-[11px] font-extrabold text-[#035352] uppercase tracking-wider">
              Smart Kiosk & Visitor Check-In Portal
            </p>
          </div>
        </div>

        {/* Hero Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-[#035352]/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Tab Navigation Bar */}
          <div className="flex border-b border-slate-100 bg-slate-50/80 p-1.5 gap-1">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-3 px-2 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'camera'
                  ? 'bg-white text-[#035352] shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-[#035352]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Scan QR</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-3 px-2 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-[#035352] shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-[#035352]'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 px-2 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-[#035352] shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-[#035352]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Code</span>
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            {/* Error Alert Banner */}
            {scanError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{scanError}</span>
              </div>
            )}

            {/* TAB 1: Live Camera Scanner */}
            {activeTab === 'camera' && (
              <div className="space-y-4 text-center">
                <p className="text-xs font-bold text-slate-600">
                  Align Organisation QR Code inside frame to check in
                </p>

                <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-[#035352] min-h-[260px] flex items-center justify-center shadow-inner group">
                  <div id={qrRegionId} className="w-full h-full" />

                  {/* Laser Beam Scanner Effect Overlay */}
                  {cameraActive && !processing && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <div className="w-[210px] h-[210px] border-2 border-emerald-400/40 rounded-2xl relative">
                        {/* Target Reticle Corners */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#F3E8BC] rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#F3E8BC] rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#F3E8BC] rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#F3E8BC] rounded-br-lg" />
                      </div>
                    </div>
                  )}

                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/90 text-white p-6">
                      <QrCode className="w-12 h-12 text-[#F3E8BC] animate-pulse" />
                      <p className="text-xs font-bold text-slate-300">Camera preview starting...</p>
                      <button
                        onClick={startCamera}
                        className="px-5 py-2.5 rounded-xl bg-[#035352] text-white font-bold text-xs hover:bg-[#023e3d] shadow-md shadow-[#035352]/30 transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Enable Camera Scanner</span>
                      </button>
                    </div>
                  )}

                  {processing && (
                    <div className="absolute inset-0 bg-[#035352]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white animate-in fade-in">
                      <div className="w-9 h-9 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-black uppercase tracking-wider text-[#F3E8BC]">Opening Check-In Form...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Upload Image */}
            {activeTab === 'upload' && (
              <div className="space-y-4 text-center">
                <div id="file-qr-temp-region" className="hidden" />
                <p className="text-xs font-bold text-slate-600">
                  Select a saved QR Code image from your gallery
                </p>

                <label className="block p-8 rounded-3xl border-2 border-dashed border-[#035352]/30 bg-slate-50 hover:bg-[#035352]/5 cursor-pointer transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-[#035352]/10 text-[#035352] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#172525]">Upload QR Image File</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Supports PNG, JPG, WEBP formats</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {processing && (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#035352] p-2">
                    <div className="w-4 h-4 border-2 border-[#035352] border-t-transparent rounded-full animate-spin" />
                    <span>Decoding QR Image...</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Enter Code / ID */}
            {activeTab === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <p className="text-xs font-bold text-slate-600">
                  Enter Organisation Code or ID to access visitor check-in
                </p>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Organisation ID / Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 or ZORDIAL"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 outline-none font-bold text-xs text-slate-800 focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20 transition-all shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing || !manualCode.trim()}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-wider"
                >
                  <span>Go to Visitor Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Kiosk Links */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-slate-200/70 text-center shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#035352]" />
            <span>Instant Self Clearance & Touchless Check-In</span>
          </p>
        </div>
      </div>

      <div className="py-2 text-center text-[11px] font-semibold text-slate-400">
        Powered by DIGI-GATE Gate Pass System
      </div>
    </div>
  );
}
