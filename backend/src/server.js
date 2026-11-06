const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const aiRoutes = require('./routes/aiRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const techUpdateRoutes = require('./routes/techUpdateRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger in Development
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'TechBridge Backend API',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/tech-updates', techUpdateRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found on TechBridge API server.`
    });
});

// Global Centralized Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 TechBridge Backend API Server is running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`"Connect with experience. Learn with direction. Build your future."`);
    console.log(`======================================================\n`);
});

module.exports = app;

