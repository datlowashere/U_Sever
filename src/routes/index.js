const router=require('./routes');
const express=require('express');

function route(index){
    index.use('/',router);
}
module.exports=route;