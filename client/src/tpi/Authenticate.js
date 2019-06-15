import jwtToken from 'jsonwebtoken';

const Authenticate = {

  async verifyToken(req, res, next) {
    const newToken = req.headers['x-access-token'];
    if(!newToken) {
      return res.status(400).send({ 'message': 'Token is not provided' });
    }
    try {
      const secret = process.env.SECRET;
      const decoded = await jwtToken.verify(newToken, secret);
      const sql = 'SELECT * FROM users WHERE id = $1';
        const response = await fetch('/authQ');
        const { rows } = await response.json();
      // = await database.query(sql, [decoded.userId]);
      if(!rows[0]) {
        return res.status(400).send({ 'message': 'The token you provided is invalid' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch(err) {
      return res.status(400).send(err);
    }
  }
}

export default Authenticate;
