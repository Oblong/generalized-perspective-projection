const projectionMatrix = require('../index.js');
const expect = require('chai').expect;

describe('generalized perspective projection matrix calculation', function() {
  const bottomLeft = [-0.5, -0.5, 0.0];
  const bottomRight = [0.5, -0.5, 0.0];
  const topLeft = [-0.5, 0.5, 0.0];
  const eye = [0.0, 0.0, -1.0];
  const near = 1.0;
  const far = 1000.0;
  const P = projectionMatrix(bottomLeft, bottomRight, topLeft, eye, near, far);

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
