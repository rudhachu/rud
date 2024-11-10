const config = require('../../config');
const { DataTypes } = require('sequelize');

const WarnsDB = config.DATABASE.define('warns', {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  reasons: {
    type: DataTypes.STRING, // Use STRING to store serialized array as a string
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('reasons');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('reasons', value ? JSON.stringify(value) : null);
    },
  },
  warnCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

async function getWarns(user) {
  return await WarnsDB.findOne({ where: { user } });
}

async function saveWarn(user, reason) {
    let existingWarn = await getWarns(user);
  
    if (existingWarn) {
      existingWarn.warnCount += 1;
  
      if (reason) {
        existingWarn.reasons = existingWarn.reasons || [];
        existingWarn.reasons.push(reason);
      }
  
      await existingWarn.save();
    } else {
      existingWarn = await WarnsDB.create({
        user,
        reasons: reason ? [reason] : null,
        warnCount: 0, 
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  
    return existingWarn;
  }
  

async function resetWarn(user) {
  return await WarnsDB.destroy({
    where: {user},
    truncate: true,
  });
}

module.exports = {
  WarnsDB,
  getWarns,
  saveWarn,
  resetWarn,
};
