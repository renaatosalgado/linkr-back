import { trendsRepository } from '../repositories/trendsRepository.js'


export async function listTrends(req, res){
    try{
        const trends = await trendsRepository.trends()
        return res.send(trends.rows)
    }catch(error){
        return res.status(500)
    }
}