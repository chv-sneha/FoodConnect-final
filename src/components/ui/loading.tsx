import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-green-200 border-t-primary',
        sizeClasses[size]
      )} />
      {text && <p className="text-sm text-primary">{text}</p>}
    </div>
  );
}

export function LoadingOverlay({ children, isLoading, text }: {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 to-blue-50/90 backdrop-blur-sm flex items-center justify-center z-50">
          <Loading size="lg" text={text} />
        </div>
      )}
    </div>
  );
}