import waitOn from 'wait-on';
import request from 'supertest';
import getPort from 'get-port';
import {spawn} from 'child_process';

let host: string;

async function launchNow(host: string) {
  const nowDev = spawn('now', ['dev', '--listen', host], {shell: true});
  await waitOn({resources: [`http://${host}`]});
  return () => nowDev.kill('SIGINT');
}

let quitNow: () => void;

beforeAll(async () => {
  host = `127.0.0.1:${await getPort()}`;
  console.log(host);
  quitNow = await launchNow(host);
}, 20000);

afterAll(async () => {
  quitNow();
});

it('renders home', async () => {
  const response = await request(`http://${host}`)
    .get('/')
    .redirects(1);

  expect(response.text).toContain('Math API');
  expect(response.text).toContain(
    'src="/?from=%5Cfrac%7B1%7D%7B%5CGamma(s)%7D%5Cint_%7B0%7D%5E%7B%5Cinfty%7D%5Cfrac%7Bu%5E%7Bs-1%7D%7D%7Be%5E%7Bu%7D-1%7D%5Cmathrm%7Bd%7Du"',
  );
}, 20000);
