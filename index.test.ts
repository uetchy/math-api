import request from "supertest";
import app from ".";

const PREPARE_LIMIT = 50 * 1000;
const OVERALL_LIMIT = PREPARE_LIMIT + 20 * 1000;

jest.retryTimes(3);

it(
  "renders home",
  async () => {
    const response = await request(app).get("/?from=\\sum").redirects(1);

    expect(response.body.toString()).toMatchSnapshot();
  },
  OVERALL_LIMIT
);
