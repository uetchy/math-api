import waitOn from "wait-on";
import getPort from "get-port";
import spawn from "cross-spawn";
import request from "supertest";

export async function launchNow(
  hostname = "127.0.0.1"
): Promise<[request.SuperTest<request.Test>, () => void]> {
  const port = await getPort();
  const host = `${hostname}:${port}`;
  const nowDev = spawn("now", ["dev", "--listen", host], {
    shell: true,
    detached: true,
    stdio: "ignore"
  });
  nowDev.unref();
  try {
    await waitOn({ resources: [`http://${host}`], timeout: 40000 });
  } catch (err) {
    throw new Error("Timeout: launching now dev takes too much time");
  }
  return [
    request(`http://${host}`),
    () => {
      nowDev.kill("SIGINT");
    }
  ];
}
