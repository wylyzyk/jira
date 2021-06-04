import { rest } from "msw";
import { setupServer } from "msw/node";
import { http } from "network/http";

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer();

// jest 是对react 最友好的一个测试库
// beforeAll 代表执行所有的测试之前, 先执行以下回调函数
beforeAll(() => server.listen());

// 每一个测试跑完以后, 都充值mock 路由
afterEach(() => server.resetHandlers());

// 所有的测试跑完后, 关闭mock 路由
afterAll(() => server.close());

test("http方法发送异步请求", async () => {
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, context) => {
      return res(context.json(mockResult));
    })
  );

  const result = await http(endpoint);
  // toEqual 不会对比严格相等 如: 结构和内容相等
  // toBe 对比严格相等
  expect(result).toEqual(mockResult);
});

test("http请求时会在header里带上token", async () => {
  const token = "FAKE_TOKEN";
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  let request: any;

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, context) => {
      request = req;
      return res(context.json(mockResult));
    })
  );

  await http(endpoint, { token });
  expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
});
