module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": true,
    },
    "rules": {
        "comma-dangle": ["error", "never"],
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        "no-underscore-dangle": ["error", { "allow": ["_id"] }]

    }
};