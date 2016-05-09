module.exports = function (sequelize, DataTypes) {
    var Post = sequelize.define('Post', {
        post_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(2083),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        freezeTableName: true,
        tableName: 'posts',
        timestamps: true,
        underscored: true,
        paranoid: true,
        indexes: [
        ],
        instanceMethods: {

        },
        classMethods: {
            generateSlug: function(title) {
                return '';
            }
        }
    });

    return Post;
};
