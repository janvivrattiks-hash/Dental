import { Box, Typography, Stack, LinearProgress } from '@mui/material';
import { keyframes } from '@mui/system';
import { useState, useEffect } from 'react';

// Animations
const rotate3D = keyframes`
  0% { transform: rotateY(0deg) rotateX(0deg); }
  50% { transform: rotateY(180deg) rotateX(10deg); }
  100% { transform: rotateY(360deg) rotateX(0deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const scanLine = keyframes`
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Lock body scroll while the full-screen overlay is shown.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const steps = [
    { label: 'Uploading mesh files', icon: '📤' },
    { label: 'Analyzing geometry structure', icon: '🔍' },
    { label: 'Detecting alignment points', icon: '🎯' },
    { label: 'Computing transformations', icon: '⚙️' },
    { label: 'Optimizing precision', icon: '✨' },
    { label: 'Finalizing results', icon: '🎉' },
  ];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 200);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [steps.length]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Animated background grid */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(33, 150, 243, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33, 150, 243, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3,
          animation: `${pulse} 4s ease-in-out infinite`,
        }}
      />

      {/* Gradient orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(156, 39, 176, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: `${float} 8s ease-in-out infinite`,
          animationDelay: '1s',
        }}
      />

      <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1, maxWidth: 600, px: 3 }}>
        {/* 3D Mesh Visualization */}
        <Box
          sx={{
            position: 'relative',
            width: 200,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Central 3D cube representing mesh */}
          <Box
            sx={{
              width: 100,
              height: 100,
              position: 'relative',
              transformStyle: 'preserve-3d',
              animation: `${rotate3D} 4s linear infinite`,
            }}
          >
            {/* Cube faces */}
            {[
              { transform: 'rotateY(0deg) translateZ(50px)', bg: 'rgba(33, 150, 243, 0.3)' },
              { transform: 'rotateY(90deg) translateZ(50px)', bg: 'rgba(33, 150, 243, 0.25)' },
              { transform: 'rotateY(180deg) translateZ(50px)', bg: 'rgba(33, 150, 243, 0.2)' },
              { transform: 'rotateY(-90deg) translateZ(50px)', bg: 'rgba(33, 150, 243, 0.25)' },
              { transform: 'rotateX(90deg) translateZ(50px)', bg: 'rgba(156, 39, 176, 0.3)' },
              { transform: 'rotateX(-90deg) translateZ(50px)', bg: 'rgba(156, 39, 176, 0.3)' },
            ].map((face, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 100,
                  height: 100,
                  border: '2px solid rgba(33, 150, 243, 0.6)',
                  transform: face.transform,
                  background: face.bg,
                  backdropFilter: 'blur(5px)',
                  boxShadow: 'inset 0 0 20px rgba(33, 150, 243, 0.3)',
                }}
              />
            ))}
          </Box>

          {/* Orbiting particles representing alignment points */}
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #64B5F6, #2196F3)',
                boxShadow: '0 0 20px rgba(33, 150, 243, 0.8)',
                animation: `${orbit} ${3 + i}s linear infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}

          {/* Scanning line effect */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.8), transparent)',
              boxShadow: '0 0 20px rgba(33, 150, 243, 0.6)',
              animation: `${scanLine} 3s ease-in-out infinite`,
            }}
          />
        </Box>

        {/* Title with shimmer effect */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(90deg, #64B5F6 0%, #2196F3 25%, #9C27B0 50%, #2196F3 75%, #64B5F6 100%)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${shimmer} 3s linear infinite`,
              mb: 1,
            }}
          >
            Aligning Your Dental Meshes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced 3D analysis in progress...
          </Typography>
        </Box>

        {/* Current step indicator */}
        <Box
          sx={{
            minHeight: 80,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                fontSize: '2.5rem',
                animation: `${pulse} 1.5s ease-in-out infinite`,
              }}
            >
              {steps[currentStep].icon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {steps[currentStep].label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Step {currentStep + 1} of {steps.length}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Progress bar */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #2196F3 0%, #9C27B0 100%)',
                boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
              },
            }}
          />
        </Box>

        {/* Processing dots */}
        <Stack direction="row" spacing={1.5}>
          {[0, 1, 2, 3, 4].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: `${pulse} 1.5s ease-in-out infinite`,
                animationDelay: `${dot * 0.2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </Stack>

        {/* Technical info */}
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            fontFamily: 'monospace',
            textAlign: 'center',
            opacity: 0.5,
          }}
        >
          AI Model Inference • Mesh Optimization • Real-time Processing
        </Typography>
      </Stack>
    </Box>
  );
}
