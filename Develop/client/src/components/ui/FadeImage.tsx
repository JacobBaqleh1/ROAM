import { useState } from 'react';
import { Mountain } from 'lucide-react';

interface FadeImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
}

export default function FadeImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackLabel,
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center gap-2`}>
        <Mountain size={32} className="text-emerald-300" />
        {fallbackLabel && (
          <span className="text-xs text-emerald-400 font-medium tracking-wide">{fallbackLabel}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
}
