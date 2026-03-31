/**
 * ErrorBoundary component
 *
 * Class component that catches unhandled React render errors
 * and displays a user-friendly fallback screen.
 *
 * Logs errors to console (Sentry hook point for later).
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radii } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export interface ErrorBoundaryProps {
  /** Children to render when there is no error */
  children: ReactNode;
  /** Optional fallback UI to render instead of the default error screen */
  fallback?: ReactNode;
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console (replace with Sentry.captureException later)
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="error_outline" size={48} color={colors.error} />
          </View>

          <Text style={styles.heading}>Something went wrong</Text>

          <Text style={styles.description}>
            An unexpected error occurred. Please try again or restart the app if
            the problem persists.
          </Text>

          {__DEV__ && this.state.error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugText} numberOfLines={6}>
                {this.state.error.message}
              </Text>
            </View>
          )}

          <Button
            label="Try Again"
            variant="primary"
            icon="refresh"
            onPress={this.handleReset}
            style={styles.button}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  heading: {
    ...typography.headlineSm,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing[8],
    lineHeight: 22,
  },
  debugContainer: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.md,
    padding: spacing[3],
    marginBottom: spacing[6],
    width: '100%',
  },
  debugText: {
    ...typography.bodySm,
    color: colors.error,
    fontFamily: 'monospace',
  },
  button: {
    minWidth: 160,
  },
});
