const MissionUtils = require("@woowacourse/mission-utils");
const App = require("../src/App");

const mockQuestions = (answers) => {
  MissionUtils.Console.readLine = jest.fn();
  answers.reduce((acc, input) => {
    return acc.mockImplementationOnce((_, callback) => {
      callback(input);
    });
  }, MissionUtils.Console.readLine);
};

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickNumberInRange = jest.fn();
  numbers.reduce((acc, number) => {
    return acc.mockReturnValueOnce(number);
  }, MissionUtils.Random.pickNumberInRange);
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

const getOutput = (logSpy) => {
  return [...logSpy.mock.calls].join("");
};

const expectLogContains = (received, logs) => {
  logs.forEach((log) => {
    expect(received).toEqual(expect.stringContaining(log));
  });
};

describe("게임 재시작 테스트", () => {
  test("재시작 O 테스트", () => {
    const logSpy = getLogSpy();
    mockRandoms(["1", "0", "0"]);
    mockQuestions(["3", "U", "U", "R", "U", "D", "D"]);

    const app = new App();
    app.play();

    const log = getOutput(logSpy);
    expectLogContains(log, [
        "[ O | X ]",
        "[   |   ]",
        "최종 게임 결과",
        "[ O |   |   ]",
        "[   | O | O ]",
        "게임 성공 여부: 성공",
        "총 시도한 횟수: 2",
    ]);
  });

  test("재시작 X 테스트", () => {
    const logSpy = getLogSpy();
    mockRandoms(["1", "0", "1"]);
    mockQuestions(["3", "U", "U", "Q"]);

    const app = new App();
    app.play();

    const log = getOutput(logSpy);
    expectLogContains(log, [
      "최종 게임 결과",
      "[ O | X ]",
      "[   |   ]",
      "게임 성공 여부: 실패",
      "총 시도한 횟수: 1",
    ]);
  });
});
