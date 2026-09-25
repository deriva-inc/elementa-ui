module.exports = {
    plugins: {
        // This plugin is crucial for handling the font paths.
        // It will find the `url()` declarations, copy the fonts to `dist`,
        // and rewrite the paths in the final CSS file.
        'postcss-url': {
            url: 'copy',
            // The base path to search for assets, relative to the CSS file.
            basePath: 'src/styles',
            // Where to copy the assets to, relative to the `dist` folder.
            assetsPath: 'assets',
            useHash: false
        },
        // The main Tailwind CSS plugin for v4.
        '@tailwindcss/postcss': {},
        // Adds vendor prefixes for browser compatibility.
        autoprefixer: {}
    }
};
