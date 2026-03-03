module.exports = {
    plugins: {
        // For Tailwind v4, you ONLY need to include the main plugin.
        // It handles nesting and everything else internally.
        '@tailwindcss/postcss': {},

        // Autoprefixer is still recommended for browser compatibility.
        autoprefixer: {}
    }
};
