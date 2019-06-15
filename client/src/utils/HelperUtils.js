import bcryptVar from 'bcryptjs';
import jwtToken from 'jsonwebtoken';

const HelperUtils = {
    passwordHash(pass) {
        return bcryptVar.hashSync(pass, bcryptVar.genSaltSync(8))
    },

    passwordMatch(passwordHash, pass) {
        return bcryptVar.compareSync(pass, passwordHash);
        if (passwordHash == pass) {
            return true
        } else {
            return false
        }
    },

    isEmailValid(email) {
        return /\S+@\S+\.\S+/.test(email);
    },

    tokenGen(id) {
        const secret = 'sample'
        const newToken = jwtToken.sign({
                userId: id
            },
            secret, { expiresIn: '7d' }
        );
        return newToken;
    },

    toUpperCase(str) {
        if(str==null){
            str='guest';
        }
        return (str.charAt(0).toUpperCase() + str.slice(1));
    }
}

export default HelperUtils;
