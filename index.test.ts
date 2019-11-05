import request from 'supertest';
import {launchNow} from './util/now';

let app: request.SuperTest<request.Test>;
let quitNow: () => void;

jest.retryTimes(3);
beforeAll(async () => {
  [app, quitNow] = await launchNow();
}, 40000);

afterAll(async () => {
  quitNow();
});

it('renders home', async () => {
  const response = await app.get('/').redirects(1);

  expect(response.text).toContain('Math API');
  expect(response.text).toContain(
    'src="/?from=%5Cfrac%7B1%7D%7B%5CGamma(s)%7D%5Cint_%7B0%7D%5E%7B%5Cinfty%7D%5Cfrac%7Bu%5E%7Bs-1%7D%7D%7Be%5E%7Bu%7D-1%7D%5Cmathrm%7Bd%7Du"',
  );
}, 50000);
