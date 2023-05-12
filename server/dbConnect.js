const mongoose=require("mongoose");

module.exports=async () => {
    const mongoUrl="mongodb+srv://anikettarale257:FOAuwApeCVKcRQKC@cluster0.ifjygxf.mongodb.net/?retryWrites=true&w=majority";
    try {

        await mongoose.connect( mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
            console.log("connected Successfully..!!")
        })
        
    } catch (error) {
        console.log("could not connect");
    }
}