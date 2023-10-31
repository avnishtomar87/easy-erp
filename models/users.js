module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      mobile_number: {
        type: DataTypes.BIGINT,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return Users;
};
