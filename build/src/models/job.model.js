"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const contract_model_1 = require("./contract.model");
let Job = class Job extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => contract_model_1.Contract),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER
    })
], Job.prototype, "ContractId", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false
    })
], Job.prototype, "description", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
        allowNull: false
    })
], Job.prototype, "price", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
], Job.prototype, "paid", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false
    })
], Job.prototype, "paymentDate", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => contract_model_1.Contract)
], Job.prototype, "contract", void 0);
Job = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Jobs'
    })
], Job);
exports.Job = Job;
//# sourceMappingURL=job.model.js.map