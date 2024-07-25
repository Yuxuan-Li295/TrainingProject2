import React, { ReactNode, ErrorInfo } from 'react';
import { Result, Button } from 'antd';
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
  navigate?: NavigateFunction;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
  errorInfo: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    this.props.navigate && this.props.navigate('/');
  };

  render() {
    if (this.state.hasError) {
      return (
          <Result
              status="500"
              title="500"
              subTitle="Sorry, something went wrong."
              extra={<Button type="primary" onClick={this.resetError}>Back Home</Button>}
          />
      );
    }

    return this.props.children;
  }
}

export function withNavigation(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

const ErrorBoundaryWrapper = withNavigation(ErrorBoundary);
export default ErrorBoundaryWrapper;