"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const getProfile_1 = require("./middleware/getProfile");
const connection_1 = require("./connection");
const db_types_1 = require("./utils/db_types");
const sequelize_1 = require("sequelize");
const http_1 = require("http");
const models_1 = require("./models");
const status_1 = require("./models/status");
const app = (0, express_1.default)();
exports.app = app;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: false
}));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, profile_id');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method == "OPTIONS") {
        return res.status(200).end();
    }
    // Pass to next layer of middleware
    return next();
});
const connection = connection_1.ConnectionFactory.getConnection(db_types_1.DB_TYPES.SQLITE);
/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile_1.getProfile, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const profile_id = req.profile.id;
        const contract = yield models_1.Contract.findOne({
            where: { id, [sequelize_1.Op.or]: [
                    { ContractorID: profile_id },
                    { ClientId: profile_id }
                ] }
        });
        if (!contract)
            return res.status(404).end();
        return res.json(contract);
    }
    catch (err) {
        return res.status(500).json(err).end();
    }
}));
app.get('/contracts', getProfile_1.getProfile, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile_id = req.profile.id;
        const contract = yield models_1.Contract.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { status: http_1.STATUS_CODES.NEW },
                    { status: http_1.STATUS_CODES.IN_PROGRESS }
                ],
                [sequelize_1.Op.or]: [
                    { ContractorID: profile_id },
                    { ClientId: profile_id }
                ]
            }
        });
        if (!contract)
            return res.status(404).end();
        return res.json(contract);
    }
    catch (err) {
        return res.status(500).json(err).end();
    }
}));
app.get('/jobs/unpaid', getProfile_1.getProfile, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile_id = req.profile.id;
        const jobs = yield models_1.Job.findAll({ where: {
                [sequelize_1.Op.or]: [
                    { paid: null },
                    { paid: false }
                ],
            },
            include: {
                model: models_1.Contract,
                attributes: [],
                where: {
                    [sequelize_1.Op.or]: [
                        { ContractorID: profile_id },
                        { ClientId: profile_id }
                    ],
                    status: status_1.CONTRACT_STATUS.IN_PROGRESS
                }
            },
        });
        if (!jobs)
            return res.status(404).end();
        return res.json(jobs);
    }
    catch (err) {
        return res.status(500).json(err).end();
    }
}));
app.post('/jobs/:job_id/pay', getProfile_1.getProfile, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile_id = req.profile.id;
        const result = yield models_1.Job.findOne({ where: {
                id: req.params.job_id
            },
            include: {
                model: models_1.Contract,
                where: {
                    ClientId: profile_id
                }
            },
        });
        const client = yield models_1.Profile.findOne({ where: { id: result.contract.ClientId } });
        const contractor = yield models_1.Profile.findOne({ where: { id: result.contract.ContractorId } });
        const t = yield connection.transaction();
        if (client.balance >= result.price) {
            try {
                client.balance -= result.price;
                contractor.balance += result.price;
                yield client.save({ transaction: t });
                yield contractor.save({ transaction: t });
                result.paid = true;
                result.paymentDate = connection.literal('CURRENT_TIMESTAMP');
                yield result.save({ transaction: t });
                yield t.commit();
            }
            catch (err) {
                t.rollback();
                res.status(500).json(err).end();
            }
        }
        if (!result)
            return res.status(404).end();
    }
    catch (err) {
        return res.status(500).json(err).end();
    }
    return res.status(200).json("SUCCESS");
}));
app.post('/balances/deposit/:user_id', getProfile_1.getProfile, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile_id = req.profile.id;
        if (parseInt(req.params.user_id) != profile_id) {
            return res.status(401).end();
        }
        const deposite = parseInt(req.body.deposite);
        const total = yield models_1.Job.findAll({ raw: true, attributes: [
                [connection.fn('sum', connection.col('price')), 'bill'],
            ], where: {
                [sequelize_1.Op.or]: [
                    { paid: null },
                    { paid: false }
                ],
            },
            include: {
                model: models_1.Contract,
                attributes: [],
                where: {
                    ClientId: profile_id,
                }
            },
        });
        if (!total)
            return res.status(400).end();
        const t = yield connection.transaction();
        try {
            if (total[0]["bill"] * 0.25 > deposite) {
                req.profile.balance += deposite;
            }
            /*
            ** Not sure how it should work exactly, because it should be "deposited" flag for a profile somewhere to avoid depositing too much:)
            */
            yield req.profile.save({ transaction: t });
            t.commit();
        }
        catch (e) {
            t.rollback();
            return res.status(500).send(e).end();
        }
    }
    catch (err) {
        return res.status(500).send(err).end();
    }
    return res.status(200).json("SUCCESS");
}));
app.get('/admin/best-profession/', getProfile_1.getProfile, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const startDate = new Date(req.query.start.toString());
        const endDate = new Date(req.query.end.toString());
        const professions = yield models_1.Job.findAll({
            where: {
                "createdAt": {
                    [sequelize_1.Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                'ContractId',
                [connection.fn('sum', connection.col('price')), 'total_amount'],
            ],
            group: ['ContractId'],
            order: connection.literal('total_amount DESC')
        });
        const top = professions[0];
        const contractor = yield models_1.Contract.findOne({
            where: { id: top.ContractId },
            include: {
                model: models_1.Profile,
                attributes: [
                    'profession'
                ],
            }
        });
        return res.json(contractor.profile);
    }
    catch (err) {
        return res.status(500).send(err).end();
    }
}));
app.get('/admin/best-clients/', getProfile_1.getProfile, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const startDate = new Date(req.query.start.toString());
        const endDate = new Date(req.query.end.toString());
        const limit = parseInt(req.query.limit.toString());
        let orders = yield models_1.Contract.findAll({
            raw: true,
            include: {
                model: models_1.Job,
                required: true,
                where: {
                    "createdAt": {
                        [sequelize_1.Op.between]: [startDate, endDate]
                    },
                    paid: true,
                },
                attributes: [
                    'ContractId',
                    [connection.fn('sum', connection.col('price')), 'total_amount'],
                ],
            },
            group: ['ClientId'],
        });
        orders.sort((a, b) => a["jobs.total_amount"] > b["jobs.total_amount"] ? -1 : 1);
        orders = orders.splice(0, limit);
        const client_map = new Map(orders.map(order => { return [order.ClientId, { paid: order['jobs.total_amount'], fullname: '', id: 0 }]; }));
        const profiles = yield models_1.Profile.findAll({
            where: {
                id: Array.from(client_map.keys()),
            },
            attributes: ['firstName', 'lastName', 'id']
        });
        profiles.forEach(profile => { client_map.get(profile.id).fullname = `${profile.firstName}  ${profile.lastName}`; });
        const resp = [];
        for (let [key, value] of client_map.entries()) {
            value.id = key;
            resp.push(value);
        }
        return res.json(resp);
    }
    catch (err) {
        return res.status(500).send(err).end();
    }
}));
//# sourceMappingURL=app.js.map