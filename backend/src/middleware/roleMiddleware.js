/**
 * Role-Based Access Control Middleware.
 * Allows access only to specified roles (e.g. 'admin', 'placed_graduate', 'final_year', etc.)
 */
const requireRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required to access this resource.'
            });
        }

        const userRole = req.user.role;

        // Admin has access to everything
        if (userRole === 'admin') {
            return next();
        }

        if (allowedRoles.includes(userRole)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${userRole}`
        });
    };
};

module.exports = {
    requireRoles,
    requireAdmin: requireRoles('admin'),
    requireSeniorOrPlaced: requireRoles('third_year', 'final_year', 'placed_graduate')
};
