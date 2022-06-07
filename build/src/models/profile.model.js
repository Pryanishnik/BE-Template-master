"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const contract_model_1 = require("./contract.model");
const profile_type_1 = require("./profile_type");
let Profile = class Profile extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Profile.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Profile.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Profile.prototype, "profession", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
        allowNull: false
    })
], Profile.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM({ values: Object.keys(profile_type_1.PROFILE_TYPE) }),
    })
], Profile.prototype, "type", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => contract_model_1.Contract, 'ClientId')
], Profile.prototype, "clientContracts", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => contract_model_1.Contract, 'ContractorId')
], Profile.prototype, "contractorContracts", void 0);
Profile = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Profiles'
    })
], Profile);
exports.Profile = Profile;
//# sourceMappingURL=profile.model.js.map