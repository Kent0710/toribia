interface TextProps {
    children: React.ReactNode;
    className? : string;
}

export const Title : React.FC<TextProps> = ({
    children,
    className,
}) => {
    return (
        <h1 className={`text-xl font-bold ${className}`}>
            {children}
        </h1>
    )
}

export const Subtitle : React.FC<TextProps> = ({
    children,
    className,
}) => { 
    return (
        <h2 className={`text-lg font-semibold ${className}`}>
            {children}
        </h2>
    )
}

export const Description : React.FC<TextProps> = ({
    children,
    className,
}) => {
    return (
        <p className={`text-neutral-500 ${className}`}>
            {children}
        </p>
    )
}