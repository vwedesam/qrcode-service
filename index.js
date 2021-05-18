
if( process.env.NODE_ENV == "development" || !process.env.NODE_ENV ) require('dotenv').config();
const app = require('express')();
const QRCode = require("easyqrcodejs-nodejs");
const Joi = require('joi')

const port = process.env.PORT || 3210;
const BIT_LOGO = process.env.BIT_LOGO;

const schema = Joi.object({
    text: Joi.string().required(),
    width: Joi.number(),
    height: Joi.number(),
    logo: Joi.string(),
    point1: Joi.string(),
    point0: Joi.string()
})

app.get("/", async (req, res) =>{

    const { value, error } = await schema.validate(req.query);

    if (error) res.status(401).json(error.toString())

    let { text,
        width = 256, 
        height = 256, 
        logo, 
        point0: PO = '#5285F2',
        point1: PI = '#5285F2',
    } = req.query;

    const config = {
        text,
        width,
        height,
        PO,
        PI,
    }

    if(logo != 'none'){
        config.logo = logo || BIT_LOGO;
    }

    // Options
    const options = {
       ...config,
        correctLevel: QRCode.CorrectLevel.H,
        quietZone: 30,
        quietZoneColor: "rgba(0,0,0,0)",
        format: 'PNG',
    };
    const qrcode = new QRCode(options);

    qrcode.toDataURL().then(image_string => {

        const base64Data = image_string.split(",")[1];

        const img = Buffer.from(base64Data, 'base64');

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });

        res.end(img);

    });

})

app.listen(port, ()=>{
    console.log("Server listening o port :"+ port)
})