const bcrypt=require('bcrypt');
const saltrounds=10;


const hashpassword=async(password)=>{
    try {
        const hashedpassword=await bcrypt.hash(password,saltrounds);
        return hashedpassword;
        
    } catch (error) {
        throw new Error('Error in hashing passwords');
    }
};

const comparepasswords=async (plainPassword,hashedpassword)=>{
    try {
        const matched=await bcrypt.compare(plainPassword,hashedpassword);
        return matched
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
}

module.exports={
    hashpassword,
    comparepasswords,
}