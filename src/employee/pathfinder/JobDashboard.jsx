import { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Stack, Fade, Grow } from '@mui/material';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const wave = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
`;

export default function JobDashboard({ events }) {
  const doneEvent = useMemo(() => {
    const safeEvents = Array.isArray(events) ? events : [];
    return safeEvents.find(e => e.type === 'done');
  }, [events]);

  const safeEvents = Array.isArray(events) ? events : [];
  const progress = safeEvents.filter(e => e.type === 'status').length;

  // Fun messages for different stages
  const getPlayfulMessage = () => {
    if (doneEvent) return '✨ Analysis Complete!';
    if (progress >= 4) return '🔍 Finalizing alignment matches...';
    if (progress >= 3) return '🎯 Refining precision alignment...';
    if (progress >= 2) return '🧮 Analyzing mesh geometry...';
    if (progress >= 1) return '🚀 Processing your meshes...';
    return '⚡ Initializing analysis...';
  };

  if (doneEvent && doneEvent.status === 'completed') {
    return null;
  }

  return (
    <Fade in timeout={500}>
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(156, 39, 176, 0.08) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={{ xs: 3, sm: 4 }} alignItems="center">
            {/* Animated loader circles */}
            <Box sx={{ position: 'relative', width: { xs: 100, sm: 120 }, height: { xs: 100, sm: 120 } }}>
              {/* Outer rotating circle */}
              <Box
                sx={{
                  position: 'absolute',
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                  borderRadius: '50%',
                  border: { xs: '3px solid', sm: '4px solid' },
                  borderColor: 'primary.main',
                  borderTopColor: 'transparent',
                  animation: `${rotate} 1.5s linear infinite`,
                }}
              />
              {/* Middle pulsing circle */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 12, sm: 15 },
                  left: { xs: 12, sm: 15 },
                  width: { xs: 76, sm: 90 },
                  height: { xs: 76, sm: 90 },
                  borderRadius: '50%',
                  bgcolor: 'primary.dark',
                  animation: `${pulse} 2s ease-in-out infinite`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Inner bouncing tooth icon */}
                <Typography
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3rem' },
                    animation: `${bounce} 1s ease-in-out infinite`,
                  }}
                >
                  🦷
                </Typography>
              </Box>
            </Box>

            {/* Message */}
            <Grow in timeout={800}>
              <Box sx={{ textAlign: 'center', px: { xs: 2, sm: 0 } }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `${wave} 3s ease-in-out infinite`,
                  }}
                >
                  {getPlayfulMessage()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  This usually takes just a few moments
                </Typography>
              </Box>
            </Grow>

            {/* Progress dots */}
            <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }}>
              {[1, 2, 3, 4].map((dot, index) => (
                <Box
                  key={dot}
                  sx={{
                    width: { xs: 10, sm: 12 },
                    height: { xs: 10, sm: 12 },
                    borderRadius: '50%',
                    bgcolor: progress >= index + 1 ? 'primary.main' : 'action.disabled',
                    transition: 'all 0.5s ease',
                    animation: progress === index + 1 ? `${pulse} 1s ease-in-out infinite` : 'none',
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );
}
