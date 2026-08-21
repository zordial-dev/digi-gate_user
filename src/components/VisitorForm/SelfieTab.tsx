import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { selfieStore } from '@/utils/selfieStore';
import { Camera, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SelfieTab() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Cleanup function for camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
      setIsCameraReady(false);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      if (streamRef.current && streamRef.current.active) {
        return;
      }
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 320 },
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      dispatch(actions.setMsg({ type: 'error', text: 'Camera access denied. Please allow camera permissions.' }));
    }
  };

  useEffect(() => {
    if (state.selfiePreview) {
      stopCamera();
    } else {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [state.selfiePreview]);

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current && streamRef.current && streamRef.current.active) {
      const canvas = canvasRef.current;
      canvas.width = 320;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 320);
        canvas.toBlob((blob) => {
          if (blob) {
            selfieStore.file = new File(
              [blob],
              `selfie_${Date.now()}.jpg`,
              { type: 'image/jpeg' }
            );
            dispatch(actions.setSelfiePreview(URL.createObjectURL(blob)));
            dispatch(actions.setMsg({ type: 'success', text: 'Selfie photo captured successfully!' }));
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleRetake = () => {
    selfieStore.file = null;
    dispatch(actions.setSelfiePreview(null));
    dispatch(actions.setMsg(null));
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-[#035352]/10 text-[#035352] flex items-center justify-center font-bold">
          <Camera className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#172525]">
            Visitor Identity Photo
          </h3>
          <p className="text-[11px] font-medium text-slate-500">Capture a clear selfie photo for your gate entry pass</p>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {!state.selfiePreview ? (
        <div className="space-y-4 text-center">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-square max-w-[280px] mx-auto border-4 border-[#035352] shadow-2xl">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />

            {/* Oval Face Alignment Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-60 border-2 border-dashed border-[#F3E8BC] rounded-[50%] opacity-80 shadow-inner" />
            </div>

            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 text-white text-xs font-bold">
                Starting selfie camera...
              </div>
            )}
          </div>

          <button
            onClick={captureSelfie}
            disabled={!isCameraReady}
            className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Selfie Photo</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-4 space-y-4">
          <div className="relative inline-block">
            <img
              src={state.selfiePreview}
              alt="Selfie preview"
              className="w-36 h-36 rounded-full mx-auto object-cover border-4 border-emerald-500 shadow-xl shadow-emerald-500/20"
            />
            <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Selfie Captured & Verified</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Ready to complete your visitor gate registration</p>
          </div>

          <button
            onClick={handleRetake}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Retake Photo</span>
          </button>
        </div>
      )}
    </div>
  );
}
