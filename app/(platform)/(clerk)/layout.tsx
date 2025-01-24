const AuthLayout = ({ children } : {
    children: React.ReactNode 
}) => {
    return(
        <div className="h-full flex items-center justify-center bg-gradient-to-t from-blue-def to-baseLight">{children}</div>
    );
};

export default AuthLayout;