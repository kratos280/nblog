var crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        platform_type: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            comment: 'Facebook: 1, Twitter: 2, Google: 3',
            defaultValue: 0,
        },
        platform_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            defaultValue: 0,
        },
        access_token: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        refresh_token: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profile_image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        role: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            defaultValue: 1,
        },
        confirmed: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            defaultValue: 0,
        }
    }, {
        freezeTableName: true,
        tableName: 'users',
        timestamps: true,
        underscored: true,
        paranoid: true,
        indexes: [
            {
                fields: ['platform_type', 'platform_id'],
            },
            {
                fields: ['email', 'password'],
            }
        ],
        instanceMethods: {

        },
        classMethods: {
            hashPassword: function(password) {
                if (password === '') {
                    return '';
                }
                var shasum = crypto.createHash('sha256');
                shasum.update(password);
                return shasum.digest('hex');
            }
        }
    });

    User.PLATFORM_TYPE_FACEBOOK = 1;
    User.PLATFORM_TYPE_TWITTER = 2;
    User.PLATFORM_TYPE_GOOGLE = 3;

    User.ROLE_AUTHOR = 1;
    User.ROLE_EDITOR = 2;
    User.ROLE_ADMIN = 7;

    return User;
};