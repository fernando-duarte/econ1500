/**
 * Centralized coverage thresholds configuration
 *
 * These thresholds are initially set conservatively to establish a baseline.
 * They should be gradually increased as coverage improves.
 */
module.exports = {
    // Global thresholds applied to the entire codebase
    global: {
        lines: 60, // Starting with a moderate target
        functions: 50, // Functions can be harder to cover fully
        branches: 40, // Branch coverage is typically the most challenging
        statements: 60, // Similar to line coverage
    },

    // Directory-specific thresholds for critical paths
    // These can be more stringent for core functionality
    critical: {
        // Auth flows are critical and should have higher coverage
        "lib/auth": {
            lines: 80,
            functions: 70,
            branches: 60,
            statements: 80,
        },

        // Socket functionality is critical for real-time features
        "lib/socket": {
            lines: 75,
            functions: 70,
            branches: 50,
            statements: 75,
        },

        // Other critical modules can be added here
        // "components/ui": { ... }
    },
}; 