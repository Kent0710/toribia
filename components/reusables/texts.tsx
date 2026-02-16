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