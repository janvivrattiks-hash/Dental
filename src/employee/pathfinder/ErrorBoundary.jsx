import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in 3D Viewer:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ margin: 2 }}>
          <AlertTitle>3D Viewer Error</AlertTitle>
          There was a problem rendering the mesh. This can happen if the file is corrupt or the format is not supported correctly.
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
            {this.state.error?.message}
          </pre>
        </Alert>
      );
    }

    return this.props.children;
  }
}
