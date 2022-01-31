import {Request, Response} from 'express'
import shortId from 'shortid';
import { config } from '../config/Constante'
import { URLModel } from '../database/model/URL';

export class URLController{
    public async shorten(req: Request, response: Response): Promise<void>{

        // Ver se a URL já existe
        const { originURL } = req.body;
        const url = await URLModel.findOne({ originURL })

        if (url){
            response.json(url);
            return;
        }
            
        const hash = shortId.generate();
        const shortURL = `${config.API_URL}/${hash}`;

        const newUrl = await URLModel.create({ hash, shortURL, originURL});
        
        response.json ({ newUrl })


    }

    public async redirect(req: Request, response: Response): Promise<void>{

        // Pegar hash da URL
        const { hash } = req.params;
        const url  = await URLModel.findOne({ hash })

        if(url){
            response.redirect(url.originURL);
            return;
        }

        // // Econtrar a URL original pelo hash
        // const url ={
        //     originURL: 'mongodb+srv://Bombs:<password>@url-shortner-dio.bmtoq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
        //     // hash
        // }
    
        response.status(400).json({ error: 'URL not found' })
    }

   
}