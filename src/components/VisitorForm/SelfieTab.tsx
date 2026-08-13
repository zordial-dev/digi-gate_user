import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { selfieStore } from '@/utils/selfieStore';
import { Camera, RotateCcw } from 'lucide-react';

export default function SelfieTab() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Cleanup function for camera
  const stopCamera = () => {
    console.log('Stopping camera...');
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
      // If already have stream and it's active, don't restart
      if (streamRef.current && streamRef.current.active) {
        return;
      }

      // Stop any existing tracks first
      stopCamera();

      console.log('Starting camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 300, height: 300 },
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsCameraReady(true);
        console.log('Camera started successfully');
      }
    } catch (error) {
      console.error('Camera error:', error);
      dispatch(actions.setMsg({ type: 'error', text: 'Camera access denied' }));
    }
  };

  // Handle camera based on selfie state
  useEffect(() => {
    if (state.selfiePreview) {
      // Selfie exists - stop camera IMMEDIATELY
      console.log('Selfie detected, stopping camera...');
      stopCamera();
    } else {
      // No selfie - start camera
      startCamera();
    }

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [state.selfiePreview]);

  // Handle component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      stopCamera();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      stopCamera();
    };
  }, []);

  const captureSelfie = () => {
    console.log('Capturing selfie...');
    if (videoRef.current && canvasRef.current && streamRef.current && streamRef.current.active) {
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 300);
        canvas.toBlob((blob) => {
          if (blob) {
            // Store file
            selfieStore.file = new File(
              [blob],
              `selfie_${Date.now()}.jpg`,
              { type: 'image/jpeg' }
            );
            // Store preview
            dispatch(actions.setSelfiePreview(URL.createObjectURL(blob)));
            dispatch(actions.setMsg({ type: 'success', text: 'Selfie captured!' }));
            // IMMEDIATELY stop camera after capture
            stopCamera();
            console.log('Camera stopped after capture');
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleRetake = () => {
    console.log('Retaking selfie...');
    // Clear selfie data
    selfieStore.file = null;
    dispatch(actions.setSelfiePreview(null));
    dispatch(actions.setMsg(null));
    // Camera will restart via useEffect when selfiePreview becomes null
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#eff6ff' }}
        >
          <Camera size={18} style={{ color: '#2563eb' }} />
        </div>
        <h3 className="font-bold text-lg" style={{ color: '#0f172a' }}>
          Visitor Selfie Photo
        </h3>
      </div>

      {/* Only show instruction text when no selfie */}
      {!state.selfiePreview && (
        <p className="text-center text-xs" style={{ color: '#64748b' }}>
          Position your face in the camera frame and click Capture Selfie
        </p>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {!state.selfiePreview ? (
        <div className="space-y-4">
          <div 
            className="relative rounded-xl overflow-hidden bg-black aspect-square"
            style={{
              border: '2px solid #021767'
            }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-sm font-medium">Starting camera...</div>
              </div>
            )}
            {/* Camera frame overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-white/30 rounded-xl" />
          </div>
          
          <button
            onClick={captureSelfie}
            disabled={!isCameraReady}
            className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)',
              boxShadow: '0 6px 18px rgba(2, 29, 91, 0.2)',
              border: '1px solid #021767'
            }}
            onMouseEnter={(e) => {
              if (isCameraReady) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #06216B 0%, #021D5B 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (isCameraReady) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)';
              }
            }}
          >
            <Camera size={18} className="inline mr-2" />
            Capture Selfie
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="relative inline-block">
            <img
              src={state.selfiePreview}
              alt="Selfie"
              className="w-32 h-32 rounded-full mx-auto object-cover"
              style={{
                border: '4px solid #22c55e',
                boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.2)'
              }}
            />
            <div 
              className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#22c55e' }}
            >
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          <p className="text-sm mt-2 font-semibold" style={{ color: '#15803d' }}>
            Selfie captured successfully!
          </p>
          <button
            onClick={handleRetake}
            className="mt-4 px-6 py-2 rounded-xl font-semibold transition-all"
            style={{
              border: '1px solid #021767',
              color: '#3F5885',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(6, 33, 107, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <RotateCcw size={16} className="inline mr-2" />
            Retake Selfie
          </button>
        </div>
      )}
    </div>
  );
}

