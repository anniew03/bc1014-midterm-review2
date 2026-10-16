/* Programs embedded in the review page. Expected output is what Java prints. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ReviewSamples = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const samples = {
    larger: {
      label: "Larger.java",
      input: "",
      output: ["7", "9", ""].join("\n"),
      code: [
        "public class Larger {",
        "    public static int larger(int a, int b) {",
        "        if (a > b) {",
        "            return a;",
        "        }",
        "        return b;",
        "    }",
        "",
        "    public static void main(String[] args) {",
        "        int x = larger(7, 3);",
        "        System.out.println(x);",
        "        System.out.println(larger(2, 9));",
        "    }",
        "}"
      ].join("\n")
    },
    brokenAbs: {
      label: "BrokenAbs.java",
      input: "",
      output: ["inside abs, n is 5", "n is -5", ""].join("\n"),
      code: [
        "public class BrokenAbs {",
        "    public static int abs(int n) {",
        "        if (n < 0) {",
        "            n = -n;",
        "        }",
        "        System.out.println(\"inside abs, n is \" + n);",
        "        return n;",
        "    }",
        "",
        "    public static void main(String[] args) {",
        "        int n = -5;",
        "        abs(n);",
        "        System.out.println(\"n is \" + n);",
        "    }",
        "}"
      ].join("\n")
    },
    fixedAbs: {
      label: "FixedAbs.java",
      input: "",
      output: ["x is -5", "result is 5", ""].join("\n"),
      code: [
        "public class FixedAbs {",
        "    public static int abs(int n) {",
        "        if (n < 0) {",
        "            n = -n;",
        "        }",
        "        return n;",
        "    }",
        "",
        "    public static void main(String[] args) {",
        "        // main's variable is x and abs's parameter is n.",
        "        // Different names used here to make it easier to see that they are",
        "        // two separate variables, even though they hold the same value at first.",
        "        int x = -5;",
        "        int result = abs(x);",
        "        System.out.println(\"x is \" + x);",
        "        System.out.println(\"result is \" + result);",
        "    }",
        "}"
      ].join("\n")
    },
    absVariable: {
      label: "AbsVariable.java",
      input: "",
      output: ["7", "4", "0", ""].join("\n"),
      code: [
        "public class AbsVariable {",
        "    public static int abs(int n) {",
        "        int result = n;",
        "        if (result < 0) {",
        "            result = -result;",
        "        }",
        "        return result;",
        "    }",
        "",
        "    public static void main(String[] args) {",
        "        System.out.println(abs(-7));",
        "        System.out.println(abs(4));",
        "        System.out.println(abs(0));",
        "    }",
        "}"
      ].join("\n")
    },
    absExpression: {
      label: "AbsExpression.java",
      input: "",
      output: ["7", "4", "0", ""].join("\n"),
      code: [
        "public class AbsExpression {",
        "    public static int abs(int n) {",
        "        if (n < 0) {",
        "            return -n;",
        "        }",
        "        return n;",
        "    }",
        "",
        "    public static void main(String[] args) {",
        "        System.out.println(abs(-7));",
        "        System.out.println(abs(4));",
        "        System.out.println(abs(0));",
        "    }",
        "}"
      ].join("\n")
    },
    nestedTicket: {
      label: "NestedTicket.java",
      input: "",
      output: ["Ticket bought. Change: 35", "Invalid age", "Invalid price", "Not enough money", ""].join("\n"),
      code: [
        "public class NestedTicket {",
        "    public static void buyTicket(int age, int balance, int price) {",
        "        if (age >= 0) {",
        "            if (price > 0) {",
        "                if (balance >= price) {",
        "                    System.out.println(\"Ticket bought. Change: \" + (balance - price));",
        "                } else {",
        "                    System.out.println(\"Not enough money\");",
        "                }",
        "            } else {",
        "                System.out.println(\"Invalid price\");",
        "            }",
        "        } else {",
        "            System.out.println(\"Invalid age\");",
        "        }",
        "    }",
        "",
        "    public static void main(String[] args) {",
        "        buyTicket(20, 50, 15);",
        "        buyTicket(-1, 50, 15);",
        "        buyTicket(20, 50, 0);",
        "        buyTicket(20, 10, 15);",
        "    }",
        "}"
      ].join("\n")
    },
    earlyTicket: {
      label: "EarlyTicket.java",
      input: "",
      output: ["Ticket bought. Change: 35", "Invalid age", "Invalid price", "Not enough money", ""].join("\n"),
      code: [
        "public class EarlyTicket {",
        "    public static void buyTicket(int age, int balance, int price) {",
        "        if (age < 0) {",
        "            System.out.println(\"Invalid age\");",
        "            return;",
        "        }",
        "        if (price <= 0) {",
        "            System.out.println(\"Invalid price\");",
        "            return;",
        "        }",
        "        if (balance < price) {",
        "            System.out.println(\"Not enough money\");",
        "            return;",
        "        }",
        "        System.out.println(\"Ticket bought. Change: \" + (balance - price));",
        "    }",
        "",
        "    public static void main(String[] args) {",
        "        buyTicket(20, 50, 15);",
        "        buyTicket(-1, 50, 15);",
        "        buyTicket(20, 50, 0);",
        "        buyTicket(20, 10, 15);",
        "    }",
        "}"
      ].join("\n")
    }
  };

  return { samples: samples };
});
