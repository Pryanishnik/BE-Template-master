"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const job_model_1 = require("./job.model");
const profile_model_1 = require("./profile.model");
const status_1 = require("./status");
let Contract = class Contract extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false
    })
], Contract.prototype, "terms", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM({ values: Object.keys(status_1.CONTRACT_STATUS) })
    })
], Contract.prototype, "status", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => profile_model_1.Profile),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false
    })
], Contract.prototype, "ClientId", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => profile_model_1.Profile),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false
    })
], Contract.prototype, "ContractorId", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => profile_model_1.Profile)
], Contract.prototype, "profile", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => job_model_1.Job)
], Contract.prototype, "jobs", void 0);
Contract = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Contracts'
    })
], Contract);
exports.Contract = Contract;
//# sourceMappingURL=contract.model.js.map