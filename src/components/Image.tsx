import React from 'react';

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string;
    alt: string;
    className?: string;
};

const Image: React.FC<ImageProps> = ({ src, alt, className, ...props }) => (
    <div className={className}>
        <picture>
            <source srcSet={`${src}.avif`} type="image/avif" />
            <source srcSet={`${src}.webp`} type="image/webp" />
            <img src={`${src}.png`} alt={alt} loading="lazy" />
        </picture>
    </div>
);

export default Image;