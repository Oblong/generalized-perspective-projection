const projectionMatrix = require('../index.js');
const expect = require('chai').expect;

describe('generalized perspective projection matrix calculation', function() {

  const bottom_left = [-0.5, -0.5, 0.0];
  const bottom_right = [0.5, -0.5, 0.0];
  const top_left = [-0.5, 0.5, 0.0];
  const eye = [0.0, 0.0, -1.0]
  const near = 1.0;
  const far = 1000.0;
  const P = projectionMatrix(bottom_left, bottom_right, top_left, eye, near, far);

  it('should return an Array(16)', function() {
    expect(P).to.be.an('array');
    expect(P).to.have.lengthOf(16);
  });

  it('should return an Array with no NaNs or Infinity values', function() {
    for (let i = 0; i < 16; i++) {
      expect(P[i]).to.be.a('number');
      expect(P[i]).to.not.equal(NaN);
      expect(P[i]).to.not.equal(Infinity);
    }
  });

});
