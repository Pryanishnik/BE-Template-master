import { Profile } from "../models"
import { CustomRequest } from "./custom_request"


const getProfile = async (req: CustomRequest, res, next) => {
    const profile = await Profile.findOne({where: {id: req.get('profile_id') || 0}})
    if(!profile) return res.status(401).end()
    req.profile = profile;
    next()
}
export {getProfile};
