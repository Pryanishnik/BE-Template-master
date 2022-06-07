import {Request} from 'express';
import { Profile } from '../models';

export interface CustomRequest extends Request {
    profile: Profile;
}