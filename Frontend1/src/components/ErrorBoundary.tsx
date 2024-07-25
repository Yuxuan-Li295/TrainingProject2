import React, { useState, useEffect, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<any>(null);
  const [errorInfo, setErrorInfo] = useState<any>(null);
  const navigate = useNavigate();

  const resetError = () => {
    setHasError(false);
    setError(null);
    setErrorInfo(null);
    navigate('/');
  };

  const ErrorFallback = ({ error, resetError }: { error: any, resetError: () => void }) => {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={resetError}>Back Home</Button>}
      />
    );
  };

  useEffect(() => {
    const originalErrorHandler = console.error;
    console.error = (...args) => {
      setHasError(true);
      setError(args[0]);
      setErrorInfo(args[1]);
      originalErrorHandler(...args);
    };
    return () => {
      console.error = originalErrorHandler;
    };
  }, []);

  if (hasError) {
    return <ErrorFallback error={error} resetError={resetError} />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
