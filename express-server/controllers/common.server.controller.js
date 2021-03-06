// ./express-server/controllers/product.server.controller.js
import mongoose from 'mongoose';

//import models
import Countries from '../models/country.model';
import Currencies from '../models/currencies.model';
import Currencylists from '../models/currencylists.model';



export const getCountrylist = (req, res) => {
    Countries.find().exec((err, country) => {
        if (err) {
            return res.json({ 'success': false, 'message': 'Some Error in Countries' });
        }
        return res.json({ 'success': true, 'message': 'Countries fetched successfully', country });
    });
}



export const getCurrencylist = (req, res) => {
    Currencies.find().exec((err, currency) => {
        if (err) {
            return res.json({ 'success': false, 'message': 'Some Error in currencies' });
        }
        return res.json({ 'success': true, 'message': 'currencies fetched successfully', currency });
    });
}







export const getAllCurrencyname = (req, res) => {
    Currencylists.find().exec((err, currencylist) => {
        if (err) {
            return res.json({ 'success': false, 'message': 'Some Error in Currencylists' });
        } else {
          
            return res.json({ 'success': true, 'message': 'currencies fetched successfully', currencylist });

        }
    });
}



export const updateCurrencyName = (req, res) => {
    console.log(req.body)
    Currencylists.findOneAndUpdate({ _id: '5b55d2a8d6c5e42030f69156' }, req.body, { new: true }, (err, currency) => {
        if (err) {
            return res.json({ 'success': false, 'message': 'Some Error', 'error': err });
        }
        return res.json({ 'success': true, 'message': 'Products Updated Successfully', currency });
    })
}


export const getCurrencyname = (req, res) => {
    Currencylists.find().exec((err, currencylist) => {
        if (err) {
            return res.json({ 'success': false, 'message': 'Some Error in Currencylists' });
        } else {
            
            var currencies = [];
            var getcurrencylist = currencylist[0].currencylist;
           // console.log(getcurrencylist[0])
            for (let i = 0; i < Object.keys(getcurrencylist).length; i++) {
                if (getcurrencylist[i].status === 'enable') {
                    currencies = [...currencies, {
                        label: getcurrencylist[i].label,
                        value: getcurrencylist[i].label
                    }];
                }   
            }
            // console.log(Object.keys(currencylist[0].currencylist))
            return res.json({ 'success': true, 'message': 'currencies fetched successfully', currencies });

        }
    });
}



// export const getProducts = (req, res) => {
//     Products.find().exec((err, products) => {
//         if (err) {
//             return res.json({ 'success': false, 'message': 'Some Error in products' });
//         }
//         return res.json({ 'success': true, 'message': 'products fetched successfully', products });
//     });
// }




// export const addProducts = (req, res) => {
//     console.log(req.body);
//     const newProducts = new Products(req.body);
//     newProducts.save((err, product) => {
//         if (err) {
//             return res.json({ 'success': false, 'message': 'Some Error tod' });
//         }
//         return res.json({ 'success': true, 'message': 'Products added successfully', product });
//     })
// }

// export const updateProducts = (req, res) => {
//     console.log(req.body)
//     Products.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, product) => {
//         if (err) {
//             return res.json({ 'success': false, 'message': 'Some Error', 'error': err });
//         }
//         console.log(product);
//         return res.json({ 'success': true, 'message': 'Products Updated Successfully', product });
//     })
// }

// export const getProduct = (req, res) => {
//     console.log(req.params.id)

//     Products.find({ _id: req.params.id }).populate('host').exec((err, product) => {
//         console.log('product', product)
//         if (err) {
//             return res.json({ 'success': false, 'message': 'Some Errord' });
//         }
//         if (product.length) {
//             return res.json({ 'success': true, 'message': 'Products fetched by id successfully', product });
//         } else {
//             return res.json({ 'success': false, 'message': 'Products with the given id not found' });
//         }
//     })
// }

// export const deleteProducts = (req, res) => {
//     Products.findByIdAndRemove(req.params.id, (err, product) => {
//         if (err) {
//             return res.json({ 'success': false, 'message': 'Some Error' });
//         }
//         return res.json({ 'success': true, 'message': 'Products Deleted Successfully', product });
//     })
// }