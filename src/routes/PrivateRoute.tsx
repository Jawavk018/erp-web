// src/components/PrivateRoute.tsx
// import React from 'react';
// import { Route, Navigate, Outlet } from 'react-router-dom';

// interface PrivateRouteProps {
//     isAuthenticated: boolean;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
//     return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;



import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    isAuthenticated: boolean;
    isHovered: boolean;
    setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, isHovered, setIsHovered }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        console.log('isAuthenticated Routers:', isAuthenticated);
    }, [isAuthenticated]);

    return (
        <div className="flex h-screen">
            {/* <SidebarMenu isHovered={isHovered} setIsHovered={setIsHovered} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <ElegantHeader paths={[]} isHovered={isHovered} />
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div> */}
        </div>
    );
};

export default PrivateRoute;
