const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false,  // not available for queries only available at created time
    },
    name:{
        type:String,
        required:true
    },

    bio:{
        type:String,
        default:"busy"
    },
    
    avatar:{
        publicId:String,
        url:String
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    followings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]

},{
    timestamps:true
})

module.exports=mongoose.model('user',userSchema);