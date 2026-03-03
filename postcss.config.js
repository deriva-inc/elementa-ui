module.exports = {
    plugins: {
        'postcss-url': {
            // Find the asset based on the original src path
            // and copy it to a new directory.
            url: 'copy',
            // The base path to search for assets.
            basePath: 'src',
            // Where to copy the assets to, relative to the final CSS file.
            assetsPath: 'assets',
            // Use the original file name for the copied asset.
            useHash: false
        },
        // For Tailwind v4, you ONLY need to include the main plugin.
        // It handles nesting and everything else internally.
        '@tailwindcss/postcss': {},

        // Autoprefixer is still recommended for browser compatibility.
        autoprefixer: {}
    }
};
