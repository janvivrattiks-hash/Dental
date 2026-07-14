import { Box, Typography, Stack, Container, Grid, Paper } from '@mui/material';

// Trimmed to just the "How It Works" steps — the branded hero (badge, title,
// subtitle) and the feature cards (High Precision / Lightning Fast / …) were
// removed per the employee-panel integration.
export default function HeroSection() {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Process Steps */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 700, mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            How It Works
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2 }} sx={{ justifyContent: 'center' }}>
            {[
              { step: '1', text: 'Upload your denture scan and scan body library' },
              { step: '2', text: 'Our AI analyzes and aligns the meshes' },
              { step: '3', text: 'View results in interactive 3D viewer' },
              { step: '4', text: 'Download aligned models and reports' },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2196F3 0%, #9C27B0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {item.text}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
