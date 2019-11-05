import waitOn from 'wait-on';
import getPort from 'get-port';
import spawn from 'cross-spawn';
import request from 'supertest';

let host: string;
let quitNow: () => void;

async function launchNow(host: string) {
  const nowDev = spawn('now', ['dev', '--listen', host], {
    shell: true,
    // detached: true,
    stdio: 'ignore',
  });
  nowDev.unref();
  // console.log(nowDev.pid);
  try {
    await waitOn({resources: [`http://${host}`]});
  } catch (err) {
    console.error('failed to wait');
    console.error(err);
  }
  return () => {
    nowDev.kill('SIGINT');
  };
}

function app() {
  return request(`http://${host}`);
}

beforeAll(async () => {
  host = `127.0.0.1:${await getPort()}`;
  quitNow = await launchNow(host);
}, 40000);

afterAll(async () => {
  quitNow();
});

it('renders home', async () => {
  const response = await app()
    .get('/')
    .redirects(1);

  expect(response.text).toContain('Math API');
  expect(response.text).toContain(
    'src="/?from=%5Cfrac%7B1%7D%7B%5CGamma(s)%7D%5Cint_%7B0%7D%5E%7B%5Cinfty%7D%5Cfrac%7Bu%5E%7Bs-1%7D%7D%7Be%5E%7Bu%7D-1%7D%5Cmathrm%7Bd%7Du"',
  );
}, 50000);
