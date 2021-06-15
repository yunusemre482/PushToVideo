const Joi =require('@hapi/joi');

const  signUpValidation=(user)=>
{
    const schema = Joi.object({
      
        name: Joi.string()
                  .min(5)
                  .max(30)
                  .required(),

    
        username: Joi.string()
                    .min(5)
                    .alphanum()
                    .max(50)
                    .required(),
             
        email: Joi.string()
               .email()
               .min(5)
               .max(50)
               .required(),

        password: Joi.string()
                .min(3)
                .max(15) 
                .required(), 
                 
        
    }).options({ abortEarly: false });
  
    return schema.validate(user);
}
const  signInValidation=(user)=>
{
    const schema = Joi.object({
                    
        email: Joi.string()
               .email()
               .min(5)
               .max(50)
               .required(),

        password: Joi.string()
                .min(3)
                .max(15) 
                .required(), 
                 
        
    }).options({ abortEarly: false });
  
    return schema.validate(user);
}
 
 
module.exports.signInValidation=signInValidation;
module.exports.signUpValidation=signUpValidation;
