const path = require('path');
const Dotenv = require('dotenv-webpack');
const { useBabelRc, override } = require('customize-cra');

const getConfig = config => {
    config.resolve.modules = [
        ...config.resolve.modules,
        path.join(__dirname, 'src/assets/styles'),
    ];

    config.plugins.push(
        new Dotenv({
            path: '../../.env',
            silent: true, // молчим если нет файла
            systemvars: true, // прокидываем из системных
        })
    );

    return config;
};

module.exports = override(useBabelRc(), getConfig);
