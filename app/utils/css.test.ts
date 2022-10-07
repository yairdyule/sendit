import { breakpoints, classNames } from "./css";

describe("css utils", () => {
  describe("breakpoint utils", () => {
    let classlist = "";

    beforeEach(() => {
      classlist = "text-white px-4 flex flex-col";
    });

    it("small", () => {
      expect(breakpoints.smallAndUp(classlist)).toEqual(
        "sm:text-white sm:px-4 sm:flex sm:flex-col"
      );
    });
    it("medium", () => {
      expect(breakpoints.mediumAndUp(classlist)).toEqual(
        "md:text-white md:px-4 md:flex md:flex-col"
      );
    });
    it("large", () => {
      expect(breakpoints.largeAndUp(classlist)).toEqual(
        "lg:text-white lg:px-4 lg:flex lg:flex-col"
      );
    });
  });

  test("classNames properly concatenates", () => {
    expect(classNames("h-4", "p-2", "text-emerald-300")).toEqual(
      "h-4 p-2 text-emerald-300"
    );
  });
});
