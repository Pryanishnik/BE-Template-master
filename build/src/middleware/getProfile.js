"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const tslib_1 = require("tslib");
const models_1 = require("../models");
const getProfile = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const profile = yield models_1.Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
    if (!profile)
        return res.status(401).end();
    req.profile = profile;
    next();
});
exports.getProfile = getProfile;
//# sourceMappingURL=getProfile.js.map