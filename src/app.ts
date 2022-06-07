import express from "express";
import bodyParser from "body-parser";
import { getProfile } from "./middleware/getProfile";
import { ConnectionFactory } from "./connection";
import { DB_TYPES } from "./utils/db_types";
import { CustomRequest } from "./middleware/custom_request";
import {Op} from "sequelize";
import { STATUS_CODES } from "http";
import { Job, Contract, Profile } from "./models";
import { CONTRACT_STATUS } from "./models/status";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
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

const connection = ConnectionFactory.getConnection(DB_TYPES.SQLITE);
/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile ,async (req: CustomRequest, res) =>{
    try{
        const {id} = req.params
        const profile_id = req.profile.id;
        const contract = await Contract.findOne({
            where: {id, [Op.or]:[
                {ContractorID: profile_id}, 
                {ClientId: profile_id} 
            ]}
        })
        if(!contract) return res.status(404).end()
        return res.json(contract)
    } catch (err){
        return res.status(500).json(err).end()
    }
    
})



app.get('/contracts', getProfile, async (req: CustomRequest, res) =>{
    try{
        const profile_id = req.profile.id;
        const contract = await Contract.findAll({
            where: { 
                [Op.or]: [
                    { status: STATUS_CODES.NEW }, 
                    { status: STATUS_CODES.IN_PROGRESS }
                ], 
                [Op.or]:[
                    {ContractorID: profile_id}, 
                    {ClientId: profile_id} 
            ]}
        })
        if(!contract) return res.status(404).end()
        return res.json(contract)
    } catch (err){
        return res.status(500).json(err).end()
    }   
    
})


app.get('/jobs/unpaid',getProfile ,async (req: CustomRequest, res) =>{
    try{
        const profile_id = req.profile.id;
        const jobs = await Job.findAll({ where: 
            {
                [Op.or]: [
                    { paid: null }, 
                    { paid: false}
                ], 
            }, 
            include: {
                model: Contract,
                attributes: [],
                where: {  
                    [Op.or]:[
                    {ContractorID: profile_id}, 
                    {ClientId: profile_id}],
                    status: CONTRACT_STATUS.IN_PROGRESS 
                }
            },
        });
        if(!jobs) return res.status(404).end()
        return res.json(jobs);
    } catch (err){
        return res.status(500).json(err).end()
    }
    
})


app.post('/jobs/:job_id/pay', getProfile ,async (req: CustomRequest, res) =>{
    try{
        const profile_id = req.profile.id;
        const result = await Job.findOne({ where: 
            {
                id: req.params.job_id
            }, 
            include: {
                model: Contract,
                where: {  
                    ClientId: profile_id
                }
            },
        });
        const client = await Profile.findOne({where: {id: result.contract.ClientId }});
        const contractor = await Profile.findOne({where: {id: result.contract.ContractorId }});

        const t = await connection.transaction();

        if (client.balance >= result.price) {
            try{
                client.balance -= result.price;
                contractor.balance += result.price;
                await client.save({transaction: t});
                await contractor.save({transaction: t});
                result.paid = true;
                result.paymentDate = connection.literal('CURRENT_TIMESTAMP');
                await result.save({transaction: t});   
                await t.commit();
            } catch(err){
                t.rollback();
                res.status(500).json(err).end()
            }
        
        }
        if(!result) return res.status(404).end()
        
    } catch(err){
        return res.status(500).json(err).end();
    }    
    return res.status(200).json("SUCCESS");
})


app.post('/balances/deposit/:user_id', getProfile ,async (req: CustomRequest, res) =>{
    try{
        const profile_id = req.profile.id;
        if ( parseInt(req.params.user_id) != profile_id ){
            return res.status(401).end()
        }

        const deposite = parseInt(req.body.deposite);

        const total = await Job.findAll({ raw: true, attributes: [
            [connection.fn('sum', connection.col('price')), 'bill'],
            ] ,where: 
            {
                [Op.or]: [
                    { paid: null }, 
                    { paid: false}
                ], 
            }, 
            include: {
                model: Contract,
                attributes: [],
                where: {  
                    ClientId: profile_id,
                }
            },
        })


        if(!total) return res.status(400).end()

        const t = await connection.transaction();
        try{
            if(total[0]["bill"]*0.25 > deposite){
                req.profile.balance += deposite;
            }

            /*
            ** Not sure how it should work exactly, because it should be "deposited" flag for a profile somewhere to avoid depositing too much:)
            */
            await req.profile.save({transaction: t});
            t.commit();
        } catch(e){
            t.rollback();
            return res.status(500).send(e).end();
        }
    } catch (err){
        return res.status(500).send(err).end();
    }
    
    return res.status(200).json("SUCCESS");
    
})


app.get('/admin/best-profession/',getProfile ,async (req: CustomRequest, res) =>{
    try {
        const startDate = new Date(req.query.start.toString());
        const endDate = new Date(req.query.end.toString());
    
        const professions = await Job.findAll({
            where: {
                "createdAt": {
                    [Op.between]: [startDate, endDate]
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
    
          const contractor = await Contract.findOne({
              where: {id: top.ContractId},
              include:{
                  model: Profile,
                  attributes: [
                    'profession'
                  ],
              }
          })
    
         return res.json(contractor.profile);
    
    } catch(err) {
        return res.status(500).send(err).end();
    }
       
})


app.get('/admin/best-clients/',getProfile ,async (req: CustomRequest, res) =>{
    try{
        const startDate = new Date(req.query.start.toString());
        const endDate = new Date(req.query.end.toString());
        const limit = parseInt(req.query.limit.toString());let orders = await Contract.findAll({
            raw: true,
            include: {
                model: Job,
                required: true,
                where: {
                "createdAt": {
                    [Op.between]: [startDate, endDate]
                },
                paid: true,
                },
                attributes: [
                'ContractId',
                [connection.fn('sum', connection.col('price')), 'total_amount'],
            ],
            },  
            group: ['ClientId'],

            
        })

        orders.sort((a,b)=> a["jobs.total_amount"] > b["jobs.total_amount"]?  -1: 1)

        orders = orders.splice(0, limit);
        const client_map = new Map(orders.map(order => { return [order.ClientId, { paid: order['jobs.total_amount'], fullname: '', id: 0}] }));

        const profiles= await Profile.findAll({
            where: {
                id: Array.from(client_map.keys()),
            },
            attributes:[ 'firstName', 'lastName', 'id']
        }) 

        profiles.forEach( profile => { client_map.get(profile.id).fullname = `${profile.firstName}  ${profile.lastName}`})


        const resp = [];
        for(let [key, value] of client_map.entries()){
            value.id = key;
            resp.push(value);
        }
        return res.json(resp);
    } catch(err){
        return res.status(500).send(err).end();
    }
    
   
})

export {app};
